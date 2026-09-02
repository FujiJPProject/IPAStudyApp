import type { SortStep } from './domain/sortLogic'

export type BarState = 'normal' | 'compare' | 'action' | 'settled'

export function resolveBarState(index: number, step: SortStep | null): BarState {
  if (step?.actionIndices.includes(index)) return 'action'
  if (step?.compareIndices.includes(index)) return 'compare'
  if (step?.settledIndices.includes(index)) return 'settled'
  return 'normal'
}

export function getBarStateLabel(state: BarState, settledLabel: string): string {
  if (state === 'action') return '交換・移動・書き込み'
  if (state === 'compare') return '比較中'
  if (state === 'settled') return settledLabel
  return '通常'
}

