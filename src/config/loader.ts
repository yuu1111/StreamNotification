import type { Config } from "./schema";

/**
 * @description 設定ファイルのパス
 */
const CONFIG_PATH = "./config.json";

/**
 * @description 設定ファイルを読み込んでバリデーションを行う
 * @returns バリデーション済みの設定オブジェクト
 * @throws 設定ファイルが存在しない場合、またはバリデーションエラーの場合
 */
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

/**
 * @description 設定オブジェクトのバリデーションを行う
 * @param config - バリデーション対象の設定オブジェクト
 * @throws バリデーションエラーの場合
 */
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
