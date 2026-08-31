---
name: integration-review
description: Review the completed MVP as a whole against requirements.md and architecture.md without changing application code. Use after all MVP feature implementation and feature-level fixes are complete.
---

# Integration Review

## Required Context

Read:

1. `AGENTS.md`
2. `.agents/roles/release-auditor.md`
3. `doc/requirements.md`
4. `doc/architecture.md`
5. current repository
6. package.json
7. package-lock.json
8. relevant feature Reviews

Read `doc/ui-reference.html` for UI and learning-flow verification.

---

## Review Areas

### MVP Requirements

Compare the implementation against every MVP completion requirement.

### Screens

Verify:

- HOME
- Learning Materials
- Material
- Learning History

### Routing

Verify the intended routes including:

```text
/
/materials
/materials/:materialId
/history
```

Also check:

- unknown materialId handling
- unknown route handling
- browser back / forward behavior

### Material Architecture

Verify:

- `materials/definitions.ts` is the material registration source
- `MaterialView` does not contain Sort-specific State
- Sort Domain remains material-specific
- common code does not depend on Sort Domain
- a second material would not require rewriting the existing Sort material

### Persistence

Verify:

- persisted fields are only those allowed by the MVP
- localStorage access is separated from UI
- storage failure does not make the learning material unusable

### State Management

Verify:

- material execution State is local to the material
- unnecessary global Store has not been introduced

### UI / Responsive

Verify the learning flow:

```text
initial state
→ start
→ step
→ state change
→ final result
→ why
→ insight
```

Check desktop and smartphone layouts.

### Verification

Run:

```bash
npm run test
npm run build
```

---

## Modification Rule

Do not modify application code.

The only permitted write is:

```text
.agents/reviews/integration-review.md
```

---

## Output

Classify concrete findings as:

- Critical
- High
- Medium
- Low

Write:

```text
.agents/reviews/integration-review.md
```

Conclude with:

- MVP releaseable: Yes / No
- mandatory fixes before release
- deferrable improvements

