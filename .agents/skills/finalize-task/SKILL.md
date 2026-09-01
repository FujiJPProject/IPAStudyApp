---
name: finalize-task
description: "Finalize one implemented repository Task after review and any required fixes by verifying the latest Review covers the current implementation, requires Next step: proceed, reruns tests and build, and changes only the Task status and completion evidence to Done. Use after the final Reviewer pass, never for implementation or review work."
---

# Finalize Task

## Required Context

Read completely:

1. `AGENTS.md`
2. `.agents/roles/finalizer.md`
3. the specified Task
4. every dependency Task
5. the Review path defined by the Task
6. relevant current code and tests

## Preconditions

Require all of the following:

- the specified Task is `Ready`
- every dependency Task is `Done`
- the latest formal Review covers the current implementation
- the latest Review concludes exactly `Next step: proceed`
- no Critical or High finding remains unresolved
- no application code changed after the latest Review
- `npm run test` succeeds on the current repository state
- `npm run build` succeeds on the current repository state

If a Fixer changed application code after a Review,
require a new Reviewer pass before finalization.

## Procedure

1. Read the Task and its Review Output path.
2. Confirm the Task is `Ready` and its dependencies are `Done`.
3. Read the latest Review completely.
4. Confirm the Review evaluates the current implementation.
5. Confirm the Review decision is exactly `Next step: proceed`.
6. Confirm no Critical or High finding remains unresolved.
7. Run `npm run test`.
8. Run `npm run build`.
9. Stop without editing if any precondition fails.
10. Change only the specified Task from `Status: Ready` to `Status: Done`.
11. Add or update `Completion Evidence` with the final Review path, decision, and verification results.
12. Re-read the Task and confirm no other section changed.

## Completion Evidence

Record:

```text
Final Review: .agents/reviews/[task-id]-review.md
Review Decision: Next step: proceed
Verification: npm run test / npm run build succeeded
```

Do not copy the full Review into the Task.

## Restrictions

Do not:

- modify application code or tests
- modify Source of Truth
- modify Review artifacts
- change Task scope or requirements
- resolve findings yourself
- mark a `Blocked` Task as `Done`
- mark a Task `Done` from a Fixer report alone
- modify any Task other than the specified Task

## Output

When finalized, report:

1. finalized Task
2. final Review used
3. test and build results
4. recorded Completion Evidence

When blocked, report:

1. failed precondition
2. required next Role: Builder, Reviewer, or Fixer
3. files left unchanged
