# AI Development Workflow

このディレクトリは、ChatGPT WorkとCodexで共有する
Role、Skill、Task、Reviewを管理する。

Codexは`.agents/skills/*/SKILL.md`をSkillとして検出できる。
ただしRole、Task、Candidate Referenceは自動的な実行指示ではないため、
作業対象として明示する。

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
│  ├─ foundation/
│  ├─ orchestrate-feature-cycle/
│  ├─ plan-feature-change/
│  ├─ implement-feature/
│  ├─ review-feature/
│  ├─ fix-review/
│  ├─ finalize-task/
│  ├─ integration-review/
│  └─ deploy-readiness/
├─ tasks/
└─ reviews/
```

## Responsibility Model

| 情報 | Source of Truth |
| --- | --- |
| プロジェクト全体で常に守る規則 | `AGENTS.md` |
| 担当責務と禁止事項 | `.agents/roles/*.md` |
| 状態遷移、Gate、停止・再開条件 | `.agents/skills/*/SKILL.md` |
| Codexサブエージェントの実行設定 | `.codex/agents/*.toml` |
| 今回の具体的要求と完了条件 | `.agents/tasks/*.md` |
| 採用前のHTML、モック、メモ | Candidate Reference |
| ReviewerまたはRelease Auditorの結果 | `.agents/reviews/*.md` |
| 長時間作業の継続目標 | Codex Goal mode |

Roleの正本は`.agents/roles/*.md`とする。
`planner.toml`、`builder.toml`、`reviewer.toml`、`fixer.toml`、
`finalizer.toml`、`release-auditor.toml`は、Codexから対応するRoleを
起動するための薄い設定レイヤーとして扱う。
`workflow-analyst.toml`だけは、Codexで独立した読み取り専用調査を
行うためのCodex専用Custom Agentであり、対応するRoleファイルを持たない。

## Feature Cycle

Codexで1機能を計画から完了まで進める場合は、
メインスレッドを親Orchestratorとし、
`orchestrate-feature-cycle` Skillを明示的に使用する。

```text
Plan
→ Build
→ Review
→ 必要な場合のみFix
→ Re-review
→ Finalize
```

機能サイクル全体の状態遷移、停止・再開条件、完了Gateは、
`.agents/skills/orchestrate-feature-cycle/SKILL.md`を正本とする。
各工程固有の手順、書き込み境界、判定基準は、対応するSkillに従う。
親Orchestrator用のカスタムエージェントは作成しない。

ユーザーとのやり取りは親Orchestratorが行う。
各サブエージェントの結果だけで次へ進まず、
親がTask、Review、現在の差分を再確認する。

## Manual Work

ChatGPT Workで工程を個別実行する場合は、
対象Role、Skill、Taskをプロンプトから明示する。

```text
AGENTS.md
+
roles/<role>.md
+
skills/<skill>/SKILL.md
+
tasks/<task>.md または Candidate Reference
```

Plannerは確定前のSource of TruthやTaskを変更しない。
Builderは`Ready` Taskだけを実装する。
Reviewerは正式Review成果物だけを書き込む。
Fixerがコードを変更した場合はReviewerへ戻る。
Finalizerだけが完了Gate確認後にTaskを`Done`へ変更する。

## Integration and Deployment Readiness

MVP全体レビューは`integration-review` Skillを使用する。
Cloudflare Pagesのデプロイ可否確認は`deploy-readiness` Skillを使用する。

ChatGPT Workでは`.agents/roles/release-auditor.md`を明示し、
Codexではカスタムエージェント`release_auditor`へ委譲する。
どちらもアプリケーションコード、Source of Truth、Task、GitHub状態を変更しない。

Codexの読み取り専用並列調査には`workflow_analyst`を使用する。
ChatGPT WorkではCodex専用Custom Agentを前提にせず、
選択したSkillが許可する場合だけ汎用の読み取り専用subagentを使用する。
並列調査の上限と成果物の書き込み規則は、選択したSkillに従う。

