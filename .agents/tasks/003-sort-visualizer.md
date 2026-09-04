# Task: Sort Visualizer

## ID

003-sort-visualizer

## Change Type

Modify

## Status

Done

## Depends On

- 001-foundation
- 002-learning-history

---

## Objective

MVP教材である
「ソートアルゴリズム可視化」を実装する。

同じランダムな基準配列を使って7種類のソートアルゴリズムを切り替え、手動Stepと自動再生の双方で、変数、比較、変更、位置確定または整列済み範囲を確認できる教材を完成させる。

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

- `doc/requirements.md`
- `doc/architecture.md`
- `doc/ui-reference.html`

`ui-reference.html` の具体的なJavaScript処理を
確定仕様として扱わない。

---

## Source of Truth Impact

```text
requirements.md: Updated - 7アルゴリズム、ランダム基準配列、操作、Step、状態、変数、フローチャート、完了解説をMVP仕様として確定した
ui-reference.html: Updated - 確定した画面構成、情報配置、操作列、状態凡例、高水準フロー、レスポンシブ表示を反映した
architecture.md: Updated - sort内部の7 trace生成、状態、タイマー責務、Step構造、永続化境界、テスト方針を確定した
```

---

## Candidate References

- `C:\Users\twook\Downloads\sort_algorithm_visualizer.html`

Candidate ReferenceはUI確認用プロトタイプであり、そのHTML、Tailwind CSS、DOM操作、JavaScriptの実装構造は本番へ流用しない。

---

## Scope

以下を実装対象とする。

- `SortMaterial.vue` と必要なsort教材専用子コンポーネントまたはComposable
- Vueに依存しないSort Domain
- バブル、選択、挿入、クイック、マージ、ヒープ、シェルの7 trace生成
- 教材表示時に1から9までを各1回含む長さ9のランダム基準配列を生成
- 7アルゴリズムで同じ基準配列を共有
- アルゴリズム切り替え
- 独立した処理開始
- 1ステップ実行
- 自動再生・一時停止
- 100msから1200msまで50ms刻みの速度変更
- 同じ配列で「最初から」
- 同じ9値を別順序へ並べるシャッフル
- バー、値、0始まりindexによる配列可視化
- 通常、比較、変更、位置確定または整列済み範囲の状態表示と凡例
- 日本語名の現在変数と、変数が指すバー位置
- Step進捗
- 選択中アルゴリズムの高水準フローチャートと現在位置
- 7種類それぞれの最終結果、Why、Insight
- PC、タブレット、スマートフォン、360px程度の狭い幅への対応
- 必要なVitest / Vue Test Utilsテスト

---

## Out of Scope

- 自由な配列入力
- 高度なアニメーション
- 配列長や値域のユーザー変更
- 教材途中状態、選択アルゴリズム、再生速度、配列の永続化
- 問題演習
- スコア
- 学習進捗
- 他教材
- Tailwind CSSその他の新規UI依存
- Generic Material Engine
- Generic Step Engine
- Candidate ReferenceのHTML / CSS / JavaScript構造の流用

---

## Allowed Changes

基本変更範囲：

```text
src/materials/sort/**
src/materials/definitions.ts
tests/**
```

`src/materials/definitions.ts` は教材概要の整合に必要な最小変更だけを許可する。

上記以外の共通コード変更が必要な場合は、変更前に理由を報告する。ソート固有CSSは `src/materials/sort/**` 内へ閉じる。

---

## Confirmed Decisions

- 対象アルゴリズムはバブル、選択、挿入、クイック、マージ、ヒープ、シェルの7種類とする
- 教材表示時に長さ9で値1から9を各1回含むランダム順列を生成する
- ランダム順列と教材途中状態は永続化しない
- 同じ教材表示中は全アルゴリズムで同じ基準配列を共有する
- 教材を開き直した場合は新しい順列を生成する
- アルゴリズム切り替えは自動再生を停止し、基準配列を維持してStep 0へ戻る
- 「最初から」は自動再生を停止し、基準配列とアルゴリズムを維持してStep 0へ戻る
- シャッフルは自動再生を停止し、同じ9値を現在とは別の順序へ並べ、新しい基準配列としてStep 0へ戻る
- 処理開始は独立操作とする
- 1 Stepは学習上観察可能な意味単位とする
- 比較と交換・移動・書き込みを別Stepにする
- フェーズ開始、gap変更、範囲または位置の確定をStepに含める
- 生のloop counter更新だけを独立Stepにしない
- 配列indexは0始まりとする
- ヒープソートはヒープ構築と最大値抽出を区別する
- シェルソートは半減gapを使用し、長さ9では `4 → 2 → 1` とする
- 自動再生は現在Stepから開始し、同じ操作で一時停止する
- 再生速度は100msから1200msまで50ms刻みとする
- 完了、切り替え、「最初から」、シャッフル、教材離脱時は自動再生を停止する
- 色は通常=灰、比較=橙、交換・移動・書き込み=赤、位置確定または整列済み範囲=緑とする
- 色の優先順位は `変更 > 比較 > 位置確定または整列済み > 通常` とする
- 凡例とARIA説明はアルゴリズムに応じて「位置確定」と「整列済み範囲」を使い分ける
- 正式UI参照の初期状態、現在処理、進捗、Result、Why、Insightを維持する
- アルゴリズム選択、日本語変数、バー位置、操作列、高水準フローを追加する
- フローは開始・終了だけを端子、実際の分岐だけをひし形、実際の反復だけを反復形、その他を処理として表示する
- クイックとマージの再帰を直線的な反復として表現しない
- PCは複数列、狭い幅は1列とし、操作群を折り返す
- ソート固有StateはSortMaterialまたはsort教材専用Composableで管理する
- 自動再生タイマーはSortMaterialまたはsort教材専用Composableで管理し、Sort Domainへ入れない
- Sort DomainはVue、Vue Router、historyService、localStorageへ依存しない
- MaterialViewとアプリ共通領域はソート固有Stateを知らない
- 教材固有CSSはsort領域へ閉じる
- Generic Visualizer、Generic Material Engine、Generic Step Engineを作らない

---

## Open Decisions

なし。

---

## Unblock Condition

なし。

---

## Acceptance Criteria

- [ ] 教材表示時に1から9までを各1回含む長さ9の基準配列が生成される
- [ ] 基準配列と教材途中状態が永続化されない
- [ ] バブル、選択、挿入、クイック、マージ、ヒープ、シェルを選択できる
- [ ] 7種類すべてが同じ基準配列から昇順 `[1, 2, 3, 4, 5, 6, 7, 8, 9]` まで完了できる
- [ ] アルゴリズム切り替えで自動再生が停止し、同じ基準配列のStep 0へ戻る
- [ ] 独立した「処理を開始」操作があり、開始前にはStep実行と自動再生が無効である
- [ ] 1ステップ実行で学習上意味のある処理を1つ進められる
- [ ] 比較Stepと交換・移動・書き込みStepが分離されている
- [ ] フェーズ開始、gap変更、範囲または位置の確定が必要なStepとして表現される
- [ ] 生のloop counter更新だけのStepが生成されない
- [ ] ヒープソートでヒープ構築と最大値抽出を区別できる
- [ ] シェルソートのgapが `4 → 2 → 1` になる
- [ ] 自動再生を現在Stepから開始し、同じ操作で一時停止できる
- [ ] 再生速度を100msから1200msまで50ms刻みで変更できる
- [ ] 完了、切り替え、「最初から」、シャッフル、教材離脱時に自動再生が停止する
- [ ] 「最初から」で同じ基準配列とアルゴリズムのStep 0へ戻る
- [ ] シャッフルで同じ9値が直前とは別の順序になりStep 0へ戻る
- [ ] 配列をバー、値、0始まりindexで確認できる
- [ ] 通常=灰、比較=橙、変更=赤、位置確定または整列済み=緑で表示される
- [ ] 状態の優先順位が `変更 > 比較 > 位置確定または整列済み > 通常` である
- [ ] 凡例とARIA説明が色だけに依存せず、アルゴリズムに応じて「位置確定」「整列済み範囲」を使い分ける
- [ ] 現在の処理、日本語名の変数、変数が指すバー位置、Step進捗を確認できる
- [ ] 選択中アルゴリズムの高水準フローチャートと現在位置を確認できる
- [ ] フローチャートが開始・終了、実分岐、実反復、その他の処理を確定した図形で表す
- [ ] クイックとマージの再帰を直線的な反復として表示しない
- [ ] 7種類それぞれの最終結果、Why、Insightを確認できる
- [ ] PC表示で可視化、操作、フローチャート、解説を読み分けられる
- [ ] 360px程度の幅で1列化し、操作が折り返され、主要操作に横スクロールを必要としない
- [ ] Sort Domainが入力配列を変更せず、Vueなしでテストできる
- [ ] 自動再生テストがfake timer等を使い実時間待機へ依存しない
- [ ] 自動再生タイマーとソート固有処理が `src/materials/sort/**` 外へ漏れていない
- [ ] Candidate ReferenceのTailwind CSS、DOM操作、JavaScript構造を本番へ流用していない
- [ ] 新しいnpm依存を追加していない
- [ ] `npm run test` が成功する
- [ ] `npm run build` が成功する
- [ ] 既存機能を壊していない

---

## Reopen History

なし。

---

## Completion Evidence

```text
Final Review: .agents/reviews/003-sort-visualizer-review.md
Review Decision: Next step: proceed
Verification: npm run test / npm run build succeeded
```

---

## Review Output

```text
.agents/reviews/003-sort-visualizer-review.md
```
