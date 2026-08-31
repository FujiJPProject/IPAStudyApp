---
name: implement-feature
description: Implement one Ready feature Task while preserving requirements.md and architecture.md. Use for Phase 5 and repeated feature implementation work in ChatGPT Work or Codex.
---

# Implement Feature

## Required Context

Read:

1. `AGENTS.md`
2. `.agents/roles/builder.md`
3. `docs/requirements.md`
4. `docs/architecture.md`
5. the specified Task
6. relevant existing code

Read `docs/ui-reference.html` only when the Task affects UI or UX.

---

## Precondition

Confirm:

```text
Status: Ready
```

If the Task is `Blocked`, do not edit code.

Report:

1. why it is blocked
2. what must be decided
3. what file should be updated before implementation

---

## Procedure

1. Read the Task completely.
2. Confirm Objective.
3. Confirm Scope.
4. Confirm Out of Scope.
5. Confirm Allowed Changes.
6. Confirm dependencies are complete.
7. Inspect related existing implementation and tests.
8. Select the smallest implementation that satisfies the Task.
9. Make only required changes.
10. Add or update tests where appropriate.
11. Run relevant tests.
12. Run the complete test command.
13. Run the production build.
14. Verify every Acceptance Criterion.

---

## Architecture Checks

Ensure that:

- UI and domain logic remain separated
- material-specific logic remains under its material area
- `MaterialView` does not gain material-specific State
- domain logic does not depend on Vue Router
- domain logic does not depend on localStorage
- localStorage access goes through the designated persistence service
- no unnecessary Pinia Store is introduced
- no unnecessary Repository is introduced
- no generic material engine is created prematurely

---

## Dependency Rule

Do not add a new npm dependency unless:

1. the Task actually requires it
2. existing project capabilities cannot reasonably satisfy the requirement
3. it does not conflict with `architecture.md`

If a dependency would materially change the architecture,
stop and report instead of installing it.

---

## Verification

Run:

```bash
npm run test
npm run build
```

For UI changes, also verify the relevant screen in a browser.

Pay particular attention to:

- desktop layout
- smartphone layout
- primary controls
- horizontal overflow
- visualization readability

---

## Completion

Do not perform the formal Review in this same task.

When implementation and verification are complete,
report only the Work Output defined in `AGENTS.md`.
