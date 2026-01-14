/**
 * @description 配信者の状態を表すインターフェース
 * @property userId - ユーザーID
 * @property username - ユーザー名(小文字)
 * @property displayName - 表示名
 * @property profileImageUrl - プロフィール画像URL
 * @property isLive - 配信中かどうか
 * @property title - 配信タイトル
 * @property gameId - ゲームID
 * @property gameName - ゲーム名
 * @property startedAt - 配信開始日時(配信中の場合) @optional
 * @property thumbnailUrl - サムネイルURL(配信中の場合) @optional
 * @property viewerCount - 視聴者数
 */
export interface StreamerState {
  userId: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  isLive: boolean;
  title: string;
  gameId: string;
  gameName: string;
  startedAt: string | null;
  thumbnailUrl: string | null;
  viewerCount: number;
}

/**
 * @description 配信者の状態を管理するクラス
 */
export class StateManager {
  private states = new Map<string, StreamerState>();

  /**
   * @description 指定ユーザーの状態を取得
   * @param username - ユーザー名
   * @returns 状態(存在しない場合undefined)
   */
  getState(username: string): StreamerState | undefined {
    return this.states.get(username.toLowerCase());
  }

  /**
   * @description 指定ユーザーの状態を更新
   * @param username - ユーザー名
   * @param newState - 新しい状態
   */
  updateState(username: string, newState: StreamerState): void {
    this.states.set(username.toLowerCase(), newState);
  }

  /**
   * @description 指定ユーザーの状態が存在するか確認
   * @param username - ユーザー名
   * @returns 状態が存在する場合true
   */
  hasState(username: string): boolean {
    return this.states.has(username.toLowerCase());
  }

  /**
   * @description 全ユーザーの状態をコピーして取得
   * @returns 状態Mapのコピー
   */
  getAllStates(): Map<string, StreamerState> {
    return new Map(this.states);
  }
}
