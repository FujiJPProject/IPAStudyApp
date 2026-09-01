# Project AI Instructions

## Project

本プロジェクトは、応用情報技術者試験で扱われる知識・理論を、
ステップ実行と状態変化の可視化を通じて理解するためのWebアプリである。

MVPではソートアルゴリズム可視化1教材について、
一連の学習体験を完成させる。

アプリ全体をソート専用構造にはしない。

---

## Source of Truth

### `doc/requirements.md`

「何を作るか」のSource of Truth。

主に以下を定義する。

- MVP範囲
- MVP対象外
- 機能要件
- 画面責務
- 学習体験
- 完了条件

### `doc/architecture.md`

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

### `doc/ui-reference.html`

「どう見せるか」の参照資料。

主に以下を参照する。

- 画面構成
- 情報配置
- 操作感
- レスポンシブ表示
- 学習体験の見せ方

HTML / CSS / JavaScriptの内部実装構造は
本番アーキテクチャとして扱わない。

今回の機能専用に作成したHTML、モック、メモ等は
`Candidate Reference` として扱う。

Candidate Referenceは、ユーザーが採用を確定し、
該当するSource of Truthへ反映されるまでは仕様ではない。

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

通常の実装・レビュー・修正Taskでは禁止：

- requirements.mdの無断変更
- architecture.mdの無断変更
- Task外機能の追加
- 不要な大規模リファクタリング
- 不要なディレクトリ構造変更
- 将来機能の先行実装
- 必要性のないnpm依存追加

設計変更が必要な場合は、
変更を実施せず理由を報告する。

例外として、明示的に指定された機能計画作業では、
ユーザーが確定した判断だけをSource of Truthへ反映してよい。
機能計画とアプリケーションコード変更は同じ作業で行わない。

明示的に指定された完了確定作業では、
FinalizerがGateを満たした指定TaskのStatusと
Completion Evidenceだけを更新してよい。

---

## Parent Orchestration

Codexで1つの機能変更を計画から完了まで進める場合は、
メインスレッドを親Orchestratorとして使用する。

親は以下を読む。

1. `.agents/roles/orchestrator.md`
2. `.agents/skills/orchestrate-feature-cycle/SKILL.md`
3. 変更要求・Candidate Referenceまたは指定Task

親はPlanner、Builder、Reviewer、Fixer、Finalizerを
必要な順番でサブエージェントとして委譲し、
結果を待ってからTask、Review、現在の差分を再確認する。

既存Taskを再開する場合は、実装とReviewの現在状態を確認し、
完了済み工程を無条件に繰り返さず最初の未完了Gateから再開する。

Phase 5〜8の状態遷移は順次実行する。
Builder、Review成果物を書き込むReviewer、Fixer、Finalizerを含む
書き込み作業を並列実行しない。

並列実行できるのは、親が独立していると確認した
読み取り専用の次の作業だけである。

- Plannerの差分・影響調査：最大2並列
- 重要レビューの観点別調査：最大2並列
- Phase 9の統合レビュー調査：最大3並列

重要レビューとは、アーキテクチャまたは共通コード境界をまたぐ、
複数機能へ影響する、状態・永続化・セキュリティ・広範な回帰リスクがある、
または単一Reviewerでは十分な確信を得にくいレビューをいう。

並列調査担当はファイルを変更しない。
調査結果を統合した後、指定された1つのRoleだけが成果物を書き込む。
小規模で明確なTaskは並列化しない。

Fixerがコードを変更した場合は必ずReviewerへ戻る。
FixerからReviewerまでのサイクルは最大2回とし、
それでもCritical / Highが残る場合はユーザーへ報告して停止する。

重要な未確定事項、Source of Truthの矛盾、スコープ・設計・依存変更、
新しい権限または承認が必要な場合は、推測で進めずユーザーへ質問する。

OrchestratorはCodexのメインスレッドが担うため、
`.codex/agents/orchestrator.toml` は作成しない。

---

## Feature Change Planning Gate

Phase 8で機能を追加・変更・削除する前に、
以下を順番に実施する。

1. `AGENTS.md`、Planner Role、`plan-feature-change` Skill、Task Templateを読む
2. 変更要求とCandidate ReferenceをSource of Truth・現在のコードと比較する
3. 未確定事項と矛盾をユーザーへ質問する
4. 回答が確定した後、必要なSource of Truthを先に更新する
5. `.agents/tasks/TEMPLATE.md`をもとにTaskを新規作成または更新する
6. Open Decisionsがなく、依存TaskがDoneで、資料間に矛盾がない場合だけReadyにする

重要な未確定事項が残るTaskはBlockedとする。
既存Taskがある機能について重複Taskを作成しない。

---

## Task Status

TaskのStatusを確認する。

- Ready → 作業可能
- Blocked → 実装禁止
- Done → 原則として再実装しない

Blockedの場合は、
解除条件を報告して作業を停止する。

---

## Task Completion Gate

TaskをDoneへ変更する前に、
Finalizerが以下をすべて確認する。

1. TaskがReadyで、依存TaskがすべてDoneである
2. 最新Reviewが現在の実装を対象としている
3. 最新Reviewが `Next step: proceed` で終了している
4. Critical / Highが残っていない
5. 最新Review後にアプリケーションコードが変更されていない
6. `npm run test` と `npm run build` が成功する

Fixerがアプリケーションコードを変更した場合は、
必ずReviewerを再実行してからFinalizerへ進む。

Finalizerが変更できるのは、
指定TaskのStatusとCompletion Evidenceだけである。

条件を満たさない場合はTaskを変更せず、
不足条件と必要な次のRoleを報告する。

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
2. 必要なSource of Truth
3. 指定されたRole
4. 指定されたSkill
5. 指定されたTaskまたはCandidate Reference

ChatGPT Workでは、
Role / Skill / Taskをプロンプトから明示的に指定する。

Codexで機能サイクル全体を扱う場合は、メインスレッドが
`orchestrate-feature-cycle` Skillに従って親Orchestratorとなる。

各工程では、必要に応じて `.codex/agents/*.toml` の
カスタムエージェントへ明示的に委譲する。
