# Project AI Instructions

## Project

本プロジェクトは、応用情報技術者試験で扱われる知識・理論を、
ステップ実行と状態変化の可視化を通じて理解するためのWebアプリである。

MVPではソートアルゴリズム可視化1教材について、
一連の学習体験を完成させる。

アプリ全体をソート専用構造にはしない。

---

## Source of Truth

### `docs/requirements.md`

「何を作るか」のSource of Truth。

主に以下を定義する。

- MVP範囲
- MVP対象外
- 機能要件
- 画面責務
- 学習体験
- 完了条件

### `docs/architecture.md`

「どう実装するか」のSource of Truth。

主に以下を定義する。

- 技術構成
- ディレクトリ構成
- 責務分離
- ルーティング
- 状態管理
- 永続化
- テスト方針
- 実装順序

### `docs/ui-reference.html`

「どう見せるか」の参照資料。

主に以下を参照する。

- 画面構成
- 情報配置
- 操作感
- レスポンシブ表示
- 学習体験の見せ方

HTML / CSS / JavaScriptの内部実装構造は
本番アーキテクチャとして扱わない。

---

## Conflict Rule

資料ごとの責務を考慮して判断する。

- 機能・MVP判断 → requirements.md
- 実装方式 → architecture.md
- UI表現 → ui-reference.html

重大な矛盾があり実装判断へ影響する場合は、
勝手に解釈・補完しない。

コード変更を開始せず、

1. 矛盾している内容
2. 影響範囲
3. 必要な判断

を報告する。

---

## Technology

MVPの基本技術：

- Node.js LTS
- npm
- Vite
- Vue 3
- TypeScript
- Vue Router
- Composition API
- CSS
- Vitest
- Vue Test Utils
- localStorage
- Cloudflare Pages

---

## Architecture Rules

必ず守る。

- UIと教材固有ロジックを分離する
- VueコンポーネントからlocalStorageを直接操作しない
- 学習履歴はhistoryServiceを通す
- 教材登録情報はmaterials/definitions.tsを基準とする
- 教材固有ロジックはmaterials/<material>/内部へ閉じる
- ソート固有概念をアプリ共通部分へ持たせない
- MaterialViewでソート固有Stateを管理しない
- 教材実行Stateは教材内部で管理する
- 教材DomainからVue Routerへ依存しない
- 教材DomainからhistoryServiceへ依存しない
- 教材DomainからlocalStorageへ依存しない

---

## Do Not Introduce Without Explicit Need

MVPでは原則として導入しない。

- Pinia
- Repository層
- API Client
- DIコンテナ
- Generic Material Engine
- Generic Step Engine
- Plugin System
- Backend
- Database
- Authentication

将来必要になる可能性だけを理由に導入しない。

---

## Change Rules

Taskで指定された範囲だけ変更する。

禁止：

- requirements.mdの無断変更
- architecture.mdの無断変更
- Task外機能の追加
- 不要な大規模リファクタリング
- 不要なディレクトリ構造変更
- 将来機能の先行実装
- 必要性のないnpm依存追加

設計変更が必要な場合は、
変更を実施せず理由を報告する。

---

## Task Status

TaskのStatusを確認する。

- Ready → 作業可能
- Blocked → 実装禁止
- Done → 原則として再実装しない

Blockedの場合は、
解除条件を報告して作業を停止する。

---

## Verification

コード変更後は原則として以下を実行する。

```bash
npm run test
npm run build
```

必要に応じて以下も利用する。

```bash
npm run dev
npm run preview
```

テストまたはビルドが失敗した状態を
完了として扱わない。

---

## Work Output

コード全文をチャットへ貼らない。

作業完了後は以下のみ報告する。

1. 変更ファイル
2. 実施内容
3. 実行したコマンド
4. テスト・ビルド結果
5. 未解決事項

---

## Workflow

作業開始時は以下を確認する。

1. AGENTS.md
2. 指定されたRole
3. 指定されたSkill
4. 指定されたTask
5. 必要なSource of Truth

ChatGPT Workでは、
Role / Skill / Taskをプロンプトから明示的に指定する。
