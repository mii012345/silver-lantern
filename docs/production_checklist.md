# Silver Lantern - 本番運用チェックリスト

## Firebase プロジェクト設定

- [ ] Firebase プロジェクト作成 ([Firebase Console](https://console.firebase.google.com/))
- [ ] ウェブアプリを Firebase プロジェクトに追加
- [ ] Google 認証プロバイダ有効化 (Authentication > Sign-in method > Google)
- [ ] Firestore データベース作成（本番モード）
- [ ] Firestore セキュリティルールデプロイ (`firebase deploy --only firestore:rules`)

## 環境変数

- [ ] `.env.local.example` を `.env.local` にコピー
- [ ] 以下の環境変数を Firebase Console から取得し設定:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

取得場所: Firebase Console > プロジェクト設定 > 全般 > マイアプリ

## ビルド・品質チェック

- [ ] TypeScript 型チェック成功:
  ```bash
  npm run typecheck    # tsc --noEmit
  ```

- [ ] ESLint リント成功:
  ```bash
  npm run lint         # next lint
  ```

- [ ] ビルド成功 (static export):
  ```bash
  npm run build        # next build → out/ ディレクトリ生成
  ```

- [ ] E2E テスト成功:
  ```bash
  npm run test:e2e     # npx playwright test
  ```

## デプロイ

- [ ] Firebase CLI ログイン済み:
  ```bash
  firebase login
  ```

- [ ] Firebase プロジェクト紐付け済み:
  ```bash
  firebase use your-project-id
  ```

- [ ] Firebase Hosting デプロイ成功:
  ```bash
  firebase deploy
  ```
  デプロイ対象: `out/` ディレクトリ (firebase.json の `hosting.public` で設定済み)

## デプロイ後の動作確認

- [ ] デプロイURLにアクセスできる (HTTPS)
- [ ] ログイン画面が表示される
- [ ] 「Googleでログイン」でログインできる
- [ ] ダッシュボードに遷移する
- [ ] 「習慣を管理」から習慣管理画面に遷移できる
- [ ] 新しい習慣を追加できる
- [ ] ダッシュボードに戻り、追加した習慣が表示される
- [ ] チェックボックスで習慣を完了できる
- [ ] ストリーク(連続日数)が表示される
- [ ] 習慣管理画面から習慣を削除できる
- [ ] ログアウトできる
- [ ] ログアウト後、ダッシュボードにアクセスするとログイン画面にリダイレクトされる

## セキュリティ確認

- [ ] HTTPS が有効 (Firebase Hosting はデフォルトで有効)
- [ ] Firestore セキュリティルールが適用済み:
  - 認証済みユーザーが自分のデータのみアクセス可能
  - 未認証ユーザーはアクセス不可
  - 他ユーザーのデータにアクセス不可
- [ ] `.env.local` が `.gitignore` に含まれている

## 推奨設定 (オプション)

- [ ] エラーモニタリング設定 (Firebase Crashlytics または Sentry)
- [ ] Firestore バックアップ設定 (Firebase Extensions または Cloud Functions でスケジュール)
- [ ] Firebase Hosting のカスタムドメイン設定
- [ ] Firebase Authentication の承認済みドメイン確認
