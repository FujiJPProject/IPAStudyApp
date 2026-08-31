# Task: Sort Visualizer

## ID

003-sort-visualizer

## Status

Blocked

## Depends On

- 001-foundation
- 002-learning-history

---

## Objective

MVP教材である
「ソートアルゴリズム可視化」を実装する。

以下の学習体験を成立させる。

```text
概要
↓
初期状態
↓
処理開始
↓
ステップ実行
↓
処理・状態変化
↓
最終結果
↓
なぜそうなるのか
↓
そこから何が分かるか
```

---

## Source of Truth

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/ui-reference.html`

`ui-reference.html` の具体的なJavaScript処理を
確定仕様として扱わない。

---

## Scope

仕様確定後、以下を実装対象とする。

- `SortMaterial.vue`
- Sort教材固有State
- Sort Domain
- Sort Visualization
- Sort Controls
- Sort Explanation
- 処理開始
- 1ステップ実行
- 状態変化
- リセット
- 完了判定
- 最終結果
- Why
- Insight
- 必要なテスト

---

## Out of Scope

- 自由な配列入力
- 複数ソートアルゴリズム切替
- 自動再生
- 速度変更
- 高度なアニメーション
- 問題演習
- スコア
- 学習進捗
- 他教材
- Generic Material Engine
- Generic Step Engine

---

## Allowed Changes

仕様確定後の基本変更範囲：

```text
src/materials/sort/**
src/materials/definitions.ts
tests/**
```

統合に必要な場合のみ、
既存共通コードを最小変更する。

---

## Confirmed Decisions

architecture.mdにより以下は確定済み。

- ソート固有StateはSortMaterial内部で管理する
- ソート処理はSort Domainへ分離する
- Sort DomainはVue Routerへ依存しない
- Sort DomainはhistoryServiceへ依存しない
- Sort DomainはlocalStorageへ依存しない
- MaterialViewはソート固有Stateを知らない
- Sort Controlsをアプリ共通化しない
- 教材固有CSSはsort領域へ閉じる
- Generic Visualizerを作らない
- Generic Step Engineを作らない

---

## Open Decisions

実装開始前に以下を確定する必要がある。

- 採用するソートアルゴリズム
- 教材で使用する初期配列
- 「1ステップ実行」が何を意味するか
- 比較と交換を同一ステップとして扱うか
- Stepとして保持する情報
- 完了判定
- 比較中・交換・確定状態の表示仕様
- 最終的な説明文の内容

`ui-reference.html` に存在する実装例だけを理由に、
これらを自動確定してはならない。

---

## Unblock Condition

上記Open Decisionsが確定し、
このTaskの `Confirmed Decisions` へ反映された時点で、

```text
Status: Ready
```

へ変更する。

それまでは実装しない。

---

## Acceptance Criteria

仕様確定後、最低限以下を満たす。

- [ ] 教材概要を確認できる
- [ ] 初期状態を確認できる
- [ ] 処理を開始できる
- [ ] 1ステップ実行できる
- [ ] 現在の処理内容を確認できる
- [ ] 状態変化を視覚的に確認できる
- [ ] 最終結果を確認できる
- [ ] 「なぜそうなるのか」を確認できる
- [ ] 「そこから何が分かるか」を確認できる
- [ ] リセットできる
- [ ] PCで主要操作できる
- [ ] スマートフォンで主要操作できる
- [ ] Sort DomainをVueなしでテストできる
- [ ] ソート固有処理が共通領域へ漏れていない
- [ ] `npm run test` が成功する
- [ ] `npm run build` が成功する

---

## Review Output

```text
.agents/reviews/003-sort-visualizer-review.md
```
