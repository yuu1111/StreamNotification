import type { LogLevel } from "../config/schema";

/** ログレベルの優先度 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * レベル別ログ出力を行うロガー
 */
class Logger {
  private level: LogLevel = "info";

  /**
   * ログ出力レベルを設定する
   * @param level - 設定するログレベル
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * 指定レベルのログを出力すべきか判定する
   * @param level - 判定するログレベル
   * @returns 出力すべき場合true
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  /**
   * ログメッセージをフォーマットする
   * @param level - ログレベル
   * @param message - メッセージ
   * @returns フォーマット済みメッセージ
   */
  private format(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  /**
   * デバッグログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.log(this.format("debug", message), ...args);
    }
  }

  /**
   * 情報ログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.log(this.format("info", message), ...args);
    }
  }

  /**
   * 警告ログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(this.format("warn", message), ...args);
    }
  }

  /**
   * エラーログを出力する
   * @param message - メッセージ
   * @param args - 追加の引数
   */
  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(this.format("error", message), ...args);
    }
  }
}

/** グローバルロガーインスタンス */
export const logger = new Logger();
