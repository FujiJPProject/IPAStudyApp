import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep } from '../traceBuilder'

export function createSelectionTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []
  const settled: number[] = []

  for (let fixed = 0; fixed < array.length - 1; fixed += 1) {
    let minimum = fixed
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'scan',
        flowNodeId: 'scan',
        title: '最小値の探索を開始',
        description: `index ${fixed} に置く最小値を未確定範囲から探します。`,
        variables: [
          { name: '確定する位置', value: fixed, index: fixed },
          { name: '最小候補位置', value: minimum, index: minimum },
        ],
        settledIndices: settled,
      }),
    )

    for (let scan = fixed + 1; scan < array.length; scan += 1) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase: 'scan',
          flowNodeId: 'compare',
          title: '最小候補と探索中の値を比較',
          description: `${array[scan]} と最小候補 ${array[minimum]} を比較します。`,
          variables: [
            { name: '探索位置', value: scan, index: scan },
            { name: '最小候補位置', value: minimum, index: minimum },
          ],
          compareIndices: [minimum, scan],
          settledIndices: settled,
        }),
      )
      if (array[scan] < array[minimum]) minimum = scan
    }

    if (minimum !== fixed) {
      ;[array[fixed], array[minimum]] = [array[minimum], array[fixed]]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'scan',
          flowNodeId: 'move',
          title: '最小値を確定位置へ移動',
          description: `最小値をindex ${fixed} へ移動しました。`,
          variables: [
            { name: '確定する位置', value: fixed, index: fixed },
            { name: '最小値の移動元位置', value: minimum, index: minimum },
          ],
          actionIndices: [fixed, minimum],
          settledIndices: settled,
        }),
      )
    }

    settled.push(fixed)
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'scan',
        flowNodeId: 'settle',
        title: '先頭位置を確定',
        description: `index ${fixed} の位置が確定しました。`,
        variables: [{ name: '確定した位置', value: fixed, index: fixed }],
        settledIndices: settled,
      }),
    )
  }

  steps.push(createCompleteStep(array, 'position'))
  return steps
}

