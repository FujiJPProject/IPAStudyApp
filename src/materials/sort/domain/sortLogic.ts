import { createBubbleTrace } from './algorithms/bubble'
import { createHeapTrace } from './algorithms/heap'
import { createInsertionTrace } from './algorithms/insertion'
import { createMergeTrace } from './algorithms/merge'
import { createQuickTrace } from './algorithms/quick'
import { createSelectionTrace } from './algorithms/selection'
import { createShellTrace } from './algorithms/shell'
import type { SortAlgorithmId, SortTrace } from './sortTypes'

const traceFactories: Record<SortAlgorithmId, (input: readonly number[]) => SortTrace> = {
  bubble: createBubbleTrace,
  selection: createSelectionTrace,
  insertion: createInsertionTrace,
  quick: createQuickTrace,
  merge: createMergeTrace,
  heap: createHeapTrace,
  shell: createShellTrace,
}

export function createSortTrace(input: readonly number[], algorithm: SortAlgorithmId): SortTrace {
  return traceFactories[algorithm](input)
}

export type {
  SettledMeaning,
  SortAlgorithmId,
  SortCompareOperand,
  SortPhase,
  SortStep,
  SortStepKind,
  SortTrace,
  SortVariable,
} from './sortTypes'
