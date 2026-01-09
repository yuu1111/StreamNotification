import type { Config, StreamerConfig } from "../config/schema";
import type { TwitchAPI } from "../twitch/api";
import type { TwitchUser } from "../twitch/types";
import { logger } from "../utils/logger";
import { type DetectedChange, detectChanges } from "./detector";
import { StateManager, type StreamerState } from "./state";

export class Poller {
  private intervalId: Timer | null = null;
  private stateManager = new StateManager();
  private userCache = new Map<string, TwitchUser>();

  constructor(
    private api: TwitchAPI,
    private config: Config,
    private onChanges: (changes: DetectedChange[], streamerConfig: StreamerConfig) => Promise<void>
  ) {}

  async start(): Promise<void> {
    await this.initializeUserCache();
    await this.poll();

    this.intervalId = setInterval(() => this.poll(), this.config.polling.intervalSeconds * 1000);

    logger.info(
      `ポーリング開始 (間隔: ${this.config.polling.intervalSeconds}秒, 配信者: ${this.config.streamers.length}人)`
    );
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info("ポーリング停止");
    }
  }

  private async initializeUserCache(): Promise<void> {
    const usernames = this.config.streamers.map((s) => s.username);
    this.userCache = await this.api.getUsers(usernames);

    for (const streamer of this.config.streamers) {
      const user = this.userCache.get(streamer.username.toLowerCase());
      if (!user) {
        logger.warn(`ユーザーが見つかりません: ${streamer.username}`);
      }
    }
  }

  private combineChanges(changes: DetectedChange[]): DetectedChange[] {
    const titleChange = changes.find((c) => c.type === "titleChange");
    const gameChange = changes.find((c) => c.type === "gameChange");

    if (titleChange && gameChange) {
      const combined: DetectedChange = {
        type: "titleAndGameChange",
        streamer: titleChange.streamer,
        oldTitle: titleChange.oldValue,
        newTitle: titleChange.newValue,
        oldGame: gameChange.oldValue,
        newGame: gameChange.newValue,
        currentState: titleChange.currentState,
      };
      return [...changes.filter((c) => c.type !== "titleChange" && c.type !== "gameChange"), combined];
    }

    return changes;
  }

  private async poll(): Promise<void> {
    try {
      const usernames = this.config.streamers.map((s) => s.username);
      const streams = await this.api.getStreams(usernames);

      const offlineUserIds: string[] = [];
      for (const streamer of this.config.streamers) {
        const user = this.userCache.get(streamer.username.toLowerCase());
        if (user && !streams.has(streamer.username.toLowerCase())) {
          offlineUserIds.push(user.id);
        }
      }

      const channels =
        offlineUserIds.length > 0 ? await this.api.getChannels(offlineUserIds) : new Map();

      for (const streamerConfig of this.config.streamers) {
        const username = streamerConfig.username.toLowerCase();
        const user = this.userCache.get(username);
        if (!user) continue;

        const stream = streams.get(username);
        const channel = channels.get(username);

        const newState: StreamerState = {
          userId: user.id,
          username: user.login,
          displayName: user.display_name,
          profileImageUrl: user.profile_image_url,
          isLive: !!stream,
          title: stream?.title ?? channel?.title ?? "",
          gameId: stream?.game_id ?? channel?.game_id ?? "",
          gameName: stream?.game_name ?? channel?.game_name ?? "",
          startedAt: stream?.started_at ?? null,
          thumbnailUrl: stream?.thumbnail_url ?? null,
          viewerCount: stream?.viewer_count ?? 0,
        };

        const oldState = this.stateManager.getState(username);
        const isInitialPoll = !oldState;

        if (isInitialPoll) {
          const status = newState.isLive
            ? `配信中 - ${newState.gameName || "ゲーム未設定"}`
            : "オフライン";
          logger.info(`[${newState.displayName}] 初期状態: ${status}`);
        }

        let changes = detectChanges(oldState, newState);

        if (isInitialPoll && newState.isLive) {
          changes.push({
            type: "online",
            streamer: newState.username,
            currentState: newState,
          });
        }

        changes = this.combineChanges(changes);

        for (const change of changes) {
          if (change.type === "offline") {
            const vod = await this.api.getLatestVod(user.id);
            if (vod) {
              change.vodUrl = vod.url;
              change.vodThumbnailUrl = vod.thumbnail_url
                .replace("%{width}", "440")
                .replace("%{height}", "248");
            }
          }
        }

        const filteredChanges = changes.filter((c) => {
          if (c.type === "titleAndGameChange") {
            return streamerConfig.notifications.titleChange || streamerConfig.notifications.gameChange;
          }
          return streamerConfig.notifications[c.type];
        });

        if (filteredChanges.length > 0) {
          await this.onChanges(filteredChanges, streamerConfig);
        }

        this.stateManager.updateState(username, newState);
      }
    } catch (error) {
      logger.error("ポーリングエラー:", error);
    }
  }
}
