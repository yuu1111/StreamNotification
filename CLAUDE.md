# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Twitch配信者の状態変更(配信開始/終了/タイトル変更/ゲーム変更)を検出し、Discord Webhookに通知するBunアプリケーション。

## 開発コマンド

```bash
bun install          # 依存関係インストール
bun run start        # アプリ実行
bun run dev          # ウォッチモードで実行
bun run lint         # Biome lint
bun run format       # Biome format
bun run check        # lint + format (自動修正)
bun run typecheck    # TypeScript型チェック
```

## アーキテクチャ

```
src/
├── main.ts              # エントリーポイント、シグナルハンドリング
├── config/              # 設定読み込み・バリデーション
├── twitch/              # Twitch Helix API連携
│   ├── auth.ts          # Client Credentials認証(トークン自動更新)
│   ├── api.ts           # streams/channels/users API
│   └── types.ts         # APIレスポンス型
├── monitor/             # 監視ロジック
│   ├── poller.ts        # ポーリング制御、変更検出のオーケストレーション
│   ├── state.ts         # 配信者状態管理(Map)
│   └── detector.ts      # 新旧状態比較、変更検出
├── discord/             # Discord通知
│   ├── webhook.ts       # Webhook送信(並列送信対応)
│   └── embed.ts         # 通知タイプ別Embed構築
└── utils/
    └── logger.ts        # レベル別ログ出力
```

## 処理フロー

1. `Poller` が一定間隔で Twitch API をポーリング
2. `StateManager` が各配信者の前回状態を保持
3. `detectChanges()` が新旧状態を比較し変更を検出
4. 変更があれば `buildEmbed()` で通知内容を構築
5. `sendToMultipleWebhooks()` で複数Webhookに並列送信

## パスエイリアス

`@/*` → `src/*` (tsconfig.jsonで設定)

## 設定

`config.example.json` を `config.json` にコピーして使用。Twitch Developer Consoleで Client ID/Secret を取得する必要あり。
