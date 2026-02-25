# Silver Lantern - プロダクト定義

## Phase 1: 課題選定

### 「SNSで解決されがちだけど面倒」な課題 10個

| # | 課題 | 現状の解決法 | 面倒な点 |
|---|------|-------------|---------|
| 1 | **割り勘計算** | LINEグループで手計算 | 誰が誰にいくら払うか複雑、履歴が流れる |
| 2 | **予定調整** | LINEアンケートやDM | 候補日が多いと把握困難、変更追跡不可 |
| 3 | **買い物リスト共有** | LINEで「○○買って」 | メッセージ埋もれ、買ったかどうか不明 |
| 4 | **貸し借り記録** | 口頭やLINEで「後で返す」 | 忘れる、金額不一致、催促しづらい |
| 5 | **ウィッシュリスト共有** | SNS投稿「これ欲しい」 | プレゼント被り、後から探しにくい |
| 6 | **グループ内投票** | LINEスタンプやリアクション | 選択肢管理困難、集計面倒 |
| 7 | **持ち寄りパーティ管理** | グループチャットで宣言 | 被り確認、当日忘れ、変更追跡 |
| 8 | **読書・映画の感想共有** | Twitterに投稿 | 散らばる、後で振り返りにくい |
| 9 | **ルーティン/習慣トラッカー** | ツイートで「今日も○○した」 | 連続記録が見えない、振り返り困難 |
| 10 | **もらい物・贈り物記録** | 記憶頼み or メモ帳 | 誰から何をもらったか忘れる、お返し管理 |

### スコアリング基準 (各1-5点)

- **A. ニーズ強度**: 多くの人が実際に困っているか
- **B. 静的MVP適合性**: SSR不要で静的サイトとして成立するか
- **C. CRUD明確性**: 1機能のCRUDとして自然にモデル化できるか
- **D. 実装シンプルさ**: 3画面・1フローで最小限のMVPが作れるか
- **E. デモ映え**: 短時間で価値が伝わるか

| # | 課題 | A | B | C | D | E | 合計 |
|---|------|---|---|---|---|---|------|
| 1 | 割り勘計算 | 5 | 4 | 3 | 3 | 4 | 19 |
| 2 | 予定調整 | 5 | 4 | 3 | 2 | 3 | 17 |
| 3 | 買い物リスト共有 | 4 | 5 | 5 | 5 | 4 | 23 |
| 4 | 貸し借り記録 | 4 | 5 | 5 | 4 | 4 | 22 |
| 5 | ウィッシュリスト共有 | 3 | 5 | 5 | 4 | 3 | 20 |
| 6 | グループ内投票 | 3 | 4 | 3 | 3 | 3 | 16 |
| 7 | 持ち寄り管理 | 2 | 4 | 4 | 4 | 3 | 17 |
| 8 | 感想共有 | 3 | 5 | 4 | 4 | 3 | 19 |
| 9 | 習慣トラッカー | 4 | 5 | 5 | 5 | 5 | **24** |
| 10 | もらい物記録 | 3 | 5 | 5 | 4 | 3 | 20 |

### 決定: #9 習慣トラッカー (Habit Tracker) — スコア24点

**決定理由:**
1. **CRUD が最もクリーン**: 習慣(Habit)の作成・読取・更新・削除が1リソースで完結
2. **静的MVP完全適合**: クライアントサイドでFirestore操作のみ、SSR不要
3. **3画面で十分**: ログイン → ダッシュボード(今日のチェック) → 習慣管理
4. **デモ映え**: チェックマークを押すだけで「使ってる感」が出る
5. **ニーズ実証済み**: Habitica, Streaks等の人気アプリが市場検証済み

---

## Phase 2: MVP定義

### コンセプト
**Silver Lantern** — シンプルな習慣トラッカー
「今日やるべきことをチェックするだけ」の最小習慣管理アプリ

### 画面構成 (3画面)

#### 1. ログイン画面 (`/`)
- Googleログインボタン1つ
- 未ログイン時のランディング(アプリ名 + 説明1行 + ログインボタン)

#### 2. ダッシュボード (`/dashboard`)
- 今日の日付表示
- 習慣リスト(チェックボックス形式)
- 各習慣: 名前 + 今日のチェック状態 + 連続日数(streak)
- 「習慣を追加」ボタン → 習慣管理画面へ

#### 3. 習慣管理 (`/habits`)
- 習慣一覧(編集・削除可能)
- 新規追加フォーム(名前のみ入力)
- 削除確認

### 主要フロー
```
ログイン画面 → [Googleログイン] → ダッシュボード → [チェック操作] → 結果反映
                                    ↕
                              習慣管理画面 (CRUD)
```

### データモデル (Firestore)

```
users/{userId}/habits/{habitId}
{
  name: string,          // 習慣名 (例: "朝のジョギング")
  createdAt: timestamp,  // 作成日時
}

users/{userId}/habits/{habitId}/logs/{dateStr}
{
  done: boolean,         // 完了フラグ
  date: string,          // "2026-02-25" 形式
}
```

**設計判断:**
- logs をサブコレクションにすることで、日付ごとのクエリが効率的
- streak計算はクライアントサイドで直近のlogsから算出
- ユーザーごとにデータ完全分離 (`users/{userId}/` 以下)

### Firestore Security Rules (概要)
```
match /users/{userId}/habits/{habitId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;

  match /logs/{logId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

### 技術スタック
- **Frontend**: Next.js 15 (static export, App Router)
- **Hosting**: Firebase Hosting
- **Auth**: Firebase Auth (Google provider)
- **DB**: Cloud Firestore
- **Styling**: CSS Modules (最小限)
- **Testing**: Playwright E2E
- **Linting**: ESLint + TypeScript strict

### ファイル境界 (衝突回避)
- **FE担当**: `src/app/`, `src/components/`, `src/styles/`
- **Firebase担当**: `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`, `src/lib/firebase.ts`
- **QA担当**: `e2e/`, `playwright.config.ts`
- **Lead**: `docs/`, `package.json` (scripts), `next.config.ts`
