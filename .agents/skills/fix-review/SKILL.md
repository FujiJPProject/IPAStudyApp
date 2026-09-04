---
name: fix-review
description: Fix only Critical and High findings from a saved Review artifact with the smallest safe change. Use after feature review when blocking findings exist.
---

# Fix Review

## Required Context

Read:

1. `AGENTS.md`
2. `.agents/roles/fixer.md`
3. `doc/requirements.md`
4. `doc/architecture.md`
5. the original Task
6. the specified feature ReviewまたはIntegration Review
7. relevant current code and tests

---

## Scope

By default fix only:

- Critical
- High

Integration Reviewを入力にする場合は、`Next step: fix required`であり、指定Taskに対応付けられたMandatory fixだけを修正する。

Do not fix Medium / Low unless a later Task explicitly requests them.

---

## Procedure

1. Read all Critical / High findings. Integration Reviewの場合は、指定TaskのMandatory fixとRequired closureだけを対象にする。
2. Verify each finding against the current code.
3. Identify the root cause.
4. Make the smallest safe correction.
5. Add a regression test when appropriate.
6. Run affected tests.
7. Run the complete test command.
8. Run the production build.
9. Re-check every Critical / High finding.

If a finding is no longer reproducible or is incorrect,
do not force a code change.

Report the reason.

---

## Restrictions

Do not:

- expand the original Task Scope
- perform unrelated refactoring
- implement new functionality
- change requirements.md
- change architecture.md
- fix Medium / Low as a convenience

---

## Verification

Run:

```bash
npm run test
npm run build
```

---

## Completion

Always require a new formal Reviewer pass, whether or not application code
changed. The previous Review still concludes `fix Critical / High` and cannot
authorize Finalizer.
Do not change the Task status and do not proceed directly to Finalizer.

Report:

1. fixed Critical / High findings
2. changed files
3. verification results
4. remaining Critical / High
5. untouched Medium / Low
