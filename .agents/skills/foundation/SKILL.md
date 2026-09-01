---
name: foundation
description: Build the minimum Vue 3 application foundation defined by architecture.md before implementing feature-specific behavior. Use for the initial Phase 4 application foundation task.
---

# Foundation

## Required Context

Read:

1. `AGENTS.md`
2. `doc/requirements.md`
3. `doc/architecture.md`
4. the specified foundation Task

Read `doc/ui-reference.html` only when necessary for
basic layout or responsive structure.

---

## Goal

Create the minimum application foundation needed to add MVP features.

Do not implement feature-specific behavior.

---

## Procedure

1. Confirm the Task status is `Ready`.
2. Inspect the current repository state.
3. Compare the repository with `architecture.md`.
4. Create only the foundation required by the Task.
5. Configure Vue Router and basic Routes.
6. Create the minimum common layout and Views.
7. Create the minimum Material Metadata / Definitions structure.
8. Configure Vitest and Vue Test Utils as required.
9. Configure one-shot `npm run test`.
10. Run tests.
11. Run the production build.
12. Check every Acceptance Criterion.

---

## Constraints

Do not implement in this Skill:

- Sort Domain
- sort step execution
- learning-history persistence
- Pinia
- Repository
- API Client
- authentication
- database
- Generic Material Engine
- future materials

Do not create empty abstraction layers only for future use.

---

## Verification

Run:

```bash
npm run test
npm run build
```

If visual verification is required, also use:

```bash
npm run dev
```

or:

```bash
npm run preview
```

---

## Completion

Complete only when:

- the Task Acceptance Criteria are satisfied
- tests pass
- the production build succeeds
- no feature-specific implementation was introduced early

Report using the format defined in `AGENTS.md`.

