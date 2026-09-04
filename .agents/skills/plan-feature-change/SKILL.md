---
name: plan-feature-change
description: Plan one feature addition, modification, or deletion before implementation by comparing the request and candidate references with the Source of Truth, asking the user to resolve uncertainties, updating documentation only after confirmation, and creating or updating a Task from the template.
---

# Plan Feature Change

## Required Context

Read completely:

1. `AGENTS.md`
2. `.agents/roles/planner.md`
3. `.agents/tasks/TEMPLATE.md`
4. `doc/requirements.md`
5. `doc/architecture.md`
6. relevant existing Tasks
7. relevant current code

Read `doc/ui-reference.html` when the change affects UI or UX.
Read supplied HTML, mocks, notes, or examples as Candidate References only.

## Phase 1: Analyze Without Writing

1. Classify the change as `Add`, `Modify`, or `Delete`.
2. State the requested outcome and affected user behavior.
3. Compare it with each relevant Source of Truth.
4. Inspect the current code and existing Tasks for overlap and dependencies.
5. Extract candidate behavior from Candidate References.
6. Separate confirmed facts from proposals and unresolved decisions.
7. Identify which Source of Truth files would need updates and why.
8. Ask the user about every decision that could change scope, behavior, architecture, UI, data, compatibility, or acceptance criteria.

Do not modify any file during this phase.
Do not continue while a material answer is missing.

When the parent Orchestrator identifies two material, independent investigation
lanes, it may delegate at most two read-only investigations in parallel.
Each investigation must have a non-overlapping scope and must not modify files.
One designated Planner validates and consolidates those results before asking the
user questions or applying confirmed decisions.

Do not use parallel investigation for a small, clear change.

## Candidate Reference Rule

A Candidate Reference is not a Source of Truth.

For HTML in particular:

- use layout and behavior as candidates to analyze
- do not copy its implementation structure into production
- do not adopt features that conflict with MVP scope
- present differences to the user before deciding
- reflect only confirmed choices into the responsible Source of Truth

## Documentation Impact Rule

Update only after the user confirms the decisions.

- `doc/requirements.md`: product scope, MVP inclusion or exclusion, behavior, screens, learning experience, completion conditions
- `doc/ui-reference.html`: confirmed layout, information placement, controls, interaction, responsive behavior, visual learning flow
- `doc/architecture.md`: implementation approach, responsibilities, data structures, state, persistence, dependencies, tests, implementation order

Use `No change` with a reason when a Source of Truth is unaffected.
Do not change documentation merely to match a Candidate Reference.

## Phase 2: Apply Confirmed Decisions

After all required answers are confirmed:

1. Update `doc/requirements.md` when product behavior or scope changes.
2. Update `doc/ui-reference.html` when confirmed UI or UX changes.
3. Update `doc/architecture.md` when the implementation design changes.
4. Re-check the three Source of Truth files for contradictions.
5. Search existing Tasks for the same objective and inspect their Status.
6. Select the Task path without rewriting completed history:
   - update the matching Task only when it is `Ready` or `Blocked`
   - when the matching Task is `Done` and the user requested a new change, leave it
     unchanged and create the next uniquely identified Task for only the new delta
   - when no matching Task exists, create the next Task from `TEMPLATE.md`
7. For a new delta Task that changes completed work, record the affected `Done` Task
   under `Depends On` and make the new objective and acceptance criteria distinct
   from the completed Task.
8. Record the change type, documentation impact, Candidate References, confirmed decisions, scope, out of scope, allowed changes, dependencies, and acceptance criteria.
9. Set the selected Task status using the status gate below.

Do not modify application code in this Skill.
Do not reopen, overwrite, or clear Completion Evidence from a `Done` Task for an
ordinary feature change. `Done → Ready` is reserved for the Integration Review
remediation flow defined by `reopen-task`.
Apply confirmed decisions with exactly one Planner writer.

## Task Status Gate

Set `Status: Ready` only when all are true:

- there are no material Open Decisions
- every dependency Task is `Done`
- required Source of Truth updates are complete
- Source of Truth files do not conflict on implementation-relevant points
- Scope, Out of Scope, Allowed Changes, and Acceptance Criteria are testable

Otherwise keep `Status: Blocked` and write an explicit Unblock Condition.

## Output

When blocked on user decisions, report:

1. change summary
2. differences and conflicts
3. documentation impact candidates
4. questions requiring answers
5. files that would change after confirmation

After applying confirmed decisions, report:

1. confirmed decisions
2. updated Source of Truth files and reasons
3. created or updated Task
4. Task status and rationale
5. remaining unresolved items
