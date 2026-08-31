# Review: Learning History

## Task

`002-learning-history`

## Review Date

2026-08-31

## Result

`fix Critical / High`

---

# Findings

## Critical

None

---

## High

### H-01

- File: `.agents/tasks/001-foundation.md`
- Location: 9行目（`Status`）
- Problem: 学習履歴の実装コミット `3099a15` が、指定Taskとは別のTask成果物を `Ready` から `Done` へ変更している。
- Evidence: `git show HEAD -- .agents/tasks/001-foundation.md` で当該差分を確認した。`AGENTS.md` はTask内容の変更を禁止し、`002-learning-history` のAllowed Changesにも `.agents/tasks/**` は含まれていない。
- Why it matters: Taskの状態は実装可否を決めるワークフロー上の基準であり、別Taskの実装中に変更すると、レビュー・実装順序の判断根拠が実装コミットによって書き換えられる。明示された変更規則への直接的な違反である。
- Required fix: `3099a15` に含まれる `.agents/tasks/001-foundation.md` の変更を取り除き、Task状態の更新が必要なら、承認された別ワークフローで扱う。

---

## Medium

### M-01

- File: `src/styles/base.css`
- Location: 253〜278行目、360〜367行目（履歴一覧・履歴項目のスタイル）
- Problem: TaskのAllowed Changesに含まれず、例外として許可された「必要な型またはテスト設定」にも該当しないアプリケーションコードを変更している。
- Evidence: `.agents/tasks/002-learning-history.md` 81〜93行目の許可範囲に `src/styles/base.css` はなく、`git show HEAD -- src/styles/base.css` で33行の変更を確認した。
- Why it matters: 表示自体はUI参照に沿っておりレスポンシブ対応にも寄与するが、Task単位の変更範囲を越えている。既存の `.material-grid` / `.material-card` 等を再利用すれば、許可済みの `HistoryView.vue` 内で同等の構造を構成できる。
- Required fix: `src/styles/base.css` のTask外差分を取り除き、許可済みファイル内で既存スタイルを再利用する。追加CSSが不可欠なら、実装前に変更範囲の明示的な判断を得る。

---

## Low

### L-01

- File: `src/services/historyService.ts`
- Location: 11〜16行目（`isLearningHistoryEntry`）
- Problem: `Date.parse()` が成功することだけで日時を妥当と判定しているため、`August 31, 2026` などISO 8601ではないがブラウザが解釈できる文字列も履歴として受け入れる。
- Evidence: Taskと `architecture.md` は `lastOpenedAt` をISO 8601文字列と定義し、不正なStorageレコードを無視する方針としている。一方、現在のテストは解釈不能な `not-a-date` のみを検証している。
- Why it matters: アプリ自身が書き込む値は `toISOString()` により正しいため通常利用は壊れないが、外部変更・旧データ等の不正値を正規データとして表示する可能性がある。
- Required fix: ISO 8601形式を明示的に検証し、「日時として解釈可能だが非ISO」のStorage値を無視するテストを追加する。

---

# Verification

実行したコマンド：

```bash
npm run test
npm run build
```

必要に応じて追加した確認：

- `git status --short`
- `git diff --stat`
- `git show HEAD --stat`
- `git show HEAD -- .agents/tasks/001-foundation.md src/styles/base.css`
- Task記載の `docs/` は存在しなかったため、リポジトリに存在する同名資料 `doc/requirements.md`、`doc/architecture.md`、`doc/ui-reference.html` を照合した
- 実装、関連テスト、UI参照およびレスポンシブCSSを静的確認した

結果：

- Test: 成功（7 test files、22 tests passed）
- Build: 成功（`vue-tsc -b && vite build`）
- Manual verification: 実ブラウザ操作は未実施。静的確認では履歴の空状態、教材情報・最終閲覧日時表示、教材への再遷移、スマートフォン幅での1カラム化を確認した

---

# Summary

## Decision

`fix Critical / High`

## Mandatory Fixes

- H-01

## Deferred Findings

- Medium: M-01
- Low: L-01

機能面では、正常教材の閲覧記録、同一教材の更新、materialId変更時の更新、不正IDの非保存、新しい順の取得、空状態、履歴からの再遷移、Storage例外時の継続、Service経由の永続化を確認した。テストとビルドも成功している。ただし、別Task成果物の変更は明示された変更規則に違反するため、取り除くまで次工程へ進めない。

Next step: fix Critical / High
