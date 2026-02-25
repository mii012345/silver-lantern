# Silver Lantern - 開発ログ

## プロジェクト概要
- **アプリ**: シンプル習慣トラッカー (Habit Tracker)
- **スタック**: Next.js 16 (static export) + Firebase Hosting + Firebase Auth + Firestore
- **制約**: SSR禁止、静的エクスポートのみ、画面3つ、主要フロー1つ
- **リポ**: https://github.com/mii012345/silver-lantern
- **チーム**: Lead(PM), FE担当, Firebase担当, QA担当, Devil's Advocate

## タイムライン

### Phase 0: セットアップ [完了]
- [x] 環境確認: Node v24.13.0, Firebase CLI, gh CLI (mii012345), Playwright MCP
- [x] チーム作成: silver-lantern
- [x] 課題選定: 習慣トラッカーに決定 (スコア24/25)
- [x] MVP定義: 3画面(ログイン/ダッシュボード/習慣管理), CRUD1機能
- [x] GitHubリポ作成 → 初回push完了

### Phase 1: 並列実装 [進行中]
- [ ] Firebase設定 (firebase-engineer) - Task #4, #6
- [ ] FE実装 (fe-engineer) - Task #5
- [ ] Devil's Advocate レビュー - Task #8

### Phase 2: テスト・品質 [未着手]
- [ ] Playwright E2E 3本 (qa-engineer) - Task #7
- [ ] Quality Gate通し - Task #9

### Phase 3: デプロイ [未着手]
- [ ] Firebase Hosting デプロイ - Task #10
- [ ] Production checklist

## 決定事項
1. **課題**: 習慣トラッカー - SNSで「今日も○○した」投稿は面倒だが記録したいニーズ
2. **データモデル**: `users/{uid}/habits/{id}` + サブコレクション `logs/{dateStr}`
3. **認証**: Google認証のみ (最小MVP)
4. **スタイル**: CSS Modules、最小限のデザイン
5. **ファイル境界**: FE=app/,components/,lib/ | Firebase=firebase.*,firestore.* | QA=e2e/

## ファイル構成
```
silver-lantern/
├── app/                  # FE担当
│   ├── layout.tsx
│   ├── page.tsx          # ログイン画面
│   ├── dashboard/page.tsx # ダッシュボード
│   └── habits/page.tsx   # 習慣管理
├── components/           # FE担当
├── lib/                  # FE担当 (firebase.ts は共有)
├── e2e/                  # QA担当
├── docs/                 # Lead管理
├── firebase.json         # Firebase担当
├── firestore.rules       # Firebase担当
└── next.config.ts        # Lead管理
```

## 次TODO
1. 各エージェントの実装完了を待つ
2. Devil's Advocate フィードバック反映
3. QA起動 → E2Eテスト
4. Quality Gate → デプロイ
