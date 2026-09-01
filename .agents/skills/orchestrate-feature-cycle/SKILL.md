---
name: orchestrate-feature-cycle
description: Orchestrate one repository feature addition, modification, deletion, or Ready Task through Planner, Builder, Reviewer, Fixer, re-review, and Finalizer gates. Use in Codex when the parent agent should minimize user prompts, keep all write phases sequential, ask the user about material decisions, and use limited read-only parallel analysis only when justified.
---

# Orchestrate Feature Cycle

## Required Context

Read completely:

1. `AGENTS.md`
2. `.agents/roles/orchestrator.md`
3. the requested change and Candidate References, or the specified Task
4. every Role and Skill immediately before delegating that phase

Treat the current Codex main thread as the Orchestrator.
Do not create or delegate to an `orchestrator` custom subagent.

## Entry Decision

Inspect the request and repository before choosing the first phase.

- New or changed requirement, Candidate Reference, or unresolved specification: start with Planner analysis.
- Existing `Ready` Task with complete dependencies and current Source of Truth:
  inspect its implementation and Review artifact, then resume from the earliest
  incomplete Gate instead of automatically repeating Builder.
  - no completed implementation evidence: start with Builder
  - implementation complete but no current formal Review: start with Reviewer
  - current Review says `fix Critical / High`: start with Fixer
  - current Review says `proceed`: start with Finalizer
- `Blocked` Task: report its Unblock Condition and use Planner only when resolving it requires analysis or user decisions.
- `Done` Task: stop unless the user explicitly requests a new change.

Do not trust a subagent summary alone. Re-read the Task, Review artifact,
and relevant current diff after every handoff.

## State Machine

### 1. Plan

Delegate to `planner` using `plan-feature-change`.

During Analyze Without Writing, limited parallel investigation is optional.
Use at most two `workflow_analyst` agents only when there are at least two material,
independent investigation lanes, such as:

- Source of Truth and Candidate Reference differences
- current code impact and existing Task dependencies

Give each agent a non-overlapping scope. Require no file changes and a concise,
evidence-based result. After they finish, use one designated Planner to validate,
deduplicate, and return one consolidated set of questions.

If a material answer is missing, ask the user and stop the cycle.
Do not start Builder while waiting.

After the user answers, delegate confirmed-decision application to one Planner.
That Planner is the only writer for Source of Truth and Task preparation.
Re-read the resulting Task and continue only if it is `Ready`.

### 2. Build

Delegate exactly one `builder` using the matching implementation Skill and Task.
Do not run Planner, another Builder, Fixer, or Finalizer concurrently.

Require the Builder to finish its scoped implementation and verification before
starting Review. If the Builder reports a material specification or architecture
decision, stop and ask the user instead of widening the Task.

### 3. Review

Delegate to `reviewer` using `review-feature` after Builder completes.

Use one Reviewer by default. Treat the review as important only when at least one
of the following applies:

- the change crosses architecture or shared-code boundaries
- the change spans multiple features or Source of Truth responsibilities
- state, persistence, security, or broad regression risk is material
- the parent cannot obtain adequate confidence from one focused review

For an important review, run at most two non-overlapping `workflow_analyst` review lanes.
The lane agents must not write the Review artifact. After they finish, delegate
one designated Reviewer to validate and consolidate the findings into the single
Review path defined by the Task.

Read the final Review and route only from its exact decision:

- `Next step: proceed` → Finalize
- `Next step: fix Critical / High` → Fix

### 4. Fix

Delegate exactly one `fixer` for verified Critical / High findings.
Do not fix Medium / Low findings in this cycle.

If application code changes, return to Review unconditionally.
Allow at most two Fixer-to-Reviewer cycles. If Critical / High remains after the
second cycle, stop and report the remaining evidence and required user decision.

### 5. Finalize

Delegate exactly one `finalizer` only after the latest Review covers the current
implementation and concludes `Next step: proceed`.

After Finalizer completes, re-read the Task. Report completion only when the Task
is `Done` and Completion Evidence is present. Otherwise report the failed Gate and
the required next Role.

## Parallel Execution Rules

Keep Plan through Finalize state transitions sequential.

Parallel work is optional and restricted to:

- Planner read-only investigation: maximum 2 concurrent agents
- important feature-review investigation: maximum 2 concurrent agents

Never parallelize:

- Source of Truth or Task updates
- application or test code changes
- Review artifact writes
- Fixer work
- Finalizer work
- multiple agents that may touch the same file

Use no parallel agents for a small, clear Task. Parallel agents consume additional
model and tool usage; use them only when the expected coverage or elapsed-time
benefit justifies that cost.

## Stop and Ask

Stop before the next phase when any of the following applies:

- material requirements, UI, architecture, data, compatibility, or acceptance criteria are unresolved
- Source of Truth files conflict
- Task is `Blocked` or a dependency is not `Done`
- scope expansion, architecture change, or a new dependency is required
- a new permission or user approval is required
- a safe next state cannot be determined from current artifacts
- two Fixer-to-Reviewer cycles have completed without `proceed`

Ask one consolidated set of questions. Do not expose duplicate questions or raw
subagent logs to the user. After the user answers, resume the same parent thread
from the stopped Gate and pass only the confirmed decisions to the next Role.

## Output

Report only:

1. final state and Task status
2. agents and phases executed
3. files changed by the delegated roles
4. test and build results
5. Review decision and Completion Evidence
6. unresolved items or the exact reason the cycle stopped

Do not push, create or merge a pull request, or deploy unless the user explicitly
requests that external action.
