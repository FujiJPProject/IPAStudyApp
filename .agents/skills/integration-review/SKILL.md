---
name: integration-review
description: "Review a completed MVP release candidate as a whole against requirements.md and architecture.md without changing application code. Use only after every in-scope MVP Task is Done, including after cross-cutting changes to a previously completed MVP. Do not use after every ordinary feature Task."
---

# Integration Review

## Entry Gate

Start only when every Task in the MVP release scope is `Done`. This includes the
initial completed MVP and a previously completed MVP after cross-cutting changes
have passed their feature-level completion gates.

If any in-scope MVP Task is not `Done`, stop and report the incomplete Task
instead of producing an Integration Review.

Do not run this Skill automatically after every ordinary feature Task. The
completion gate for one Task is `review-feature` followed by `finalize-task`,
ending when the Task is `Done`.

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

## Parallel Investigation

When this Skill is orchestrated in Codex, the parent Orchestrator may run at
most three non-overlapping `workflow_analyst` investigations in parallel.

When this Skill is run manually in ChatGPT Work, use one Release Auditor by
default. If hosted subagents are available and parallel investigation is
warranted, the Work chat may run at most three generic read-only investigation
subagents. ChatGPT Work must not require or reference the Codex-only
`.codex/agents/workflow-analyst.toml`.

Example investigation lanes are:

- requirements, routing, and feature integration
- architecture, state ownership, and persistence
- tests, UI, responsive behavior, and release risks

Investigation agents must not modify files or write Review artifacts.
After they finish, exactly one designated Release Auditor validates and
consolidates the results into the integration Review artifact.

Do not parallelize the final artifact write, tests that contend for the same
outputs, or any application-code change.

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

The only permitted write is one new artifact under:

```text
.agents/reviews/integration-review-[identifier].md
```

Never overwrite a previous Integration Review. Use a unique identifier such as a date-time or sequence number.

---

## Output

Classify concrete findings as:

- Critical
- High
- Medium
- Low

Write one new artifact:

```text
.agents/reviews/integration-review-[identifier].md
```

Use this output contract:

- `MVP releaseable: Yes / No`
- `Next step: proceed / fix required / user decision required`
- Blocking findings
  - Finding ID
  - Severity
  - Affected Task
  - Required closure
- Mandatory fixes before release
- Deferrable improvements

When `MVP releaseable: Yes`, conclude with exactly `Next step: proceed`.

When `MVP releaseable: No` and the correction does not require a user specification decision or Task split, conclude with exactly `Next step: fix required`. Every Mandatory fix must be classified as Critical or High and include an Affected Task and Required closure.

When a requirement change, acceptance-criteria change, Task split, or another important product decision is necessary, conclude with exactly `Next step: user decision required`. Do not infer the decision.

The Release Auditor does not modify application code, Tasks, or Source of Truth. The parent Orchestrator uses the result to select the next Skill.
