# Task: [Task Name]

## ID

[task-id]

## Status

Ready

Allowed values:

- Ready
- Blocked
- Done

## Depends On

- [dependency-task-id]
- none

---

## Objective

今回このTaskで完成させる内容を書く。

---

## Source of Truth

- `docs/requirements.md`
- `docs/architecture.md`

UIに関係する場合のみ：

- `docs/ui-reference.html`

---

## Scope

今回実装する内容：

- 
- 
- 

---

## Out of Scope

今回実装・変更しない内容：

- 
- 
- 

---

## Allowed Changes

原則として変更可能なパス：

```text
src/...
tests/...
```

ここにないファイル変更が必要になった場合は、
変更を行う前に理由を報告する。

---

## Confirmed Decisions

今回のTaskで既に確定している仕様を書く。

AIが推測で仕様を追加しない。

---

## Open Decisions

未確定事項がある場合に記載する。

重要な未確定事項が残っている場合は、

```text
Status: Blocked
```

とする。

---

## Acceptance Criteria

- [ ] 条件1
- [ ] 条件2
- [ ] `npm run test` が成功する
- [ ] `npm run build` が成功する
- [ ] 既存機能を壊していない

---

## Review Output

```text
.agents/reviews/[task-id]-review.md
```
