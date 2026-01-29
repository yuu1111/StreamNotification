import type { LogLevel } from "../config/schema";

/**
 * @description ログレベルの優先度マッピング
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * @description レベル別ログ出力を行うロガー
 */
class Logger {
  private level: LogLevel = "info";

  /**
   * @description ログ出力レベルを設定する
   * @param level - 設定するログレベル
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * @description 指定レベルのログを出力すべきか判定する
   * @param level - 判定するログレベル
   * @returns 出力すべき場合true
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  /**
   * @description ログメッセージをフォーマットする
   * @param level - ログレベル
   * @param message - メッセージ
   * @returns フォーマット済みメッセージ
   */
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * @description デバッグログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.log(this.format("debug", message), ...args);
    }
  }

  /**
   * @description 情報ログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.log(this.format("info", message), ...args);
    }
  }

  /**
   * @description 警告ログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.format("warn", message), ...args);
    }
  }

  /**
   * @description エラーログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.format("error", message), ...args);
    }
  }
}

/**
 * @description グローバルロガーインスタンス
 */
export const logger = new Logger();
