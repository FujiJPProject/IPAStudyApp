import type {
  SettledMeaning,
  SortCompareOperand,
  SortPhase,
  SortStep,
  SortStepKind,
  SortVariable,
} from './sortTypes'

interface StepInput {
  kind: SortStepKind
  phase: SortPhase
  flowNodeId: string
  title: string
  description: string
  variables?: readonly SortVariable[]
  compareOperands?: readonly SortCompareOperand[]
  compareIndices?: readonly number[]
  actionIndices?: readonly number[]
  settledIndices?: readonly number[]
  settledMeaning?: SettledMeaning
}

export function createStep(array: readonly number[], input: StepInput): SortStep {
  const declaredOperands = input.compareOperands?.map((operand) => ({ ...operand }))
  const compareIndices = declaredOperands
    ? declaredOperands.flatMap((operand) => (operand.source === 'array' ? [operand.index] : []))
    : [...(input.compareIndices ?? [])]
  const compareOperands =
    declaredOperands ??
    compareIndices.flatMap((index): SortCompareOperand[] => {
      const value = array[index]
      return value === undefined
        ? []
        : [{ source: 'array', label: `配列 index ${index}`, value, index }]
    })

  return {
    array: [...array],
    kind: input.kind,
    phase: input.phase,
    flowNodeId: input.flowNodeId,
    title: input.title,
    description: input.description,
    variables: input.variables?.map((variable) => ({ ...variable })) ?? [],
    compareOperands,
    compareIndices,
    actionIndices: [...(input.actionIndices ?? [])],
    settledIndices: [...(input.settledIndices ?? [])],
    settledMeaning: input.settledMeaning ?? 'position',
    complete: input.kind === 'complete',
  }
}

export function createCompleteStep(array: readonly number[], settledMeaning: SettledMeaning): SortStep {
  return createStep(array, {
    kind: 'complete',
    phase: 'complete',
    flowNodeId: 'end',
    title: 'ソート完了',
    description: 'すべての値が昇順に並びました。',
    variables: [{ name: '状態', value: '完了' }],
    settledIndices: array.map((_, index) => index),
    settledMeaning,
  })
}

export function rangeIndices(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index)
}
