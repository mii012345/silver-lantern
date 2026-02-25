# Silver Lantern - セットアップガイド

## 前提条件

- Node.js 20 以上
- Firebase CLI (`npm install -g firebase-tools`)
- Google アカウント (Firebase 用)

## 初期セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) でプロジェクトを作成
2. Authentication > Sign-in method で「Google」を有効化
3. Firestore Database を作成 (本番モード)
4. Project Settings から Web アプリを追加し、設定値を取得

### 3. 環境変数の設定

```bash
cp .env.local.example .env.local
```

`.env.local` を開き、Firebase Console から取得した値を設定:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=silver-lantern-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=silver-lantern-app
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=silver-lantern-app.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 4. Firebase CLI のログイン

```bash
firebase login
firebase use --add  # プロジェクトを選択
```

## ローカル開発

### Next.js 開発サーバー

```bash
npm run dev
```

http://localhost:3000 でアプリにアクセス。

### Firebase エミュレータ

エミュレータを使うと、本番の Firebase に影響を与えずにローカルで開発・テストできます。

```bash
firebase emulators:start
```

エミュレータが起動するポート:

| サービス     | ポート |
|-------------|--------|
| Auth        | 9099   |
| Firestore   | 8080   |
| Hosting     | 5000   |
| Emulator UI | 4000   |

Emulator UI: http://localhost:4000 で各サービスの状態を確認できます。

**エミュレータ使用時の注意:**
- アプリ側で `connectAuthEmulator()` / `connectFirestoreEmulator()` を呼ぶ必要があります
- エミュレータのデータは停止時にリセットされます
- データを永続化するには: `firebase emulators:start --export-on-exit=./emulator-data --import=./emulator-data`

## ビルド

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。

## デプロイ

### 1. ビルドの実行

```bash
npm run build
```

### 2. Firestore ルールのデプロイ

```bash
firebase deploy --only firestore:rules
```

### 3. Hosting へのデプロイ

```bash
firebase deploy --only hosting
```

### 4. すべて一括デプロイ

```bash
firebase deploy
```

デプロイ後、`https://silver-lantern-app.web.app` でアプリにアクセスできます。

## よくあるコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 静的ビルド |
| `npm run lint` | ESLint 実行 |
| `npm run typecheck` | TypeScript 型チェック |
| `npm run test:e2e` | Playwright E2E テスト |
| `firebase emulators:start` | エミュレータ起動 |
| `firebase deploy` | 全サービスデプロイ |
| `firebase deploy --only hosting` | Hosting のみデプロイ |
| `firebase deploy --only firestore:rules` | ルールのみデプロイ |
