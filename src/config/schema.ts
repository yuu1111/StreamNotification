/**
 * @description アプリケーション全体の設定
 * @property twitch - Twitch API認証情報
 * @property polling - ポーリング設定
 * @property streamers - 監視する配信者のリスト
 * @property log - ログ設定
 */
export interface Config {
  twitch: {
    clientId: string;
    clientSecret: string;
  };
  polling: {
    intervalSeconds: number;
  };
  streamers: StreamerConfig[];
  log: {
    level: LogLevel;
  };
}

/**
 * @description 配信者ごとの設定
 * @property username - Twitchユーザー名
 * @property notifications - 通知設定
 * @property webhooks - Discord Webhook URLのリスト
 */
export interface StreamerConfig {
  username: string;
  notifications: NotificationSettings;
  webhooks: string[];
}

/**
 * @description 通知種別ごとの有効/無効設定
 * @property online - 配信開始通知
 * @property offline - 配信終了通知
 * @property titleChange - タイトル変更通知
 * @property gameChange - ゲーム変更通知
 */
export interface NotificationSettings {
  online: boolean;
  offline: boolean;
  titleChange: boolean;
  gameChange: boolean;
}

/**
 * @description ログ出力レベル
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * @description 変更イベントの種別
 */
export type ChangeType = keyof NotificationSettings | "titleAndGameChange";
