# Review: Sort Visualizer

## Task

`003-sort-visualizer`

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

- File: `src/materials/sort/SortMaterial.vue`、`doc/ui-reference.html`
- Location: `SortMaterial.vue` 132〜168行目、`ui-reference.html` 629〜750行目
- Problem: 正式UI参照では、アルゴリズム選択を基準配列と同じ初期条件領域でバーより前に置き、現在処理・変数・進捗・フローチャートの後にResult / Why / Insightを置く。実装は可視化パネル全体の後にアルゴリズム選択を含む操作列を置き、Result / Why / Insightを含む`SortExplanationPanel`の後にフローチャートを置いている。
- Evidence: 現在のtemplate順は `SortVisualizationPanel` → `SortControls`、右列は `SortExplanationPanel` → `SortFlowchart` であり、Fix後も変更されていない。正式参照の順序は初期条件内のアルゴリズム選択 → 凡例・変数・バー・操作、右列は変数 → 現在処理 → Step進捗 → Flowchart → Result → Why → Insightである。
- Why it matters: 機能自体は利用できるが、開始前に選択条件を確認し、実行中は現在位置を解説と隣接して追い、完了後に結果へ進むという確定済みの情報順序が弱くなる。特に狭い画面では、アルゴリズム選択と現在フローへ到達するための縦移動が増える。
- Required fix: アルゴリズム選択をバーより前の初期条件領域へ置き、フローチャートを現在処理・変数の後かつ完了解説の前へ移す。操作責務やイベントはsort領域内で維持する。本ReviewのMandatory Fixには含めない。

### M-02

- File: `src/materials/sort/components/SortVisualizationPanel.vue`
- Location: 478〜491行目、503〜515行目（620px以下・360px以下の可視化文字サイズ）
- Problem: 狭い幅で、バー上の変数markerと状態文字を `0.5rem`、indexを `0.52rem` まで縮小している。
- Evidence: 一般的な16px root font-sizeでは約8px〜8.32pxとなる。9本のバー内で、日本語の変数名、状態、0始まりindexというTask上の主要情報をこのサイズで読む必要がある。正式UI参照は同じ狭幅条件でbar valueを12pxとしており、markerを追加する場合も可読性優先が要求されている。Fixでは比較operand表示だけが追加され、この文字サイズは変更されていない。
- Why it matters: 1列化と操作の折り返しは実装されているが、360pxで状態・変数・indexを読み取る学習体験の可読性が低い。主要操作不能ではないためHighにはしない。
- Required fix: 360pxでも主要な状態・index・markerを判読できる文字サイズと表示方法へ調整する。長い変数名は短いmarkerと対応表、chip、またはバー外callout等を使い、9本のバーを維持した実ブラウザ確認を行う。本ReviewのMandatory Fixには含めない。

### M-03

- File: `tests/materials/sort/SortMaterial.test.ts`、`tests/materials/sort/SortVisualizationPanel.test.ts`、`tests/materials/sort/sortLogic.test.ts`
- Location: `SortMaterial.test.ts` 全体、`SortVisualizationPanel.test.ts` 全体、`sortLogic.test.ts` 53〜68行目および113〜132行目
- Problem: H-01向けに比較operand、橙バー／外部カード、ARIAの直接テストは追加されたが、architecture.mdがSortMaterialの主要UIテスト対象として定める「7アルゴリズム切り替え」「日本語変数とバー位置表示」「Result / Why / Insight」のUI反映は引き続き十分に直接検証されていない。表示された重複状態の優先順位とflowの`aria-current`も未検証である。
- Evidence: 完了UIのテストはデフォルトのバブルソート1件だけで、アルゴリズム変更はheapとshellへのリセット確認に限られる。新しい`SortVisualizationPanel.test.ts`は旧H-01の3ケースについて説明、変数名、比較値、橙表示、ARIAを検証するが、通常の変数chip／bar marker対応、action > compare > settledのrender結果、`SortFlowchart`の現在位置は対象外である。`resolveBarState()`のhelper単体テストは存在する。
- Why it matters: H-01の再発防止は成立したが、7種類の完了解説や、Domain metadataからmarker・状態優先順位・flow現在位置へ接続する別の回帰は見逃し得る。
- Required fix: 7種類をparameterizeした切り替え・完了解説テスト、変数indexとmarker/chipの対応、重複状態の表示優先順位とARIA label、flow現在nodeの`aria-current="step"`を直接検証する。本ReviewのMandatory Fixには含めない。

---

## Low

None

---

# Verification

実行したコマンド：

```bash
npm run test
npm run build
npx --no-install vitest run tests/materials/sort/SortVisualizationPanel.test.ts --reporter=verbose
```

必要に応じて追加した確認：

- `git status --short`、Task対象差分、`git diff --check -- src/materials/sort tests/materials/sort`の確認
- Viteの`ssrLoadModule`で現行Sort Domainを直接読み込み、旧H-01の指定3入力について説明、日本語変数、`compareOperands`、snapshot、`compareIndices`、橙対象となる配列値を照合
- 100個のランダム順列 × 7アルゴリズム（計700 trace）を追加実行し、昇順完了、入力不変に加え、全19,462 compare Stepでoperandが2件あること、array operandのindex／値がsnapshotと一致すること、external operandがindexを持たないこと、`compareIndices`がarray operandだけに一致することを確認
- `rg`と全ファイル読解により、Sort DomainからVue / Vue Router / historyService / localStorageへの依存がなく、タイマー・CSS・Stateが`src/materials/sort/**`内へ閉じていることを確認
- `package.json`とlock差分を確認し、新規npm依存がないことを確認
- `doc/ui-reference.html`と実装template／responsive CSSを静的比較し、Candidate ReferenceのTailwind CSS、DOM直接操作、単一ファイルJavaScript構造を流用していないことを確認

旧H-01の再検証：

- insertion Step 9: 説明は配列値2と配列外保持値1、日本語変数は比較位置0・書き込み候補1・保持値1、operandはarray 2（index 0）とheld 1、`compareIndices`は`[0]`。UIは値2のバーだけを橙色にし、値1は配列外operandカードで橙色・`状態 比較中`のARIAを持つ。
- shell Step 16: 説明は配列値5と配列外保持値1、operandはarray 5（index 0）とheld 1、`compareIndices`は`[0]`。UIは値5のバーと配列外の値1カードを比較対象として示す。
- merge Step 23: 説明・日本語変数・operandは左buffer値5と右buffer値7で一致し、両operandともexternal、`compareIndices`は空。別値の配列バーを橙色にせず、値5・7をそれぞれ配列外operandカードとARIAで示す。

結果：

- Test: 成功（11 test files、73 tests passed）
- Targeted regression: 成功（旧H-01のinsertion Step 9、shell Step 16、merge Step 23の3 tests passed）
- Build: 成功（`vue-tsc -b && vite build`、70 modules transformed）
- Additional domain verification: 700 / 700 traceで昇順完了・入力不変。19,462 / 19,462 compare Stepでoperand metadata、snapshot、array index、external扱いが整合
- Manual verification: 実ブラウザ操作は未実施。静的確認では900px以下で1列化、620px以下で操作群折り返し、360px以下で操作ボタン全幅化を確認したが、M-02の可読性は解消確認できない

---

# Summary

## Decision

`proceed`

## Mandatory Fixes

- None

## Deferred Findings

- Medium: M-01、M-02、M-03
- Low: None

7種類すべてのtraceが同じ9値から昇順へ完了し、入力不変、ランダム生成・シャッフル、独立開始、Step、自動再生・一時停止・速度変更、切り替え・再開・シャッフル・離脱時のタイマー停止、状態優先順位、位置確定／整列済み範囲、ヒープ2フェーズ、shell gap、7種類の説明と高水準flow、sort領域内の責務分離、新規依存なし、既存回帰については実装・テスト・buildで確認した。

旧H-01は`SortCompareOperand` metadataと表示側の配列内／配列外operand分離により解消した。指定3ケースで説明、日本語変数、operand値、橙表示、ARIAが一致し、配列外operandへ別値のbar indexを割り当てないことを確認した。現在実装にCritical / Highの残存または新規回帰はない。M-01、M-02、M-03はFixer対象外のMediumとして残るが、Task完了を妨げるMandatory Fixではない。

Next step: proceed
