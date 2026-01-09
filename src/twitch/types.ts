/**
 * @description Twitch OAuth2トークンレスポンス
 * @property access_token - アクセストークン
 * @property expires_in - 有効期限(秒)
 * @property token_type - トークンタイプ(常に"bearer")
 */
export interface TwitchTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * @description Twitchユーザー情報(Users API)
 * @property id - ユーザーID
 * @property login - ログイン名(小文字)
 * @property display_name - 表示名
 * @property profile_image_url - プロフィール画像URL
 */
export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

/**
 * @description 配信情報(Streams API)
 * @property id - 配信ID
 * @property user_id - 配信者のユーザーID
 * @property user_login - 配信者のログイン名
 * @property user_name - 配信者の表示名
 * @property game_id - ゲームID
 * @property game_name - ゲーム名
 * @property title - 配信タイトル
 * @property viewer_count - 視聴者数
 * @property started_at - 配信開始日時(ISO 8601)
 * @property thumbnail_url - サムネイルURL(プレースホルダー付き)
 */
export interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
}

/**
 * @description チャンネル情報(Channels API)
 * @property broadcaster_id - 配信者のユーザーID
 * @property broadcaster_login - 配信者のログイン名
 * @property broadcaster_name - 配信者の表示名
 * @property game_id - ゲームID
 * @property game_name - ゲーム名
 * @property title - チャンネルタイトル
 */
export interface TwitchChannel {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  game_id: string;
  game_name: string;
  title: string;
}

/**
 * @description VOD情報(Videos API)
 * @property id - 動画ID
 * @property user_id - 配信者のユーザーID
 * @property user_login - 配信者のログイン名
 * @property title - 動画タイトル
 * @property url - 動画URL
 * @property created_at - 作成日時(ISO 8601)
 * @property duration - 再生時間(例: "3h2m1s")
 * @property thumbnail_url - サムネイルURL(プレースホルダー付き)
 */
export interface TwitchVideo {
  id: string;
  user_id: string;
  user_login: string;
  title: string;
  url: string;
  created_at: string;
  duration: string;
  thumbnail_url: string;
}

/**
 * @description Twitch APIの共通レスポンス形式
 * @property data - レスポンスデータの配列
 */
export interface TwitchApiResponse<T> {
  data: T[];
}
