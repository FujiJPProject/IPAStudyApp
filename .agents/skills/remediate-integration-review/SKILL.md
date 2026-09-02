---
name: remediate-integration-review
description: Manage remediation after an Integration Review returns MVP releaseable: No and Next step: fix required.
---

# Remediate Integration Review

## Required Context

Read completely:

1. AGENTS.md
2. .agents/roles/orchestrator.md
3. the supplied Integration Review
4. every Task named by the Review, or the Task supplied by the user
5. the latest formal Review for each affected Task
6. relevant current code and tests

Read before delegating:

- .agents/skills/reopen-task/SKILL.md
- .agents/skills/fix-review/SKILL.md
- .agents/skills/review-feature/SKILL.md
- .agents/skills/finalize-task/SKILL.md
- .agents/skills/integration-review/SKILL.md

## Start Gate

Start only when the supplied Integration Review concludes:

- `MVP releaseable: No`
- `Next step: fix required`

Extract every Mandatory fix and verify that each includes:

- Finding ID
- Critical or High severity
- Affected Task
- Required closure

If an Affected Task is not supplied, identify it only when the Review and Task evidence make the mapping unambiguous.

## Stop and Ask the User

Do not begin a Task reopen or code change. Consolidate the questions and stop when:

- the Review concludes `Next step: user decision required`
- a Mandatory fix is not Critical or High
- a Required closure or Affected Task is missing or ambiguous
- the fix requires a requirements, architecture, or acceptance-criteria change
- the fix requires a Task split
- multiple valid remedies would materially change the learning experience

Medium, Low, and deferrable improvements are not part of this remediation unless they are necessary to satisfy a listed Required closure.

## Procedure

For each affected Task, process write operations serially:

1. Delegate `reopen-task` to the Finalizer with the Task and Integration Review.
2. Delegate `fix-review` to the Fixer with only that Task's Mandatory findings.
3. Require `npm run test` and `npm run build`.
4. Delegate `review-feature` to the Reviewer for the current implementation.
5. If the Feature Review is not exactly `Next step: proceed`, return to step 2.
6. Delegate `finalize-task` to the Finalizer. The Task must be `Done` again with new Completion Evidence before continuing.
7. After every affected Task is finalized, delegate `integration-review` to the Release Auditor and create a new, non-overwriting Integration Review artifact.
8. If the new review is `MVP releaseable: No` and `Next step: fix required`, repeat this Skill from the Start Gate using that new artifact.
9. If the new review is `Next step: user decision required`, stop and present the consolidated decision request.

The parent Orchestrator manages the state transitions but does not edit Tasks, Review artifacts, Source of Truth, or application code itself.

## Completion Gate

Do not report completion until all of the following are true:

- every Mandatory fix from the current Integration Review satisfies its Required closure
- every affected Task is `Done`
- each affected Task has current Completion Evidence
- each affected Task's latest Feature Review concludes exactly `Next step: proceed`
- a newer Integration Review covers the current implementation
- the newer Integration Review concludes `MVP releaseable: Yes`
- the newer Integration Review concludes exactly `Next step: proceed`
- `npm run test` succeeds
- `npm run build` succeeds

## Restrictions

Do not:

- repeat the normal Plan Gate when no Source of Truth change is needed
- implement Medium, Low, or deferrable work as convenience changes
- change requirements, architecture, or UI references without a separate approved plan
- let two writing Roles edit the same file concurrently
- push, create a pull request, merge, or deploy without explicit user authorization
