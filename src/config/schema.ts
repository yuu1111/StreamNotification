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

export interface StreamerConfig {
  username: string;
  notifications: NotificationSettings;
  webhooks: string[];
}

export interface NotificationSettings {
  online: boolean;
  offline: boolean;
  titleChange: boolean;
  gameChange: boolean;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export type ChangeType = keyof NotificationSettings;
