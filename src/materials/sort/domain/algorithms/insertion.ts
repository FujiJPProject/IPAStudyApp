import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep, rangeIndices } from '../traceBuilder'

export function createInsertionTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []

  for (let target = 1; target < array.length; target += 1) {
    const value = array[target]
    let cursor = target - 1

    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'insert',
        flowNodeId: 'pick',
        title: '挿入する値を取得',
        description: `${value} を左側の整列済み範囲へ挿入します。`,
        variables: [
          { name: '挿入対象位置', value: target, index: target },
          { name: '挿入する値', value },
        ],
        settledIndices: rangeIndices(0, target - 1),
        settledMeaning: 'range',
      }),
    )

    while (cursor >= 0) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase: 'insert',
          flowNodeId: 'compare',
          title: '左の値と挿入値を比較',
          description: `${array[cursor]} と配列外に保持している挿入値 ${value} を比較します。`,
          variables: [
            { name: '比較位置', value: cursor, index: cursor },
            { name: '書き込み候補位置', value: cursor + 1, index: cursor + 1 },
            { name: '保持している挿入値', value },
          ],
          compareOperands: [
            {
              source: 'array',
              label: '左側の配列値',
              value: array[cursor],
              index: cursor,
            },
            {
              source: 'held',
              label: '保持している挿入値',
              value,
            },
          ],
          settledIndices: rangeIndices(0, target - 1),
          settledMeaning: 'range',
        }),
      )

      if (array[cursor] <= value) break

      array[cursor + 1] = array[cursor]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'insert',
          flowNodeId: 'shift',
          title: '値を右へ移動',
          description: `${array[cursor]} を1つ右へ移動しました。`,
          variables: [
            { name: '移動元位置', value: cursor, index: cursor },
            { name: '移動先位置', value: cursor + 1, index: cursor + 1 },
          ],
          actionIndices: [cursor, cursor + 1],
          settledMeaning: 'range',
        }),
      )
      cursor -= 1
    }

    array[cursor + 1] = value
    steps.push(
      createStep(array, {
        kind: 'action',
        phase: 'insert',
        flowNodeId: 'insert',
        title: '挿入値を書き込む',
        description: `${value} をindex ${cursor + 1} へ書き込みました。`,
        variables: [
          { name: '書き込み位置', value: cursor + 1, index: cursor + 1 },
          { name: '書き込んだ値', value },
        ],
        actionIndices: [cursor + 1],
        settledIndices: rangeIndices(0, target),
        settledMeaning: 'range',
      }),
    )
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'insert',
        flowNodeId: 'settle',
        title: '整列済み範囲を拡張',
        description: `index 0 から ${target} までが整列済みになりました。`,
        variables: [{ name: '整列済み範囲の右端位置', value: target, index: target }],
        settledIndices: rangeIndices(0, target),
        settledMeaning: 'range',
      }),
    )
  }

  steps.push(createCompleteStep(array, 'range'))
  return steps
}
