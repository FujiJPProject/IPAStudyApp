# Review: Learning History

## Task

`002-learning-history`

## Review Date

2026-09-02

## Result

- [x] Next step: proceed
- [ ] Next step: fix Critical / High

---

# Findings

## Critical

None

---

## High

None

---

## Medium

### M-01

- File: `src/styles/base.css`
- Location: 253〜278行目、360〜367行目（履歴一覧・履歴項目のスタイル）
- Problem: TaskのAllowed Changesに含まれず、例外として許可された「必要な型またはテスト設定」にも該当しないアプリケーションコードの変更が、学習履歴実装コミット `3099a15` に含まれている。
- Evidence: `.agents/tasks/002-learning-history.md` のAllowed Changesに `src/styles/base.css` はなく、`git diff b4d758c..3099a15 -- src/styles/base.css` で履歴専用スタイル33行の追加を確認した。
- Why it matters: 表示内容とレスポンシブ挙動はUI参照に整合しているが、Task単位の変更範囲を越えており、変更責任の追跡を弱める。
- Required fix: 今後同種の変更を行う場合は、許可済みのView内へscoped styleとして置くか、実装前に共通CSSをAllowed Changesへ含める。公開済み履歴のrewriteは本Reviewの必須修正としない。

---

## Low

### L-01

- File: `src/services/historyService.ts`
- Location: 11〜16行目（`isLearningHistoryEntry`）
- Problem: `Date.parse()` が成功することだけで日時を妥当と判定しているため、`August 31, 2026` などISO 8601ではないがJavaScriptで解釈可能な文字列も履歴として受け入れる。
- Evidence: `lastOpenedAt` は `architecture.md` でISO 8601形式と定義される一方、現在のテストは解釈不能な `not-a-date` のみを不正値として検証している。Node.jsで `Date.parse('August 31, 2026')` が有効値になることも確認した。
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

- `git status --short`、`git diff --stat`、`git diff --check`
- `git show --stat --summary b4d758c` と `git show --stat --summary 3099a15`
- `git diff b4d758c..3099a15 -- <Task 002関連ファイル>` により、foundation実装と学習履歴実装の境界およびTask外CSS変更を確認
- `git branch --all --contains b4d758c` と `git branch --all --contains 3099a15` により、両コミットが現在の履歴に含まれることを確認
- `.agents/tasks/001-foundation.md` が現在 `Done` であることを確認
- `.agents/reviews/001-foundation-review.md` が、foundation成果 `b4d758c` と後続Task 002成果 `3099a15` を履歴上分離して正式に検証し、`Next step: proceed` で完了していることを確認
- 実装、関連テスト、`doc/ui-reference.html` およびレスポンシブCSSを静的確認
- `rg` により、Vueコンポーネントからの直接的なlocalStorage操作がなく、アクセスが `historyService` に閉じていることを確認

結果：

- Test: 成功（7 test files、22 tests passed）
- Build: 成功（`vue-tsc -b && vite build`、44 modules transformed）
- Manual verification: 実ブラウザ操作は未実施。静的確認では履歴の空状態、教材情報・最終閲覧日時表示、教材への再遷移、620px以下での1カラム化を確認した

---

# Summary

## Decision

`proceed`

## Mandatory Fixes

- None

## Deferred Findings

- Medium: M-01
- Low: L-01

正常教材の閲覧記録、同一教材の日時更新、materialId変更時の更新、不正IDの非保存、新しい順の取得、空状態、履歴からの再遷移、不正Storage・Storage例外時の継続、Service経由の永続化を実装とテストで確認した。保存項目は `materialId` と `lastOpenedAt` のみに限定され、要件外の進捗・スコア等は導入されていない。

前ReviewのH-01は、Task 001のfoundation成果と後続Task 002成果を分離して検証した正式な `.agents/reviews/001-foundation-review.md` が別ワークフローで追加され、Task 001が `Done`、同Reviewが `Next step: proceed` で完了したことにより、現在のGate判断に必要な独立した承認証跡が成立している。公開済みコミット `3099a15` のrewriteを行わなくても、別Taskの状態変更が未検証のまま承認根拠になるというワークフローリスクは解消されたため、H-01は再掲しない。

Critical / Highの修正必須事項はなく、テストとビルドも成功している。M-01とL-01は実在する非ブロッキング事項として記録し、Task 002はFinalizerへ進められる。

Next step: proceed
