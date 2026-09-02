# 応用情報技術者試験 可視化学習Webアプリ

# Phase 3：アーキテクチャ設計

## 1. 設計方針・前提

本MVPでは、以下を優先する。

### 1.1 1教材で学習体験を完成させる

MVPでは以下の4画面と、ソートアルゴリズム可視化1教材を実装対象とする。

- HOME
- 学習一覧
- 可視化教材
- 学習履歴

教材数を増やすことより、

```text
初期状態
↓
処理開始
↓
ステップ実行
↓
状態変化の可視化
↓
最終結果
↓
なぜそうなるのか
↓
そこから何が分かるか
```

という一連の学習体験を完成させることを優先する。

---

### 1.2 アプリ共通部分と教材固有部分を明確に分離する

アプリ共通部分は以下を担当する。

- 画面遷移
- ナビゲーション
- 教材情報
- 教材一覧
- 教材IDから表示対象を決定する仕組み
- 学習履歴

一方、ソート教材固有の以下の概念は共通部分へ持ち込まない。

- 配列
- 比較
- 交換
- ソートアルゴリズム
- 比較対象index
- バー表示
- ソート固有のステップ状態

---

### 1.3 2つ目の教材を追加するための最低限の境界だけ設計する

MVPでは万能な教材エンジンを作らない。

教材共通として定義するのは原則として以下だけとする。

1. 教材の基本情報
2. 教材ID
3. 教材IDと教材コンポーネントの対応

各教材内部の、

- 状態
- Step
- 処理方法
- 可視化方法
- 操作方法

までは共通仕様にしない。

---

### 1.4 状態は利用場所の近くで管理する

教材実行状態は教材内部で管理する。

静的な教材情報や学習履歴のためだけにグローバルStoreを導入しない。

---

### 1.5 永続化処理をUIから分離する

Vueコンポーネントから直接 `localStorage` を操作しない。

学習履歴専用Serviceを設け、

```text
UI
↓
historyService
↓
localStorage
```

とする。

---

### 1.6 過剰なレイヤーを作らない

MVPでは以下を導入しない。

- Pinia
- Repository層
- API Client
- DIコンテナ
- Generic Material Engine
- Generic Step Engine
- 汎用Pluginシステム

必要になった時点で追加する。

---

### 1.7 UIプロトタイプは本番構造として採用しない

`ui-reference.html` から引き継ぐのは主に以下である。

- 画面構成
- 情報配置
- 学習導線
- PC / スマートフォンでの表示方針
- 可視化領域と解説領域の関係

以下は本番実装へそのまま持ち込まない。

- 1ファイルでの画面切り替え
- DOM直接操作
- 教材情報と教材ロジックの同居
- UIからのlocalStorage直接操作
- ソート状態とアプリ共通処理の同居

---

# 2. 技術構成

| 技術             | 役割                                |
| ---------------- | ----------------------------------- |
| Vue 3            | UI構築                              |
| Composition API  | Vueコンポーネント内の状態・処理管理 |
| TypeScript       | データ・教材ロジックの型安全性      |
| Vite             | ローカル開発・production build      |
| Vue Router       | 4画面および教材URLのルーティング    |
| CSS              | レスポンシブUI・共通スタイル        |
| Vitest           | 単体テスト                          |
| Vue Test Utils   | 主要Vueコンポーネントテスト         |
| localStorage     | 学習履歴の端末内保存                |
| Cloudflare Pages | 静的Webアプリの公開先               |

---

## 2.1 Pinia

**MVPでは採用しない。**

MVPで必要な状態は以下で管理できる。

```text
教材実行状態
→ 教材コンポーネント内部

Route状態
→ Vue Router

教材情報
→ 静的な教材定義

学習履歴
→ historyService + 各Viewのローカル状態
```

複数画面間で常時同期するリアクティブなアプリ共通状態が存在しないため、Piniaを導入する具体的な必要性がない。

将来的に認証や複雑な学習進捗管理が追加された時点で再検討する。

---

## 2.2 Repository層

**MVPでは採用しない。**

保存対象は、

- 教材ID
- 最終閲覧日時

のみであるため、

```text
UI
↓
Service
↓
localStorage
```

で十分である。

将来DBへ変更する可能性だけを理由としてRepositoryを先行導入しない。

---

## 2.3 CSSフレームワーク

MVPでは採用しない。

通常のCSSとVue SFCのスタイルで十分な画面規模である。

---

## 2.4 汎用教材エンジン

作成しない。

将来の、

- 数学
- DB
- ネットワーク
- セキュリティ

教材の詳細仕様が未確定であるため、全教材を同一Step・State・Visualizerへ押し込む設計は行わない。

---

# 3. アーキテクチャ

## 3.1 全体構成

```text
App
│
├─ Vue Router
│
├─ HOME
│
├─ 学習一覧
│
├─ 学習履歴
│
└─ MaterialView
       │
       ├─ Material Definitions
       │
       └─ 教材固有Component
                │
                └─ 教材固有Domain Logic
```

学習履歴は別系統として、

```text
MaterialView / HistoryView
          ↓
     historyService
          ↓
      localStorage
```

とする。

---

## 3.2 アプリ共通部分

アプリ共通部分が担当する。

```text
App共通
├─ App
├─ Router
├─ Header / Navigation
├─ HOME
├─ 学習一覧
├─ 学習履歴
├─ 教材基本情報
├─ 教材ID
├─ 教材登録情報
└─ MaterialView
```

以下は知らない。

```text
× 配列
× 比較処理
× 交換処理
× Bubble Sort等のアルゴリズム
× ソートの現在index
× バー表示
× ソートの完了条件
```

---

## 3.3 教材固有部分

MVPでは `sort` 教材が以下を担当する。

```text
SortMaterial
├─ 初期状態
├─ 実行状態
├─ ステップ状態
├─ ソート処理
├─ 状態変化
├─ 可視化
├─ 操作
├─ 現在処理の説明
├─ 最終結果
├─ なぜそうなるのか
└─ そこから何が分かるか
```

---

## 3.4 教材追加のための最低限の境界

教材共通情報として以下を持つ。

```text
MaterialMetadata
├─ id
├─ name
├─ field
└─ summary
```

さらにアプリ内部では、

```text
MaterialDefinition
├─ metadata
└─ 表示するVue教材Component
```

を対応付ける。

教材の内部StateやStep型は `MaterialDefinition` へ持たせない。

---

## 3.5 教材Definitions

MVPでは以前検討した、

```text
catalog.ts
registry.ts
```

という2重登録を行わない。

教材登録場所を、

```text
materials/definitions.ts
```

へまとめる。

ここで、

```text
sort-visualizer
↓
教材基本情報
+
SortMaterial
```

という対応を管理する。

これにより、

「一覧には存在するが教材Componentが登録されていない」

という登録ずれを構造的に減らす。

---

## 3.6 依存方向

基本依存方向は、

```text
View
↓
アプリ共通機能
↓
ブラウザAPI
```

とする。

教材については、

```text
MaterialView
↓
Material Definitions
↓
SortMaterial
↓
Sort Domain
```

となる。

禁止する依存は、

```text
App共通処理
↓
Sort Domain
```

である。

またSort Domainから、

```text
× Vue Router
× localStorage
× historyService
× HistoryView
× MaterialsView
```

へ依存させない。

---

## 3.7 2教材目追加時の影響範囲

例えばDB JOIN教材を追加する場合、

原則として以下だけで対応する。

```text
1. materials/db-join/ を追加
2. definitions.tsへ教材を登録
```

既存の、

- Vue Router
- HOME
- MaterialsView
- HistoryView
- historyService
- SortMaterial
- Sort Domain

は変更しない。

教材固有の新しい機能を追加するために既存ソート教材を変更する構造にしない。

---

# 4. ディレクトリ構成

MVPでは以下を基本構成とする。

```text
project-root/
├─ public/
│
├─ src/
│  ├─ main.ts
│  ├─ App.vue
│  │
│  ├─ router/
│  │  └─ index.ts
│  │
│  ├─ views/
│  │  ├─ HomeView.vue
│  │  ├─ MaterialsView.vue
│  │  ├─ MaterialView.vue
│  │  └─ HistoryView.vue
│  │
│  ├─ components/
│  │  ├─ AppHeader.vue
│  │  └─ MaterialCard.vue
│  │
│  ├─ materials/
│  │  ├─ types.ts
│  │  ├─ definitions.ts
│  │  │
│  │  └─ sort/
│  │     ├─ SortMaterial.vue
│  │     │
│  │     ├─ components/
│  │     │  ├─ SortVisualizationPanel.vue
│  │     │  ├─ SortControls.vue
│  │     │  └─ SortExplanationPanel.vue
│  │     │
│  │     └─ domain/
│  │        ├─ sortTypes.ts
│  │        └─ sortLogic.ts
│  │
│  ├─ services/
│  │  └─ historyService.ts
│  │
│  └─ styles/
│     ├─ variables.css
│     └─ base.css
│
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 4.1 `App.vue`

アプリ全体の共通レイアウトを担当する。

基本的には、

```text
AppHeader
RouterView
```

を配置する。

MVPでは別途 `AppLayout.vue` を設けない。

複数レイアウトが必要になった場合のみ追加する。

---

## 4.2 `router/index.ts`

以下を担当する。

- Route定義
- History Mode設定
- 未知URLへの対応

教材ごとにRouteを追加しない。

---

## 4.3 `materials/types.ts`

教材共通で本当に必要な最小型のみ定義する。

対象は主に、

- MaterialMetadata
- MaterialDefinition

である。

教材内部のStep型等は定義しない。

---

## 4.4 `materials/definitions.ts`

全教材の、

- ID
- 名前
- 分野
- 概要
- 表示する教材Component

の対応を管理する。

教材固有ロジックそのものは持たない。

---

## 4.5 `materials/sort/`

ソート教材専用領域。

他教材がこのディレクトリへ依存する前提にしない。

---

## 4.6 `materials/sort/domain/`

Vueに依存しないソート教材固有ロジックを置く。

以下の7種類について、入力配列から学習用のtraceを生成する責務を持つ。

- バブルソート
- 選択ソート
- 挿入ソート
- クイックソート
- マージソート
- ヒープソート
- シェルソート

7種類を別ファイルへ分けるか、関連する小さな単位へまとめるかは実装規模に応じて決めてよい。ただし、各アルゴリズムの処理が相互に条件分岐で絡み合う巨大な関数にはしない。

初期配列とシャッフル用配列の生成もソート教材内部へ置き、テストで乱数源を制御できる純粋な処理として分離する。

---

## 4.7 `services/historyService.ts`

学習履歴の、

- 読み込み
- 教材最終閲覧日時の更新
- localStorageアクセス

を担当する。

---

## 4.8 Composable

MVPではアプリ共通Composable用ディレクトリを先行作成しない。

現時点では、

- 教材情報 → definitions
- 履歴 → service
- 教材実行状態 → SortMaterial

で管理できるためである。

ソート教材内部の状態管理が大きくなった場合のみ、

```text
materials/sort/useSortMaterial
```

のような**教材専用Composable**への分離を検討する。

今回のソート教材では、自動再生タイマーを含む実行状態を `SortMaterial.vue` に置いても、`materials/sort/` 内の教材専用Composableへ分離してもよい。どちらの場合も、タイマーとVueのライフサイクル処理をSort Domainへ持ち込まない。

---

# 5. 画面・ルーティング構成

## 5.1 URL

| URL                      | 画面       |
| ------------------------ | ---------- |
| `/`                      | HOME       |
| `/materials`             | 学習一覧   |
| `/materials/:materialId` | 可視化教材 |
| `/history`               | 学習履歴   |

ソート教材のURLは、

```text
/materials/sort-visualizer
```

とする。

---

## 5.2 教材画面

教材ごとにRouteを追加せず、

```text
/materials/:materialId
```

を共通Routeとして利用する。

将来的に、

```text
/materials/sort-visualizer
/materials/db-join
/materials/subnet
```

のように教材IDだけを変更する。

---

## 5.3 materialId

materialIdは教材の永続的な識別子として扱う。

教材表示名を変更しても、原則としてmaterialIdは変更しない。

学習履歴との関連付けにも使用するためである。

---

## 5.4 MaterialViewの責務

MaterialViewでは、

```text
route.params.materialId
↓
Material Definitionsから教材検索
↓
存在確認
↓
教材情報表示
↓
履歴更新
↓
教材Component表示
```

を行う。

ソート内部状態は管理しない。

---

## 5.5 materialId変更への対応

重要な設計事項として、

**MaterialViewの初回表示時だけでなく、同じMaterialView上で `materialId` が変更された場合にも教材解決と履歴更新を行う。**

例えば、

```text
/materials/sort-visualizer
↓
/materials/db-join
```

へ遷移した場合でも、DB JOIN教材の最終閲覧日時を記録できる構成とする。

---

## 5.6 不正なmaterialId

例えば、

```text
/materials/unknown
```

の場合、

- 学習履歴を記録しない
- 教材が見つからない旨をMaterialView内で表示する
- 学習一覧へ戻る導線を表示する

とする。

別教材へ自動フォールバックさせない。

---

## 5.7 未知URL

例えば、

```text
/unknown-path
```

のようにどのRouteにも一致しない場合は、Vue Routerのcatch-all RouteでHOMEへ戻す。

MVPの正式画面を5画面へ増やす必要はない。

Vue RouterではHTML5 History Mode利用時、サーバー側のSPA fallbackに加え、アプリ側でも未知Routeを処理することが推奨されている。

---

## 5.8 Router Mode

**HTML5 History Modeを採用する。**

Vue Routerでは `createWebHistory()` がHTML5 History Modeとして推奨されている。

URLは、

```text
/materials/sort-visualizer
```

とし、

```text
/#/materials/sort-visualizer
```

にはしない。

---

# 6. コンポーネント構成

## 6.1 共通コンポーネント

### AppHeader.vue

責務：

- ブランド
- HOME
- 学習一覧
- 学習履歴
- 現在Routeに応じたナビゲーション表示

---

### MaterialCard.vue

責務：

- 教材名
- 分野
- 概要
- 教材への遷移導線

複数教材になった場合も同じ単位で利用する。

---

# 6.2 画面コンポーネント

## HomeView.vue

責務：

- アプリ目的の説明
- 学習開始導線
- 学習履歴への導線
- 基本的な学習フロー説明

教材固有ロジックを持たない。

---

## MaterialsView.vue

責務：

- Material Definitionsから教材一覧を取得
- MaterialCardとして表示
- 教材画面へ遷移

---

## MaterialView.vue

責務：

- materialId取得
- 教材の存在確認
- 教材情報表示
- 履歴更新
- 教材Component表示
- 学習一覧へ戻る共通導線

教材固有Stateやロジックを持たない。

---

## HistoryView.vue

責務：

- historyServiceから履歴取得
- 最終閲覧日時の表示
- 教材Definitionsとの結合
- 空状態表示
- 教材へ再遷移

MVPでは専用の `LearningHistoryList.vue` を設けない。

履歴UIが複雑化した場合にのみ切り出す。

---

# 6.3 ソート教材コンポーネント

## SortMaterial.vue

ソート教材のルートコンポーネント。

主な責務：

- ソート教材の実行状態
- 基準配列の生成と保持
- 選択中アルゴリズム
- 処理開始
- ステップ実行
- 自動再生・一時停止
- 再生速度
- 最初から
- シャッフル
- アルゴリズム切り替え
- 完了判定
- 各教材子コンポーネントへの状態受け渡し

具体的なソート処理はDomainへ委譲する。

---

## SortVisualizationPanel.vue

責務：

- 初期状態
- 現在状態
- ソート固有の可視化
- 配列等の状態表現
- バー、値、0始まりindex
- 比較中、変更中、位置確定または整列済みの状態
- 日本語名の変数と、変数が指すバー位置

バー状態はStepのindex集合から算出し、

```text
交換・移動・書き込み
> 比較
> 位置確定または整列済み
> 通常
```

の優先順位で1つの表示状態へ解決する。色だけに依存せず、同じ意味を凡例とARIA説明へ渡す。

---

## SortControls.vue

責務：

- 処理開始
- 1ステップ実行
- 自動再生・一時停止
- 再生速度変更
- 最初から
- シャッフル
- アルゴリズム切り替え

操作方法は教材によって異なる可能性があるため、アプリ共通コンポーネントにはしない。

---

## SortExplanationPanel.vue

責務：

- 現在実行中の処理
- ステップ状況
- 最終結果
- なぜそうなるのか
- そこから何が分かるか

を表示する。

Result、Why、InsightをMVP段階でさらに小さなコンポーネントへ分割しない。

---

## Sort Flowchart

選択中アルゴリズムの高水準な処理と現在位置を表示する。

フローチャートの図形種別と表示文言はUI表現であり、ソートの配列更新ロジックへ混在させない。DomainのStepは現在の処理を識別できるflow node IDを持ち、UI側が対応する表示定義と結び付ける。

クイックソートとマージソートでは再帰を明示し、単純な直線反復として扱わない。

---

## 6.4 共通化しないコンポーネント

MVPでは以下を作らない。

```text
GenericVisualizer
GenericMaterialControls
GenericStepPanel
GenericResultPanel
GenericMaterialEngine
```

2教材目以降を実装し、実際に共通責務が確認できた場合にのみ共通化を検討する。

---

# 7. データ構造

## 7.1 教材基本情報

### MaterialMetadata

| 項目    | 型     | 内容               |
| ------- | ------ | ------------------ |
| id      | string | 教材の一意識別子   |
| name    | string | ユーザー向け教材名 |
| field   | string | 分野               |
| summary | string | 教材概要           |

MVPではこの4項目だけを必須とする。

---

## 7.2 MaterialDefinition

アプリ内部で教材を表示するため、

```text
MaterialDefinition
├─ metadata
└─ component
```

という対応を持つ。

`component` は対象教材のVue Componentを表す。

これは教材内部Stateを共通化するものではなく、教材IDから表示対象を決定するためだけの情報である。

---

## 7.3 field

MVPでは単純な文字列として扱う。

現段階で、

- アルゴリズム
- 数学
- DB
- ネットワーク
- セキュリティ

等を固定Enumとして先行設計しない。

分野検索等が必要になった時点で再検討する。

---

## 7.4 学習履歴

### LearningHistoryEntry

| 項目         | 型     | 内容         |
| ------------ | ------ | ------------ |
| materialId   | string | 教材ID       |
| lastOpenedAt | string | 最終閲覧日時 |

`lastOpenedAt` はISO 8601形式として保存する。

教材名・分野・概要は履歴データへ重複保存しない。

表示時にMaterial Definitionsから取得する。

---

## 7.5 履歴保存単位

1教材につき1件とする。

同じ教材を再度開いた場合、

```text
新規追加
```

ではなく、

```text
lastOpenedAt更新
```

とする。

履歴画面では最終閲覧日時の新しい順で表示する。

---

## 7.6 教材固有状態

ソート教材内部では概念的に以下を持つ。

```text
Sort Material State
├─ 基準配列
├─ 選択中アルゴリズム
├─ 選択中アルゴリズムのtrace
├─ 現在Step index
├─ 開始前 / 実行中 / 一時停止 / 完了
├─ 再生速度
└─ 自動再生中か
```

アルゴリズム識別子はソート教材内部だけで使用し、以下の7種類を表す。

```text
bubble
selection
insertion
quick
merge
heap
shell
```

各Stepは少なくとも以下をUIへ提供できる構造とする。

```text
Sort Step
├─ Step後の配列snapshot
├─ 処理フェーズまたはflow node ID
├─ 学習者向けの処理説明
├─ 日本語表示名を持つ現在変数
├─ 変数が指すindex
├─ 比較対象index
├─ 交換・移動・書き込み対象index
├─ 位置確定または整列済み範囲のindex
├─ 確定 / 整列済みの意味区分
└─ 完了状態
```

具体的なアルゴリズム内部変数はアルゴリズムごとに異なってよい。異なるアルゴリズムを共通の疑似変数へ無理に合わせない。

1 Stepは学習上観察可能な意味単位とし、比較と交換・移動・書き込みを分離する。フェーズ開始、シェルソートのgap変更、範囲や位置の確定はStepに含め、生のloop counter更新だけはStepにしない。

配列indexは0始まりとする。ヒープソートはヒープ構築と最大値抽出を区別する。シェルソートのgapは半減方式を使用し、長さ9では `4 → 2 → 1` とする。

入力配列を直接変更せず、traceの各snapshotから状態変化を再現できるようにする。

---

# 8. 状態管理方針

## 8.1 画面ローカル状態

教材実行状態は `SortMaterial.vue` 側で管理する。

```text
SortMaterial
├─ 基準配列
├─ 選択中アルゴリズム
├─ traceと現在Step
├─ 開始 / 一時停止 / 完了状態
├─ 再生速度
└─ 自動再生タイマー
```

教材画面から離れた場合は破棄してよい。

MVPでは教材途中状態を永続化しないためである。

教材表示時に、1から9までを各1回含む長さ9のランダム順列を基準配列として生成する。同じ教材表示中は7種類すべてで同じ基準配列を共有する。

状態遷移は以下とする。

- アルゴリズム切り替え: 自動再生を停止し、基準配列を維持して選択したアルゴリズムのStep 0へ戻る
- 最初から: 自動再生を停止し、基準配列とアルゴリズムを維持してStep 0へ戻る
- シャッフル: 自動再生を停止し、同じ9値を現在とは別の順序へ並べ替え、その配列を新しい基準配列としてStep 0へ戻る
- 完了: 自動再生を停止する
- 教材離脱: タイマーを破棄する

自動再生は現在Stepから開始し、同じ操作で一時停止する。速度は100msから1200msまで50ms刻みとする。

---

## 8.2 アプリ共通状態

MVPではリアクティブなグローバルStoreを持たない。

### 教材情報

Material Definitionsから取得する。

### Router状態

Vue Routerから取得する。

### 履歴

historyServiceから必要なViewが読み込む。

---

## 8.3 永続状態

永続化対象は、

```text
materialId
lastOpenedAt
```

のみである。

以下は保存しない。

- 現在Step
- 配列状態
- 選択中アルゴリズム
- 再生速度
- 操作回数
- 学習時間
- 完了状態
- スコア
- 理解度

---

## 8.4 Pinia

MVPでは不採用とする。

複数画面で共有する複雑なリアクティブStateが必要になった場合のみ、将来再評価する。

---

# 9. 永続化方針

## 9.1 構成

教材閲覧時は、

```text
MaterialView
↓
historyService
↓
localStorage
```

履歴表示時は、

```text
HistoryView
↓
historyService
↓
localStorage
```

とする。

---

## 9.2 historyServiceの責務

最低限以下を担当する。

- 学習履歴を取得する
- 教材の最終閲覧日時を記録・更新する

要件にない削除・編集API等は作らない。

---

## 9.3 保存タイミング

正常な教材IDが解決され、教材画面を開いた時点で記録する。

例えば、

```text
/materials/sort-visualizer
```

を開いた時点で最終閲覧日時を更新する。

処理開始時や教材完了時ではない。

---

## 9.4 materialId変更時

MaterialViewが既に表示されている状態で、

```text
/materials/A
↓
/materials/B
```

へ変更された場合も、新しい教材Bについて履歴更新を行う。

---

## 9.5 localStorage障害

以下が発生しても教材利用自体は継続可能とする。

- localStorage書き込み失敗
- 読み込み失敗
- JSON破損
- 想定外データ
- ブラウザ設定によるStorage制限

つまり、

```text
履歴保存失敗
≠
教材利用失敗
```

とする。

---

## 9.6 読み込み時検証

Storageの内容は信頼せず、最低限、

- 配列か
- materialIdが文字列か
- lastOpenedAtが文字列か

等を確認する。

不正なレコードは無視できるようにする。

---

## 9.7 Composable

学習履歴専用ComposableはMVPでは作らない。

現状はServiceで十分なためである。

将来的に、

- API非同期通信
- loading
- error
- キャッシュ
- 認証ユーザーとの同期

等が必要になった場合に再検討する。

---

## 9.8 将来DBへ移行する場合

MVP：

```text
UI
↓
historyService
↓
localStorage
```

将来：

```text
UI
↓
historyService
↓
API
↓
DB
```

へ変更することを想定する。

変更対象は主に、

- historyService
- 認証を扱うアプリ共通部分
- 必要に応じたHistoryViewの非同期表示

となる。

変更対象にしない。

```text
SortMaterial
Sort Domain
Sort Visualization
他教材のDomain Logic
```

DB移行の可能性だけを理由に、MVPでRepositoryやAPI Clientを先行実装しない。

---

# 10. テスト方針

## 10.1 単体テスト

### ソート教材Domain

Vitestでテストする。

最低限、以下を確認する。

- 7種類すべてで昇順の最終結果になる
- 入力配列を変更しない
- 比較と交換・移動・書き込みが別Stepである
- 各アルゴリズムの代表的なフェーズと変数がtraceへ含まれる
- ヒープ構築と最大値抽出を区別できる
- シェルソートのgapが `4 → 2 → 1` になる
- 位置確定と整列済み範囲を区別できる
- 完了Stepが存在する
- ランダム配列が1から9までを各1回含む
- シャッフル後の順序が直前と異なる

DomainはVueなしでテスト可能な構造にする。

---

### historyService

Vitestでテストする。

最低限、

- 履歴なし
- 初回教材閲覧
- 同一教材の再閲覧
- 複数教材
- 不正なStorage内容
- Storageエラー

を確認する。

---

### Material Definitions

最低限、

- 教材IDの重複がない
- 必須Metadataが存在する

等を確認できる。

Catalog / Registryを統合しているため、両者の登録ずれテストは不要となる。

---

# 10.2 コンポーネントテスト

Vue Test Utils + Vitestを使用する。

### MaterialsView / MaterialCard

- 教材が表示される
- 教材への遷移先が正しい

### MaterialView

- materialIdから教材が解決される
- 有効教材で履歴更新される
- materialId変更時にも履歴更新される
- 不明materialIdでは履歴更新されない

### HistoryView

- 履歴が表示される
- 空状態が表示される
- 教材へ再遷移できる

### SortMaterial

- 開始前
- 実行中
- 一時停止
- 完了
- 7アルゴリズム切り替え
- 処理開始と1ステップ実行
- 自動再生と停止
- 速度変更
- 最初から
- シャッフル
- 日本語変数とバー位置表示
- Step進捗
- Result / Why / Insight

という主要状態がUIへ反映されることを確認する。

自動再生はfake timer等で決定的にテストし、実時間待機へ依存させない。

CSSの細かな色・座標まで自動テストしない。

---

# 10.3 Routerテスト

主要Routeを確認する。

```text
/
→ HomeView

/materials
→ MaterialsView

/materials/sort-visualizer
→ MaterialView

/history
→ HistoryView
```

また未知URLがHOMEへ処理されることを確認する。

---

# 10.4 手動確認

以下は実ブラウザで確認する。

### レスポンシブ

- PC
- タブレット相当
- スマートフォン
- 360px程度の狭い幅
- PCでは可視化、操作、フローチャート、解説を読み分けられる複数列
- 狭い幅では1列化し、操作群を折り返して横スクロールを発生させない

### 学習体験

```text
初期状態
→ 開始
→ ステップ実行
→ 状態変化
→ 最終結果
→ Why
→ Insight
```

### 操作性

- ボタンの押しやすさ
- スクロール
- 可視化の視認性
- ナビゲーション
- ブラウザ戻る・進む

### Cloudflare Pages

以下への直接URLアクセスを確認する。

```text
/
/materials
/materials/sort-visualizer
/history
```

---

# 10.5 MVP対象外テスト

以下はMVPでは導入しない。

- Playwright
- Cypress
- 大規模E2E環境
- Visual Regression Test
- 負荷テスト
- API統合テスト
- DB統合テスト

Vitest + Vue Test Utils + 手動ブラウザ確認を基本とする。

---

# 11. Cloudflare Pagesへの適合方針

## 11.1 ビルド

Viteによるproduction buildを行う。

Cloudflare Pagesでは、Viteが生成した静的成果物をそのまま配信する。

---

## 11.2 Cloudflare Pages設定

基本設定は以下。

| 項目                   | 設定            |
| ---------------------- | --------------- |
| Build command          | `npm run build` |
| Build output directory | `dist`          |
| Backend                | なし            |
| Pages Functions        | 不要            |
| DB                     | 不要            |

---

## 11.3 Router

Vue RouterはHTML5 History Modeを利用する。

`createWebHistory()` はVue Routerで推奨されているHistory Modeであり、直接URLアクセス時にはホスティング側がSPAの `index.html` へフォールバックできる必要がある。

---

## 11.4 Cloudflare PagesのSPA処理

Cloudflare Pagesでは、トップレベルの `404.html` がない場合、SPAとして扱い、incoming pathをルートへフォールバックする既定動作がある。

したがって、

```text
/materials/sort-visualizer
```

への直接アクセスでも、

```text
Cloudflare Pages
↓
SPA
↓
Vue Router
↓
MaterialView
```

として扱える。

---

## 11.5 `404.html`

MVPではトップレベルの `404.html` を生成・配置しない。

Cloudflare PagesのSPA fallbackを利用するためである。

アプリ内の未知URLについてはVue Router側で処理する。

---

## 11.6 `_redirects`

MVPではSPA fallback専用の `_redirects` を必須としない。

Cloudflare PagesのSPA既定動作を利用する。

---

## 11.7 Vite `base`

Cloudflare Pagesの、

```text
https://project.pages.dev/
```

または独自ドメインのルートへ公開する前提では、ルート `/` を基準とする。

通常のルート公開ではViteの標準baseで対応する。

将来的にアプリ自体をサブディレクトリへ配置する場合のみ `base` の変更を検討する。

Router側のbaseもViteの公開baseと一致させる。

---

## 11.8 適合判断

本MVPは、

```text
Vue SPA
+
Vite static build
+
Vue Router
+
localStorage
```

のみで成立する。

以下を必要としない。

- SSR
- Backend
- API
- Server DB
- Cloudflare Workers
- Pages Functions

したがってCloudflare Pagesへの静的デプロイに適した構成である。

---

# 12. 実装順序

## Step 1：Vue / Vite基盤

### 実装対象

- Vue 3
- TypeScript
- Vite
- App.vue
- AppHeader
- 共通CSS

### 完了条件

- ローカル起動できる
- App共通レイアウトが表示される
- PC / スマートフォンで基本レイアウトが破綻しない

---

## Step 2：Vue Routerと4画面

### 実装対象

- Vue Router
- HomeView
- MaterialsView
- MaterialView
- HistoryView
- 未知URL処理

### 完了条件

```text
/
/materials
/materials/:materialId
/history
```

へ遷移できる。

ブラウザの戻る・進むも正常に動作する。

---

## Step 3：Material Definitions

### 実装対象

- MaterialMetadata
- MaterialDefinition
- definitions.ts
- ソート教材基本情報
- MaterialCard

### 完了条件

- 学習一覧へソート教材が表示される
- 教材情報を複数画面へ重複定義していない
- 教材IDから教材情報を取得できる

---

## Step 4：学習履歴

### 実装対象

- LearningHistoryEntry
- historyService
- HistoryView

### 完了条件

- 教材を開くと日時が保存される
- 保存項目が教材IDと最終閲覧日時だけである
- 同一教材で日時が更新される
- Historyから教材へ戻れる
- Storage障害で教材利用が停止しない

---

## Step 5：MaterialViewと教材表示

### 実装対象

- materialId解決
- Material Definitionsとの接続
- 教材Component表示
- materialId変更監視
- 不正materialId処理

### 完了条件

- `/materials/sort-visualizer` からソート教材を表示できる
- MaterialViewがソート固有Stateを知らない
- materialId変更時も正しい教材と履歴へ更新される
- 不正IDで履歴が生成されない

---

## Step 6：ソート教材

### 実装対象

- SortMaterial
- Sort Domain
- 7種類のtrace生成
- ランダムな基準配列
- アルゴリズム切り替え
- 処理開始
- ステップ実行
- 自動再生・一時停止・速度変更
- 最初から・シャッフル
- 状態可視化
- 日本語変数とバー位置
- 高水準フローチャート
- 現在処理説明
- 最終結果
- Why
- Insight

### 完了条件

```text
初期状態
↓
アルゴリズム選択
↓
処理開始
↓
ステップ実行
↓
状態変化
↓
最終結果
↓
なぜそうなるのか
↓
そこから何が分かるか
```

が一連の学習体験として成立する。

7種類すべてが同じ基準配列を用いて完了まで実行でき、PCおよび360px程度の画面幅で主要操作が可能であること。

---

## Step 7：自動テスト

### 実装対象

- Sort Domain
- historyService
- Material Definitions
- MaterialView
- HistoryView
- Router

### 完了条件

主要ロジックと主要画面遷移のVitestが成功する。

---

## Step 8：レスポンシブ調整

### 実装対象

- PC表示
- スマートフォン表示
- 教材画面
- 操作領域
- 可視化領域
- ナビゲーション

### 完了条件

PCおよび360px程度の画面幅で主要操作が可能。

---

## Step 9：Production Build確認

### 実装対象

- Vite production build
- dist確認

### 完了条件

- `npm run build` が成功する
- `dist` が生成される
- production buildで4画面が動作する

---

## Step 10：Cloudflare Pages適合確認

このPhaseでは実際のデプロイは行わない。

### 完了条件

以下でデプロイ可能と判断できる。

```text
Build command
npm run build

Output
dist

Router
HTML5 History Mode

Hosting
Cloudflare Pages SPA
```

---

# 13. MVP対象外

## 認証

- ログイン
- ログアウト
- ユーザー登録
- SNSログイン
- パスワード管理

---

## バックエンド

- API
- Cloudflare Workers
- Pages Functions
- Supabase
- Firebase
- サーバーDB

---

## 学習管理

- 学習時間
- 学習回数
- 進捗率
- 完了状態
- 習熟度
- スコア
- 正答率
- 苦手分析

---

## 教材機能

- 複数教材の実装
- 自由入力
- 問題演習
- 過去問題
- 模擬試験
- AI教材生成
- 教材投稿

---

## その他

- お気に入り
- 高度な検索
- タグ検索
- レコメンド
- 関連教材
- 管理者画面
- 複数端末同期

---

## アーキテクチャとしても先行実装しないもの

```text
Pinia Store
Repository
API Client
Auth Service
User Model
Progress Model
Generic Material Engine
Generic Step Engine
Plugin System
DI Framework
```

必要性が発生した時点で追加する。

---

# 14. 設計上のリスク・注意点

## 14.1 教材共通化をやりすぎない

最大の注意点とする。

ソート教材の、

```text
Step
State
Controls
Result
Visualizer
```

を安易にアプリ共通型へ昇格させない。

MVPで共通化する範囲は原則、

```text
MaterialMetadata
MaterialDefinition
materialId
MaterialView
```

までとする。

---

## 14.2 materialIdを安易に変更しない

学習履歴がmaterialIdを参照するため、一度公開した教材IDを変更すると保存済み履歴との関連が切れる可能性がある。

教材表示名は変更可能だが、IDは安定した識別子として扱う。

---

## 14.3 materialId変更時の処理漏れ

同じMaterialViewが再利用される場合を考慮する。

教材解決と履歴更新を初回mount時だけに依存させない。

---

## 14.4 学習履歴障害を教材本体へ波及させない

localStorageが使用不能でも、

```text
教材閲覧
ステップ実行
可視化
解説
```

は利用可能とする。

---

## 14.5 ソート固有処理をMaterialViewへ持ち込まない

以下がMaterialViewへ現れ始めた場合は境界違反と判断する。

```text
array
compare
swap
currentIndex
bar
sortStep
```

これらはすべて `materials/sort` 内部へ置く。

---

## 14.6 教材固有CSSも教材内部へ閉じる

共通CSSには、

- 色
- typography
- ページ幅
- 基本spacing
- アプリ共通レイアウト

を置く。

一方、

- ソートバー
- 比較中表示
- 交換状態
- 配列表示
- ソート可視化レイアウト

などはSort関連SFC側へ置く。

教材固有CSSが別教材へ影響しないようにする。

---

## 14.7 UIプロトタイプの内部構造を移植しない

プロトタイプの、

- DOM直接更新
- 画面表示切替
- 教材情報
- localStorage
- ソートロジック

が1ファイルに存在することは、本番アーキテクチャでは踏襲しない。

UIと学習体験のみを参考とする。

---

# 最終アーキテクチャ

```text
                    App.vue
                       │
                  Vue Router
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   HomeView       MaterialsView    HistoryView
                       │               │
                  MaterialCard     historyService
                       │               │
                       │           localStorage
                       │
                  MaterialView
                       │
               Material Definitions
                       │
                  SortMaterial
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
  Visualization    Controls      Explanation     Flowchart
                       │
        Sort Domain（7 algorithm traces）
```

アプリ共通と教材固有の境界は以下とする。

```text
アプリ共通
─────────────────────
App
Router
Navigation
HOME
教材一覧
教材履歴
MaterialMetadata
MaterialDefinition
MaterialView
historyService

             ↓ materialId / Component

教材固有
─────────────────────
SortMaterial
Sort State
Sort Step
Sort Logic
Sort Visualization
Sort Controls
Sort Explanation
Sort Flowchart
```

---

# 2教材目追加時

新しい教材を追加する場合の基本作業は、

```text
① materials/<new-material>/ を追加
② definitions.tsへ教材を登録
```

とする。

原則として以下は変更しない。

```text
Router
HomeView
MaterialsView
HistoryView
historyService
既存SortMaterial
既存Sort Domain
```

この構成により、

- MVPとして構成を小さく保つ
- ソート専用アプリにしない
- 教材固有ロジックを分離する
- 2教材目を追加しやすくする
- 将来の認証・DB追加を教材ロジックへ波及させない
- 不要なPinia、Repository、汎用教材エンジンを導入しない

という今回の設計条件を満たす。

以上をPhase 3における確定アーキテクチャとする。
