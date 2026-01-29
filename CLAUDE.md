# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# 開発
bun install            # 依存関係インストール
bun run start          # 監視開始
bun run dev            # ホットリロード付き開発

# 品質チェック
bun run lint           # Biomeでlint
bun run check          # Biomeでlint + format修正
bun run typecheck      # TypeScript型チェック

# ビルド
bun run build          # 現在プラットフォーム用にビルド
bun run build:win      # Windows用
bun run build:linux    # Linux用
bun run build:mac      # macOS用
bun run build:all      # 全プラットフォーム
```

## Architecture

Twitch配信者の状態変化をポーリングし、Discord Webhookで通知するCLIアプリ。

```
src/
├── main.ts           # エントリーポイント (監視 or CLI)
├── cli.ts            # 設定管理CLI (add/remove/list/webhook)
├── config/
│   ├── schema.ts     # Zodスキーマ定義 (設定・型)
│   └── loader.ts     # config.json読み込み
├── twitch/
│   ├── auth.ts       # OAuth2クライアント認証
│   ├── api.ts        # Helix API呼び出し
│   └── types.ts      # APIレスポンス型
├── monitor/
│   ├── poller.ts     # 定期ポーリング実行
│   ├── detector.ts   # 状態変化検出ロジック
│   └── state.ts      # 配信者状態管理
├── discord/
│   ├── webhook.ts    # Webhook送信
│   └── embed.ts      # Embed構築
└── utils/
    └── logger.ts     # ログ出力
```

**データフロー**: `Poller` → `TwitchAPI` → `detectChanges` → `buildEmbed` → `sendToWebhook`

## Key Points

- ランタイム: Bun
- 設定バリデーション: Zod (`config/schema.ts`)
- パスエイリアス: `@/*` → `src/*`
- 通知タイプ: online / offline / titleChange / gameChange / titleAndGameChange
- 設定ファイル: `config.json` (テンプレート: `config.example.json`)
