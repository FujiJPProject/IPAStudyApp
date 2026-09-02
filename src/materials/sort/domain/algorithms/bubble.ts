import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep } from '../traceBuilder'

export function createBubbleTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []
  const settled: number[] = []

  for (let end = array.length - 1; end > 0; end -= 1) {
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'scan',
        flowNodeId: 'scan',
        title: '未確定範囲の走査を開始',
        description: `index 0 から ${end} までを左から確認します。`,
        variables: [{ name: '未確定範囲の右端位置', value: end, index: end }],
        settledIndices: settled,
      }),
    )

    for (let index = 0; index < end; index += 1) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase: 'scan',
          flowNodeId: 'compare',
          title: '隣り合う値を比較',
          description: `${array[index]} と ${array[index + 1]} を比較します。`,
          variables: [
            { name: '比較位置', value: index, index },
            { name: '右の位置', value: index + 1, index: index + 1 },
            { name: '左の値', value: array[index] },
            { name: '右の値', value: array[index + 1] },
          ],
          compareIndices: [index, index + 1],
          settledIndices: settled,
        }),
      )

      if (array[index] > array[index + 1]) {
        ;[array[index], array[index + 1]] = [array[index + 1], array[index]]
        steps.push(
          createStep(array, {
            kind: 'action',
            phase: 'scan',
            flowNodeId: 'swap',
            title: '2つの値を交換',
            description: '左の値が大きいため、隣り合う2つの値を交換しました。',
            variables: [
              { name: '交換元位置', value: index, index },
              { name: '交換先位置', value: index + 1, index: index + 1 },
            ],
            actionIndices: [index, index + 1],
            settledIndices: settled,
          }),
        )
      }
    }

    settled.unshift(end)
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'scan',
        flowNodeId: 'settle',
        title: '末尾位置を確定',
        description: `未確定範囲で最大の値がindex ${end} に到達し、位置が確定しました。`,
        variables: [{ name: '確定した位置', value: end, index: end }],
        settledIndices: settled,
      }),
    )
  }

  steps.push(createCompleteStep(array, 'position'))
  return steps
}

