import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep, rangeIndices } from '../traceBuilder'

export function createMergeTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []

  function mergeSort(left: number, right: number): void {
    if (left >= right) return

    const middle = Math.floor((left + right) / 2)
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'merge',
        flowNodeId: 'split',
        title: '範囲を左右へ再帰分割',
        description: `index ${left} から ${right} を、中央index ${middle} で左右へ分けます。`,
        variables: [
          { name: '左端位置', value: left, index: left },
          { name: '中央位置', value: middle, index: middle },
          { name: '右端位置', value: right, index: right },
        ],
        settledMeaning: 'range',
      }),
    )

    mergeSort(left, middle)
    mergeSort(middle + 1, right)

    const leftValues = array.slice(left, middle + 1)
    const rightValues = array.slice(middle + 1, right + 1)
    let leftCursor = 0
    let rightCursor = 0
    let write = left

    while (leftCursor < leftValues.length && rightCursor < rightValues.length) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase: 'merge',
          flowNodeId: 'compare',
          title: '左右の先頭候補を比較',
          description: `左bufferの候補 ${leftValues[leftCursor]} と右bufferの候補 ${rightValues[rightCursor]} を比較します。`,
          variables: [
            { name: '左buffer候補', value: leftValues[leftCursor] },
            { name: '左buffer内位置', value: leftCursor },
            { name: '右buffer候補', value: rightValues[rightCursor] },
            { name: '右buffer内位置', value: rightCursor },
            { name: '書き込み位置', value: write, index: write },
          ],
          compareOperands: [
            {
              source: 'left-buffer',
              label: '左buffer候補',
              value: leftValues[leftCursor],
            },
            {
              source: 'right-buffer',
              label: '右buffer候補',
              value: rightValues[rightCursor],
            },
          ],
          settledMeaning: 'range',
        }),
      )

      if (leftValues[leftCursor] <= rightValues[rightCursor]) {
        array[write] = leftValues[leftCursor]
        leftCursor += 1
      } else {
        array[write] = rightValues[rightCursor]
        rightCursor += 1
      }

      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'merge',
          flowNodeId: 'write',
          title: '小さい値を書き込む',
          description: `${array[write]} をindex ${write} へ書き込みました。`,
          variables: [
            { name: '書き込み位置', value: write, index: write },
            { name: '書き込んだ値', value: array[write] },
          ],
          actionIndices: [write],
          settledMeaning: 'range',
        }),
      )
      write += 1
    }

    while (leftCursor < leftValues.length) {
      array[write] = leftValues[leftCursor]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'merge',
          flowNodeId: 'write',
          title: '左側に残った値を書き込む',
          description: `${array[write]} をindex ${write} へ書き込みました。`,
          variables: [
            { name: '書き込み位置', value: write, index: write },
            { name: '書き込んだ値', value: array[write] },
          ],
          actionIndices: [write],
          settledMeaning: 'range',
        }),
      )
      leftCursor += 1
      write += 1
    }

    while (rightCursor < rightValues.length) {
      array[write] = rightValues[rightCursor]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'merge',
          flowNodeId: 'write',
          title: '右側に残った値を書き込む',
          description: `${array[write]} をindex ${write} へ書き込みました。`,
          variables: [
            { name: '書き込み位置', value: write, index: write },
            { name: '書き込んだ値', value: array[write] },
          ],
          actionIndices: [write],
          settledMeaning: 'range',
        }),
      )
      rightCursor += 1
      write += 1
    }

    const mergedRange = rangeIndices(left, right)
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'merge',
        flowNodeId: 'merge',
        title: '範囲を結合',
        description: `index ${left} から ${right} が整列済みの範囲になりました。`,
        variables: [
          { name: '結合した左端位置', value: left, index: left },
          { name: '結合した右端位置', value: right, index: right },
        ],
        settledIndices: mergedRange,
        settledMeaning: 'range',
      }),
    )
  }

  mergeSort(0, array.length - 1)
  steps.push(createCompleteStep(array, 'range'))
  return steps
}
