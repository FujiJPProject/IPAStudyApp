---
name: reopen-task
description: Safely reopen one Done Task as Ready only for a concrete Critical or High Mandatory fix from an Integration Review.
---

# Reopen Task

## Required Context

Read completely:

1. AGENTS.md
2. .agents/roles/finalizer.md
3. the specified Done Task
4. the specified Integration Review
5. the Task's latest formal Review
6. the parent remediation-session evidence, including the baseline revision and
   earlier Tasks finalized in the same session
7. relevant current code and tests when needed to verify the evidence is current

## Preconditions

Require all of the following:

- the Task is `Done`
- the Integration Review concludes `MVP releaseable: No`
- the Integration Review concludes exactly `Next step: fix required`
- the Integration Review records its `MVP release scope` and `Reviewed revision`
- the recorded revision covered the application implementation when the current
  remediation session began
- the current application implementation either matches that baseline or differs
  only through verified changes for earlier affected Tasks finalized in the same
  remediation session
- every dependency Task is `Done` and no affected dependency is awaiting remediation
- there is no unrelated application change after the baseline Review
- at least one Mandatory fix is classified Critical or High
- every Mandatory fix to be handled is explicitly mapped to the specified Task repository path
- each mapped finding has a concrete Required closure
- the Task's latest formal Review and Completion Evidence can be identified

Do not reopen a Task for Medium, Low, or deferrable improvements.

If the finding requires a requirement change, acceptance-criteria change, Task split, or important product decision, do not reopen the Task. Return the decision required to the parent Orchestrator.

## Procedure

1. Read the specified Task, its Completion Evidence, and Reopen History.
2. Read the complete Integration Review and extract only the Mandatory fixes mapped to the specified Task.
3. Compare the current implementation with the baseline revision and verify that
   every difference is covered by an earlier Task in the session's finalized Task
   list. Verify the remaining Preconditions without modifying files.
4. Append one Reopen History entry containing the Integration Review path,
   baseline Reviewed revision, earlier finalized remediation Tasks, Blocking
   Finding IDs, Required closure summary, previous Final Review path, and reason:
   `MVP releaseable: No`.
5. Change only the specified Task:
   - `Status: Done` to `Status: Ready`
   - `Completion Evidence` to `未完了。`
6. Re-read the Task and confirm only Status, Reopen History, and Completion Evidence changed.
7. Return the Task, findings, Required closure, and the required next Role: Fixer.

## Restrictions

Do not:

- modify application code, tests, Source of Truth, or Review artifacts
- change Task scope, decisions, acceptance criteria, or dependencies
- reopen a Task from a Release Auditor summary alone
- reopen a Task when the baseline Review is missing its output contract, was stale
  at session start, or current changes include anything outside earlier verified
  remediation Tasks
- reopen multiple Tasks in one write operation

## Output

When reopened, report:

1. reopened Task
2. Integration Review used
3. Finding IDs and Required closure
4. invalidated Completion Evidence
5. required next Role: Fixer

When blocked, report:

1. failed precondition
2. decision or evidence required
3. files left unchanged
