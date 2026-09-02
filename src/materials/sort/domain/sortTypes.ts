export type SortAlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'quick'
  | 'merge'
  | 'heap'
  | 'shell'

export type SortStepKind = 'phase' | 'compare' | 'action' | 'settled' | 'complete'

export type SettledMeaning = 'position' | 'range'

export type SortPhase =
  | 'scan'
  | 'insert'
  | 'partition'
  | 'merge'
  | 'heap-build'
  | 'heap-extract'
  | 'gap-pass'
  | 'complete'

export interface SortVariable {
  name: string
  value: string | number
  index?: number
}

export interface SortArrayCompareOperand {
  source: 'array'
  label: string
  value: number
  index: number
}

export interface SortExternalCompareOperand {
  source: 'held' | 'left-buffer' | 'right-buffer'
  label: string
  value: number
}

export type SortCompareOperand = SortArrayCompareOperand | SortExternalCompareOperand

export interface SortStep {
  array: readonly number[]
  kind: SortStepKind
  phase: SortPhase
  flowNodeId: string
  title: string
  description: string
  variables: readonly SortVariable[]
  compareOperands: readonly SortCompareOperand[]
  compareIndices: readonly number[]
  actionIndices: readonly number[]
  settledIndices: readonly number[]
  settledMeaning: SettledMeaning
  complete: boolean
}

export type SortTrace = readonly SortStep[]
