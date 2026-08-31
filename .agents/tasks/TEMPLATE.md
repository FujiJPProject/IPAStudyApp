# Task: [Task Name]

## ID

[task-id]

## Change Type

[Add | Modify | Delete]

## Status

Blocked

Allowed values:

- Ready
- Blocked
- Done

新規Taskは原則としてBlockedから開始する。

以下をすべて満たす場合のみReadyへ変更する。

- 重要なOpen Decisionsがない
- 依存TaskがすべてDone
- 必要なSource of Truth更新が完了している
- Source of Truth間に実装判断へ影響する矛盾がない

## Depends On

- [dependency-task-id]
- none

依存Taskがない場合は `none` だけを書く。

---

## Objective

今回このTaskで完成させる内容を書く。

---

## Source of Truth

- `doc/requirements.md`
- `doc/architecture.md`

UIに関係する場合のみ：

- `doc/ui-reference.html`

---

## Source of Truth Impact

Plannerが今回の変更による影響と反映結果を書く。

```text
requirements.md: [Updated | No change] - [理由]
ui-reference.html: [Updated | No change] - [理由]
architecture.md: [Updated | No change] - [理由]
```

---

## Candidate References

採用前のHTML、モック、メモ等がある場合だけ記載する。

- [参照名またはパス]

Candidate Reference自体はSource of Truthではない。

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

未確定事項がない場合は `なし。` と書く。

---

## Unblock Condition

Blockedの場合、Readyへ変更するために必要な判断・更新を書く。

Readyの場合は `なし。` と書く。

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
