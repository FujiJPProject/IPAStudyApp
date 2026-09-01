# AI Development Workflow

このディレクトリは、
ChatGPT Workを中心としたAI開発手順を管理する。

Workでは `.agents/` 配下のファイルが
自動的にSkillやAgentとして実行されることを前提としない。

各作業開始時に、
対象Role / Skill / Taskを明示的に指定して利用する。

Codexを利用する場合も、
AGENTS.mdおよびTaskで定義された制約を維持する。

---

## Structure

```text
.agents/
├─ roles/
│  ├─ orchestrator.md
│  ├─ planner.md
│  ├─ builder.md
│  ├─ reviewer.md
│  ├─ fixer.md
│  ├─ finalizer.md
│  └─ release-auditor.md
├─ skills/
│  ├─ orchestrate-feature-cycle/
│  ├─ plan-feature-change/
│  ├─ finalize-task/
│  └─ ...
├─ tasks/
└─ reviews/
```

### roles

「誰として作業するか」を定義する。

Roleは論理的な担当定義であり、
ChatGPT Work上で自動生成される独立Agentを意味しない。

### skills

「どの手順で作業するか」を定義する。

原則として、

```text
.agents/skills/<skill-name>/SKILL.md
```

に配置する。

### tasks

「今回何を完成させるか」を定義する。

Taskごとに、

- Status
- Depends On
- Objective
- Scope
- Out of Scope
- Allowed Changes
- Acceptance Criteria
- Completion Evidence

を持つ。

### reviews

Reviewerのレビュー結果を保存する。

別WorkチャットでFixerが参照するための
受け渡し成果物として扱う。

---

## Responsibility Model

```text
AGENTS.md
=
プロジェクト共通ルール

Role
=
担当責務

Skill
=
作業方法

Task
=
今回の具体的要求

Candidate Reference
=
採用前のHTML・モック・メモ等

Review
=
レビュー結果

Orchestrator
=
CodexのメインスレッドとしてRole間の状態遷移を管理する親
```

---

## Orchestrated Feature Cycle

Codexでは、1機能のサイクル全体を依頼された場合、
メインスレッドがOrchestratorとして次を順番に管理する。

```text
Planner
↓
Builder
↓
Reviewer
↓
必要な場合だけFixer
↓
Fixerが変更した場合はReviewerを再実行
↓
Finalizer
```

ユーザーとのやり取りは親Orchestratorが行う。
各サブエージェントの結果だけで次へ進まず、
親がTask、Review、現在の差分を再確認する。
既存Taskは最初の未完了Gateから再開し、
完了済み工程を無条件に繰り返さない。

Phase 5〜8の状態遷移と書き込み作業は順次実行する。

並列実行できるのは次の読み取り専用調査だけである。

- Plannerの差分・影響調査：最大2並列
- 重要レビューの観点別調査：最大2並列
- Phase 9の統合レビュー調査：最大3並列

並列調査後は、指定された1つのRoleだけが
Source of Truth、Task、Review等の成果物を書き込む。
小規模で明確なTaskは並列化しない。

FixerからReviewerまでのサイクルは最大2回とする。
重要な判断または追加権限が必要な場合は、
親が質問をまとめてユーザーへ提示して停止する。

---

## Planning Flow

Phase 8で機能を追加・変更・削除する場合は、
実装より先にPlannerを使用する。

```text
AGENTS.md
+
roles/planner.md
+
skills/plan-feature-change/SKILL.md
+
tasks/TEMPLATE.md
+
変更要求・Candidate Reference
↓
Source of Truthとの差分と影響範囲を整理
↓
未確定事項をユーザーへ質問
↓
確定後に必要なSource of Truthを更新
↓
Taskを新規作成または更新
```

Plannerはアプリケーションコードを変更しない。
既存Taskがある場合は重複作成しない。

---

## Implementation Flow

```text
AGENTS.md
+
roles/builder.md
+
skills/implement-feature/SKILL.md
+
tasks/<task>.md
↓
実装
↓
test / build
```

---

## Review Flow

実装とは原則として別Workチャットを使用する。
Codexの親Orchestratorを使う場合も、
Builderとは別のサブエージェントスレッドで実施する。

```text
AGENTS.md
+
roles/reviewer.md
+
skills/review-feature/SKILL.md
+
tasks/<task>.md
+
現在の実装
↓
レビュー
↓
reviews/<task>-review.md
```

---

## Fix Flow

```text
AGENTS.md
+
roles/fixer.md
+
skills/fix-review/SKILL.md
+
tasks/<task>.md
+
reviews/<task>-review.md
↓
Critical / High修正
↓
test / build
```

---

## Finalization Flow

Fixerがコードを変更した場合は、
先にReviewerを再実行する。

```text
AGENTS.md
+
roles/finalizer.md
+
skills/finalize-task/SKILL.md
+
tasks/<task>.md
+
reviews/<task>-review.md
↓
最新Reviewが現在の実装を対象としていることを確認
↓
Next step: proceedを確認
↓
test / build
↓
TaskのStatusとCompletion Evidenceだけを更新
↓
Status: Done
```

条件を満たさない場合、FinalizerはTaskを変更しない。

---

## Integration Flow

MVP機能完成後：

```text
AGENTS.md
+
roles/release-auditor.md
+
skills/integration-review/SKILL.md
↓
MVP全体レビュー
```

Phase 9では、要件・設計、機能統合、テスト・UI等の
独立した読み取り専用調査を最大3並列で実行してよい。
調査担当はファイルを変更せず、最後に1つのRelease Auditorが
`.agents/reviews/integration-review.md`へ統合する。

その後：

```text
skills/deploy-readiness/SKILL.md
↓
Cloudflare Pagesデプロイ可否確認
```

---

## Codex Usage

各Phaseを手動実行する場合はChatGPT Workを利用できる。

Phase 5〜8を少ないユーザー指示でGateに従って進める場合は、
Codexの親Orchestratorを利用する。

以下の場合もCodexへの切り替えを検討する。

- 親Orchestratorによる機能サイクル管理
- 原因特定が難しいバグ
- 広範囲なコード調査
- 複雑なリファクタリング
- Workで複数回修正しても解決しない
- リポジトリ全体を横断するデバッグ

Codexへ切り替えても、
requirements.md・architecture.md・Taskを勝手に変更しない。

Source of Truthを変更できるのは、
Plannerが未確定事項を質問し、ユーザーが確定した後の
機能計画作業だけである。

TaskをDoneへ変更できるのは、
Finalizerが完了Gateを確認した完了確定作業だけである。
Finalizerは指定TaskのStatusとCompletion Evidence以外を変更しない。

---

## Codex Custom Agents

Codexでは、プロジェクト用カスタムエージェントを
`.codex/agents/*.toml` から利用する。

親OrchestratorはCodexのメインスレッドが担当し、
`.codex/agents/orchestrator.toml` は作成しない。

```text
planner         → 機能変更の計画・Source of Truth更新・Task準備
builder         → Ready Taskの実装
reviewer        → 機能単位レビュー
fixer           → Critical / High修正
finalizer       → 最終Review・test・build確認後のTask完了確定
release_auditor → 統合・デプロイ可否レビュー
```

単独工程ではCodexへのプロンプトで対象名とTaskを明示して委譲する。

機能サイクル全体では、親Orchestratorへ
`.agents/skills/orchestrate-feature-cycle/SKILL.md` と対象を指定し、
親が必要なカスタムエージェントを順次起動する。
