# Task: Learning History

## ID

002-learning-history

## Status

Ready

## Depends On

- 001-foundation

---

## Objective

MVPで必要な最小限の学習履歴機能を実装する。

教材を正常に開いた日時を端末内へ保存し、
学習履歴画面から確認・再訪できるようにする。

---

## Source of Truth

- `docs/requirements.md`
- `docs/architecture.md`
- `docs/ui-reference.html`

---

## Scope

以下を実装する。

- `LearningHistoryEntry`
- `historyService`
- localStorageへの保存
- 教材最終閲覧日時更新
- `HistoryView`
- 履歴なしの空状態
- 履歴から教材への再遷移
- `MaterialView`からの履歴更新
- materialId変更時の履歴更新
- 不正materialId時の非保存
- 不正Storageデータへの耐性
- Storage読み書き失敗時の安全な処理
- 必要なVitest / Vue Test Utilsテスト

---

## Out of Scope

保存しない：

- 学習時間
- ステップ実行回数
- 教材途中状態
- 完了状態
- スコア
- 正答率
- 理解度
- 習熟度
- 進捗率

実装しない：

- 履歴削除
- 履歴編集
- 認証
- DB
- API
- クラウド同期
- Pinia
- Repository

---

## Allowed Changes

```text
src/services/historyService.ts
src/views/MaterialView.vue
src/views/HistoryView.vue
src/materials/types.ts
src/materials/definitions.ts
tests/**
```

必要な型またはテスト設定の最小変更のみ、
他ファイルを変更してよい。

---

## Confirmed Decisions

保存情報：

```text
materialId: string
lastOpenedAt: ISO 8601 string
```

保存単位：

```text
1教材につき1件
```

同一教材を再度開いた場合：

```text
lastOpenedAtを更新
```

履歴へ以下は重複保存しない。

- 教材名
- 分野
- 概要

表示時にMaterial Definitionsから取得する。

保存タイミング：

```text
正常なmaterialIdの教材画面を開いた時点
```

処理開始・処理完了は保存条件にしない。

履歴表示順：

```text
最終閲覧日時の新しい順
```

Storage障害：

```text
履歴保存失敗
≠
教材利用失敗
```

---

## Open Decisions

なし。

---

## Acceptance Criteria

- [ ] 正常な教材を開くと履歴が記録される
- [ ] materialIdが保存される
- [ ] lastOpenedAtがISO 8601形式で保存される
- [ ] 同一教材再閲覧時にレコードを増やさず日時を更新する
- [ ] materialId変更時にも新しい教材の日時が更新される
- [ ] 不正materialIdでは履歴を保存しない
- [ ] 履歴を新しい順に表示できる
- [ ] 履歴から教材へ遷移できる
- [ ] 履歴なしの空状態を表示できる
- [ ] 不正Storage内容でアプリが停止しない
- [ ] localStorage利用不能でも教材画面を利用できる
- [ ] VueコンポーネントからlocalStorageを直接操作していない
- [ ] UIに要件外の進捗・スコア等を表示していない
- [ ] `npm run test` が成功する
- [ ] `npm run build` が成功する

---

## Review Output

```text
.agents/reviews/002-learning-history-review.md
```
