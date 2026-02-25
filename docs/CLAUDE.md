# Silver Lantern - 開発ログ

## プロジェクト概要
- **アプリ**: シンプル習慣トラッカー (Habit Tracker)
- **スタック**: Next.js 16 (static export) + Firebase Hosting + Firebase Auth + Firestore
- **制約**: SSR禁止、静的エクスポートのみ、画面3つ、主要フロー1つ
- **リポ**: https://github.com/mii012345/silver-lantern
- **本番URL**: https://silver-lantern-app.web.app
- **チーム**: Lead(PM), FE担当, Firebase担当, QA担当, Devil's Advocate

## タイムライン

### Phase 0: セットアップ [完了]
- [x] 環境確認: Node v24.13.0, Firebase CLI, gh CLI (mii012345), Playwright MCP
- [x] チーム作成: silver-lantern
- [x] 課題選定: 習慣トラッカーに決定 (スコア24/25)
- [x] MVP定義: 3画面(ログイン/ダッシュボード/習慣管理), CRUD1機能
- [x] GitHubリポ作成 → 初回push完了

### Phase 1: 並列実装 [完了]
- [x] Firebase設定: Hosting, Firestore rules, エミュレータ設定
- [x] FE実装: 3画面 (ログイン/ダッシュボード/習慣管理) + AuthGuard + Header
- [x] Devil's Advocate レビュー: 6件修正 (Firestore rules強化, バリデーション, エラーハンドリング)

### Phase 2: テスト・品質 [完了]
- [x] Playwright E2E 8本 (ログイン画面3, 認証ガード2, ナビゲーション3)
- [x] Quality Gate: typecheck ✅ / lint ✅ / build ✅ / test:e2e ✅ (8/8 pass)

### Phase 3: デプロイ [完了]
- [x] Firebase プロジェクト作成 (silver-lantern-app)
- [x] Firestore データベース作成 (asia-northeast1)
- [x] Firestore rules デプロイ
- [x] Firebase Hosting デプロイ → https://silver-lantern-app.web.app
- [x] docs/product.md 作成
- [x] docs/production_checklist.md 作成
- [ ] Google認証プロバイダ有効化 (Firebase Console で手動設定が必要)

## 決定事項
1. **課題**: 習慣トラッカー - SNSで「今日も○○した」投稿は面倒だが記録したいニーズ
2. **データモデル**: `users/{uid}/habits/{id}` + サブコレクション `logs/{dateStr}`
3. **認証**: Google認証のみ (最小MVP)
4. **スタイル**: CSS Modules、最小限のデザイン
5. **ファイル境界**: FE=app/,components/,lib/ | Firebase=firebase.*,firestore.* | QA=e2e/

## Devil's Advocate レビュー結果
### 修正済み (重大・中程度)
1. Firestore rules: read/write一括 → read/create/delete分離 + データバリデーション
2. 習慣名バリデーション: trim() + 100文字上限
3. subscribeHabits: onError コールバック追加
4. ダッシュボード: 楽観的更新ロールバック + エラー表示
5. 習慣管理: input maxLength制約追加

### 記録のみ (軽微)
- Header signOut にエラーハンドリングなし (影響軽微)
- 削除確認ダイアログなし (MVP許容)
- calcStreak がローカルタイムゾーン依存 (日本向けで問題なし)
- 習慣削除時のlogs孤立 (将来Cloud Functionsで対応推奨)

## ファイル構成
```
silver-lantern/
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   ├── globals.css          # グローバルスタイル
│   ├── page.tsx             # ログイン画面
│   ├── page.module.css
│   ├── dashboard/
│   │   ├── page.tsx         # ダッシュボード (習慣チェック + ストリーク)
│   │   └── page.module.css
│   └── habits/
│       ├── page.tsx         # 習慣管理 (追加/削除)
│       └── page.module.css
├── components/
│   ├── AuthGuard.tsx        # 認証ガードHOC
│   ├── AuthGuard.module.css
│   ├── Header.tsx           # 共通ヘッダー
│   └── Header.module.css
├── lib/
│   ├── firebase.ts          # Firebase初期化
│   ├── auth.ts              # 認証 (Google OAuth)
│   └── habits.ts            # 習慣CRUD + ストリーク計算
├── e2e/
│   ├── login.spec.ts        # ログイン画面テスト (3本)
│   ├── auth-guard.spec.ts   # 認証ガードテスト (2本)
│   └── navigation.spec.ts   # ナビゲーションテスト (3本)
├── docs/
│   ├── CLAUDE.md            # 開発ログ (本ファイル)
│   ├── product.md           # 課題選定・仕様
│   ├── setup.md             # セットアップ手順
│   └── production_checklist.md # 本番チェックリスト
├── firebase.json            # Firebase設定
├── firestore.rules          # Firestoreセキュリティルール
├── firestore.indexes.json   # Firestoreインデックス
├── .firebaserc              # Firebase CLI設定
├── .env.local.example       # 環境変数テンプレート
├── playwright.config.ts     # Playwright設定
├── next.config.ts           # Next.js設定 (output: export)
├── eslint.config.mjs        # ESLint設定
├── tsconfig.json            # TypeScript設定
└── package.json             # 依存関係・スクリプト
```

## 残タスク (手動対応)
1. Firebase Console で Google認証プロバイダを有効化
   → https://console.firebase.google.com/project/silver-lantern-app/authentication/providers
2. 動作確認: ログイン → 習慣追加 → チェック → 削除 → ログアウト
