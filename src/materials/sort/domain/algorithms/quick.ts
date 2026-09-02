import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep } from '../traceBuilder'

export function createQuickTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []
  const settled = new Set<number>()

  function partition(left: number, right: number): void {
    if (left > right) return

    if (left === right) {
      settled.add(left)
      steps.push(
        createStep(array, {
          kind: 'settled',
          phase: 'partition',
          flowNodeId: 'settle',
          title: '1要素の位置を確定',
          description: `index ${left} は1要素の範囲なので位置が確定しました。`,
          variables: [{ name: '確定した位置', value: left, index: left }],
          settledIndices: [...settled],
        }),
      )
      return
    }

    const pivot = array[right]
    let boundary = left
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'partition',
        flowNodeId: 'range',
        title: '処理範囲と基準値を決定',
        description: `index ${left} から ${right} を処理し、右端の ${pivot} を基準値にします。`,
        variables: [
          { name: '左端位置', value: left, index: left },
          { name: '右端位置', value: right, index: right },
          { name: '基準値位置', value: right, index: right },
          { name: '基準値', value: pivot },
        ],
        settledIndices: [...settled],
      }),
    )

    for (let scan = left; scan < right; scan += 1) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase: 'partition',
          flowNodeId: 'compare',
          title: '探索値と基準値を比較',
          description: `${array[scan]} が基準値 ${pivot} 以下か確認します。`,
          variables: [
            { name: '探索位置', value: scan, index: scan },
            { name: '境界位置', value: boundary, index: boundary },
            { name: '基準値位置', value: right, index: right },
          ],
          compareIndices: [scan, right],
          settledIndices: [...settled],
        }),
      )

      if (array[scan] <= pivot) {
        if (scan !== boundary) {
          ;[array[scan], array[boundary]] = [array[boundary], array[scan]]
          steps.push(
            createStep(array, {
              kind: 'action',
              phase: 'partition',
              flowNodeId: 'move',
              title: '基準値以下の値を左側へ移動',
              description: `index ${scan} の値を左側領域のindex ${boundary} へ移動しました。`,
              variables: [
                { name: '移動元位置', value: scan, index: scan },
                { name: '移動先位置', value: boundary, index: boundary },
              ],
              actionIndices: [scan, boundary],
              settledIndices: [...settled],
            }),
          )
        }
        boundary += 1
      }
    }

    if (boundary !== right) {
      ;[array[boundary], array[right]] = [array[right], array[boundary]]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'partition',
          flowNodeId: 'place-pivot',
          title: '基準値を確定位置へ移動',
          description: `基準値 ${pivot} をindex ${boundary} へ移動しました。`,
          variables: [
            { name: '基準値の移動元位置', value: right, index: right },
            { name: '基準値の確定位置', value: boundary, index: boundary },
          ],
          actionIndices: [boundary, right],
          settledIndices: [...settled],
        }),
      )
    }

    settled.add(boundary)
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'partition',
        flowNodeId: 'settle',
        title: '基準値の位置を確定',
        description: `基準値 ${pivot} の位置がindex ${boundary} に確定しました。`,
        variables: [{ name: '基準値の確定位置', value: boundary, index: boundary }],
        settledIndices: [...settled],
      }),
    )

    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'partition',
        flowNodeId: 'recurse',
        title: '左右の範囲を再帰処理',
        description: '基準値の左右を、同じ分割処理でそれぞれ整列します。',
        variables: [
          { name: '左端位置', value: left, index: left },
          { name: '基準値の確定位置', value: boundary, index: boundary },
          { name: '右端位置', value: right, index: right },
        ],
        settledIndices: [...settled],
      }),
    )

    partition(left, boundary - 1)
    partition(boundary + 1, right)
  }

  partition(0, array.length - 1)
  steps.push(createCompleteStep(array, 'position'))
  return steps
}

