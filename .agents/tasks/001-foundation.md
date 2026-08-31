# Task: Application Foundation

## ID

001-foundation

## Status

Done

## Depends On

- none

---

## Objective

`architecture.md` に基づいて、
MVP機能を順番に追加できる最低限のVueアプリ基盤を構築する。

教材固有の実行ロジックや学習履歴の永続化は実装しない。

---

## Source of Truth

- `docs/requirements.md`
- `docs/architecture.md`

基本UIを確認する必要がある場合のみ：

- `docs/ui-reference.html`

---

## Scope

以下を構築する。

- Vue 3
- TypeScript
- Vite
- Vue Router
- Composition API
- Vitest
- Vue Test Utils
- `App.vue`
- `AppHeader.vue`
- `HomeView.vue`
- `MaterialsView.vue`
- `MaterialView.vue`
- `HistoryView.vue`
- `MaterialCard.vue`
- `router/index.ts`
- `materials/types.ts`
- `materials/definitions.ts`
- `styles/variables.css`
- `styles/base.css`
- 必要なpackage.json scripts

基本Route：

```text
/
/materials
/materials/:materialId
/history
```

`Material Definitions` には、
教材Metadataと教材Componentを登録できる最小構造を用意する。

MVP教材「ソートアルゴリズム可視化」のMetadataを
一覧表示できるところまで対応してよい。

ただし教材実行ロジックは実装しない。

---

## Out of Scope

- Sort Domain
- ソート実行State
- ソートステップ処理
- Sort可視化本実装
- historyService本実装
- localStorage保存
- 認証
- DB
- API
- Pinia
- Repository
- Generic Material Engine
- Generic Step Engine
- 複数教材実装

---

## Allowed Changes

```text
package.json
package-lock.json
vite.config.*
tsconfig*
index.html
src/**
tests/**
```

---

## Confirmed Decisions

- Vue Routerを使用する
- HTML5 History Modeを使用する
- 4画面をRouteとして扱う
- 教材Routeは `/materials/:materialId`
- 教材ごとに個別Routeを増やさない
- Piniaは導入しない
- Repositoryは導入しない
- Material Definitionsを教材登録の基準とする
- アプリ共通部分はソート固有概念を知らない

---

## Open Decisions

なし。

---

## Acceptance Criteria

- [ ] 依存関係をインストールできる
- [ ] `package-lock.json` が存在する
- [ ] `npm run dev` で起動できる
- [ ] `/` を表示できる
- [ ] `/materials` を表示できる
- [ ] `/materials/:materialId` の基本画面を表示できる
- [ ] `/history` を表示できる
- [ ] ブラウザ戻る・進むが機能する
- [ ] App共通レイアウトが存在する
- [ ] MaterialMetadataの型が存在する
- [ ] MaterialDefinitionの最小構造が存在する
- [ ] 学習一覧へMVP教材Metadataを表示できる
- [ ] 教材固有実行ロジックを含まない
- [ ] `npm run test` が1回実行で終了し成功する
- [ ] `npm run build` が成功する

---

## Review Output

```text
.agents/reviews/001-foundation-review.md
```
