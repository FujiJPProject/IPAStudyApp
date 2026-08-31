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
│  ├─ planner.md
│  ├─ builder.md
│  ├─ reviewer.md
│  ├─ fixer.md
│  └─ release-auditor.md
├─ skills/
│  ├─ plan-feature-change/
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

- Objective
- Scope
- Out of Scope
- Allowed Changes
- Acceptance Criteria

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
```

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

その後：

```text
skills/deploy-readiness/SKILL.md
↓
Cloudflare Pagesデプロイ可否確認
```

---

## Codex Escalation

通常はChatGPT Workを利用する。

以下の場合のみCodexへの切り替えを検討する。

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

---

## Codex Custom Agents

Codexでは、プロジェクト用カスタムエージェントを
`.codex/agents/*.toml` から利用する。

```text
planner         → 機能変更の計画・Source of Truth更新・Task準備
builder         → Ready Taskの実装
reviewer        → 機能単位レビュー
fixer           → Critical / High修正
release_auditor → 統合・デプロイ可否レビュー
```

カスタムエージェントは自動実行を前提とせず、
Codexへのプロンプトで対象名とTaskを明示して委譲する。
