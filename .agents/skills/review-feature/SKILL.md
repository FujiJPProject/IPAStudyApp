---
name: review-feature
description: Perform a read-only review of one implemented feature against its Task, requirements.md, architecture.md, tests, and UI reference when applicable. Use after Builder implementation and before Fixer work.
---

# Review Feature

## Required Context

Read:

1. `AGENTS.md`
2. `.agents/roles/reviewer.md`
3. `doc/requirements.md`
4. `doc/architecture.md`
5. the specified Task
6. current implementation
7. related tests

Read `doc/ui-reference.html` when UI behavior is part of the Task.

---

## Review Rule

Do not modify application code.

The only permitted file creation or update is the
Review artifact under:

```text
.agents/reviews/
```

---

## Review Areas

### Requirements

Check:

- Task Objective is achieved
- Scope is implemented
- Acceptance Criteria are satisfied
- Out of Scope functionality was not added
- requirements.md is satisfied

### Architecture

Check:

- architecture.md is followed
- common and material-specific responsibilities remain separated
- material-specific concepts do not leak into common code
- `MaterialView` does not own material-specific State
- localStorage is not accessed directly by Vue UI components
- persistence follows the architecture
- no unnecessary Pinia / Repository / generic engine was introduced

### Vue

Check:

- State ownership is reasonable
- Composition API usage is natural
- props / emits responsibilities are clear
- components are not split without reason
- components are not excessively large

### TypeScript

Check:

- avoidable `any` is not used
- domain types are appropriately scoped
- null / undefined cases are handled
- invalid persisted data cannot trivially break the app

### Tests

Check:

- important logic has coverage
- tests correspond to actual requirements
- regression-prone behavior is covered where appropriate

### UI / Responsive

When applicable, check:

- major UI structure matches the UI reference
- primary controls are usable on smartphone widths
- visualization remains readable
- no obvious horizontal overflow is introduced

### Other

Check only concrete issues involving:

- error handling
- security
- performance

Do not manufacture speculative issues.

---

## Severity

### Critical

Examples:

- MVP cannot be used
- destructive data problem
- serious security issue

### High

Examples:

- requirement is not met
- major feature is broken
- major architecture rule is violated

### Medium

A real quality problem that does not directly prevent MVP release.

### Low

A minor improvement that is safe to defer.

---

## Verification

Run tests or build when useful for confirming findings.

Prefer:

```bash
npm run test
npm run build
```

---

## Output

Write the result to the Review path defined by the Task.

Use `.agents/reviews/TEMPLATE.md`.

Conclude with exactly one decision:

```text
Next step: proceed
```

or:

```text
Next step: fix Critical / High
```

