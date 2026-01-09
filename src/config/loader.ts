import type { Config } from "./schema";

const CONFIG_PATH = "./config.json";

export async function loadConfig(): Promise<Config> {
  const file = Bun.file(CONFIG_PATH);

  if (!(await file.exists())) {
    throw new Error(
      `設定ファイルが見つかりません: ${CONFIG_PATH}\nconfig.example.json を config.json にコピーして設定してください。`
    );
  }

  const config: Config = await file.json();
  validateConfig(config);
  return config;
}

function validateConfig(config: Config): void {
  if (!config.twitch?.clientId || !config.twitch?.clientSecret) {
    throw new Error("twitch.clientId と twitch.clientSecret は必須です");
  }

  if (!config.polling?.intervalSeconds || config.polling.intervalSeconds < 10) {
    throw new Error("polling.intervalSeconds は10以上で設定してください");
  }

  if (!config.streamers || config.streamers.length === 0) {
    throw new Error("streamers に1人以上の配信者を設定してください");
  }

  for (const streamer of config.streamers) {
    if (!streamer.username) {
      throw new Error("streamer.username は必須です");
    }
    if (!streamer.webhooks || streamer.webhooks.length === 0) {
      throw new Error(`${streamer.username}: webhooks に1つ以上のURLを設定してください`);
    }
    for (const webhook of streamer.webhooks) {
      if (!webhook.startsWith("https://discord.com/api/webhooks/")) {
        throw new Error(`${streamer.username}: 無効なWebhook URL: ${webhook}`);
      }
    }
  }
}
