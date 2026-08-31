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
├─ skills/
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

Review
=
レビュー結果
```

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
requirements.md・architecture.md・Taskの内容は変更しない。
