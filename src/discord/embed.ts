import type { ChangeType } from "../config/schema";
import type { DetectedChange } from "../monitor/detector";

export interface DiscordEmbed {
  title: string;
  description?: string;
  url?: string;
  color: number;
  thumbnail?: { url: string };
  image?: { url: string };
  fields?: { name: string; value: string; inline?: boolean }[];
  timestamp?: string;
  footer?: { text: string };
  author?: { name: string; icon_url?: string };
}

const COLORS: Record<ChangeType, number> = {
  online: 0x9146ff,
  offline: 0x808080,
  titleChange: 0x00ff00,
  gameChange: 0xff9900,
  titleAndGameChange: 0x00ccff,
};

const TITLES: Record<ChangeType, string> = {
  online: "配信開始",
  offline: "配信終了",
  titleChange: "タイトル変更",
  gameChange: "ゲーム変更",
  titleAndGameChange: "タイトル・ゲーム変更",
};

function formatElapsedTime(startedAt: string | null): string | null {
  if (!startedAt) return null;

  const start = new Date(startedAt).getTime();
  const now = Date.now();
  const diffMs = now - start;

  if (diffMs < 0) return null;

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "たった今";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}分前から配信中`;
  return `${hours}時間${mins}分前から配信中`;
}

function formatDuration(startedAt: string): string {
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  const diffMs = now - start;

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours === 0) return `${mins}分`;
  return `${hours}時間${mins}分`;
}

export function buildEmbed(change: DetectedChange): DiscordEmbed {
  const { type, currentState } = change;
  const channelUrl = `https://twitch.tv/${currentState.username}`;

  const embed: DiscordEmbed = {
    title: TITLES[type],
    url: channelUrl,
    color: COLORS[type],
    author: {
      name: currentState.displayName,
      icon_url: currentState.profileImageUrl,
    },
    timestamp: new Date().toISOString(),
  };

  switch (type) {
    case "online": {
      embed.description = currentState.title || "(タイトルなし)";
      const fields: { name: string; value: string; inline?: boolean }[] = [
        {
          name: "ゲーム",
          value: currentState.gameName || "(未設定)",
          inline: true,
        },
      ];

      if (currentState.startedAt) {
        const startTime = new Date(currentState.startedAt);
        fields.push({
          name: "開始時刻",
          value: startTime.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }),
          inline: true,
        });

        const elapsed = formatElapsedTime(currentState.startedAt);
        if (elapsed && !elapsed.includes("たった今")) {
          embed.footer = { text: elapsed };
        }
      }

      embed.fields = fields;
      if (currentState.thumbnailUrl) {
        const thumbnailUrl = currentState.thumbnailUrl
          .replace("{width}", "440")
          .replace("{height}", "248");
        embed.image = { url: thumbnailUrl };
      }
      break;
    }

    case "offline": {
      const endTime = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });

      const fields: { name: string; value: string; inline?: boolean }[] = [
        { name: "終了時刻", value: endTime, inline: true },
      ];

      if (change.streamStartedAt) {
        fields.push({
          name: "配信時間",
          value: formatDuration(change.streamStartedAt),
          inline: true,
        });
      }

      if (change.vodUrl) {
        fields.push({
          name: "VOD",
          value: `[この配信を見る](${change.vodUrl})`,
          inline: false,
        });
      }

      embed.description = "配信が終了しました";
      embed.fields = fields;

      if (change.vodThumbnailUrl) {
        embed.image = { url: change.vodThumbnailUrl };
      }
      break;
    }

    case "titleChange":
      embed.fields = [
        { name: "変更前", value: change.oldValue || "(なし)", inline: false },
        { name: "変更後", value: change.newValue || "(なし)", inline: false },
      ];
      if (currentState.isLive) {
        embed.footer = { text: "配信中" };
      }
      break;

    case "gameChange":
      embed.fields = [
        { name: "変更前", value: change.oldValue || "(未設定)", inline: true },
        { name: "変更後", value: change.newValue || "(未設定)", inline: true },
      ];
      if (currentState.isLive) {
        embed.footer = { text: "配信中" };
      }
      break;

    case "titleAndGameChange":
      embed.fields = [
        {
          name: "タイトル",
          value: `${change.oldTitle || "(なし)"}\n→ ${change.newTitle || "(なし)"}`,
          inline: false,
        },
        {
          name: "ゲーム",
          value: `${change.oldGame || "(未設定)"}\n→ ${change.newGame || "(未設定)"}`,
          inline: false,
        },
      ];
      if (currentState.isLive) {
        embed.footer = { text: "配信中" };
      }
      break;
  }

  return embed;
}
