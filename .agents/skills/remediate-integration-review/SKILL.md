---
name: remediate-integration-review
description: "Manage remediation after an Integration Review returns MVP releaseable: No and Next step: fix required."
---

# Remediate Integration Review

## Required Context

Read completely:

1. AGENTS.md
2. .agents/roles/orchestrator.md
3. the supplied Integration Review
4. the complete Task list supplied by the user and every Task named by the Review
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
- Affected Task repository path
- Required closure

Require the supplied Task list to match the complete, deduplicated set of
Affected Tasks from all Mandatory fixes. Do not silently omit or add a Task.

If the Task list is missing or does not match, stop and request the corrected
complete list. Do not infer a missing Task from repository history.

## Stop and Ask the User

Do not begin a Task reopen or code change. Consolidate the questions and stop when:

- the Review concludes `Next step: user decision required`
- a Mandatory fix is not Critical or High
- a Required closure or Affected Task is missing or ambiguous
- the fix requires a requirements, architecture, or acceptance-criteria change
- the fix requires a Task split
- multiple valid remedies would materially change the learning experience

Medium, Low, and deferrable improvements are not part of this remediation unless they are necessary to satisfy a listed Required closure.

## Remediation Baseline

Before the first write, record in the parent session:

- the supplied Integration Review path
- its `Reviewed revision`
- the complete affected Task list
- the dependency order
- an initially empty list of Tasks finalized in this remediation session

The Integration Review must cover the application implementation at this starting
point. For later Tasks, the current implementation may differ from the baseline
only through verified changes for earlier affected Tasks finalized in this same
session. Any unrelated application change makes the baseline invalid and requires
a new Integration Review.

## Task Order

Build a dependency order for the affected Tasks before any write.

- If Task A depends on Task B and both are affected, fully remediate and finalize B before reopening A.
- Do not reopen a Task until every dependency is `Done` and no dependency is awaiting remediation.
- Process Task writes one at a time in that dependency order.
- Keep affected Tasks that have not reached their turn in the session's pending
  set. Their physical Status may remain `Done`, but do not treat them as release-complete.

## Procedure

For each affected Task in dependency order:

1. Delegate `reopen-task` to the Finalizer with the Task, Integration Review, and
   current remediation-session evidence.
2. Start Fixer-to-Reviewer cycle 1. Delegate `fix-review` to the Fixer with only
   that Task's structured Mandatory fixes from the Integration Review.
3. Require `npm run test` and `npm run build` to finish successfully.
4. Delegate `review-feature` to the Reviewer for the current implementation.
5. If the cycle 1 Feature Review concludes exactly `Next step: proceed`, skip to
   step 8.
6. If the cycle 1 Feature Review concludes exactly `Next step: fix Critical /
   High`, start cycle 2 by delegating `fix-review` with the latest Feature Review's
   Critical / High findings. Continue to verify the original Mandatory fixes and
   Required closures, but do not reuse them as the sole Fix input. Run `npm run
   test` and `npm run build`, then delegate a new `review-feature` pass.
7. If the cycle 2 Feature Review does not conclude exactly `Next step: proceed`,
   or either Feature Review produces an unexpected decision, stop and report the
   remaining evidence and required user decision.
8. Delegate `finalize-task` to the Finalizer only after the latest Feature Review
   concludes exactly `Next step: proceed`. The Task must be `Done` again with new
   Completion Evidence before continuing. Add it to the session's finalized Task
   list.
9. After every affected Task is finalized, delegate `integration-review` to the
   Release Auditor using the same `MVP release scope` recorded by the supplied
   Review, and create a new, non-overwriting Integration Review artifact.
10. If the new review is `MVP releaseable: No` and `Next step: fix required`,
    repeat this Skill from the Start Gate using that new artifact and a new
    remediation baseline.
11. If the new review is `Next step: user decision required`, stop and present the
    consolidated decision request.

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
