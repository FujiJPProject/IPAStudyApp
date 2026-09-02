import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep, rangeIndices } from '../traceBuilder'

export function createShellTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []
  const gaps: number[] = []

  for (let gap = Math.floor(array.length / 2); gap >= 1; gap = Math.floor(gap / 2)) {
    gaps.push(gap)
    if (gap === 1) break
  }

  for (const gap of gaps) {
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'gap-pass',
        flowNodeId: 'gap',
        title: `gapを${gap}に変更`,
        description: `${gap}個離れた値を挿入ソートの要領で整えます。`,
        variables: [{ name: 'gap', value: gap }],
        settledIndices: gap === 1 ? rangeIndices(0, 0) : [],
        settledMeaning: 'range',
      }),
    )

    for (let target = gap; target < array.length; target += 1) {
      const value = array[target]
      let cursor = target

      while (cursor >= gap) {
        steps.push(
          createStep(array, {
            kind: 'compare',
            phase: 'gap-pass',
            flowNodeId: 'compare',
            title: 'gapだけ離れた値を比較',
            description: `${array[cursor - gap]} と配列外に保持している挿入値 ${value} を比較します。`,
            variables: [
              { name: 'gap', value: gap },
              { name: '比較位置', value: cursor - gap, index: cursor - gap },
              { name: '挿入対象位置', value: cursor, index: cursor },
              { name: '保持している挿入値', value },
            ],
            compareOperands: [
              {
                source: 'array',
                label: 'gapだけ左の配列値',
                value: array[cursor - gap],
                index: cursor - gap,
              },
              {
                source: 'held',
                label: '保持している挿入値',
                value,
              },
            ],
            settledMeaning: 'range',
          }),
        )

        if (array[cursor - gap] <= value) break

        array[cursor] = array[cursor - gap]
        steps.push(
          createStep(array, {
            kind: 'action',
            phase: 'gap-pass',
            flowNodeId: 'move',
            title: '値をgap分だけ右へ移動',
            description: `${array[cursor]} をindex ${cursor} へ移動しました。`,
            variables: [
              { name: 'gap', value: gap },
              { name: '移動元位置', value: cursor - gap, index: cursor - gap },
              { name: '移動先位置', value: cursor, index: cursor },
            ],
            actionIndices: [cursor - gap, cursor],
            settledMeaning: 'range',
          }),
        )
        cursor -= gap
      }

      array[cursor] = value
      steps.push(
        createStep(array, {
          kind: 'action',
          phase: 'gap-pass',
          flowNodeId: 'write',
          title: '挿入値を書き込む',
          description: `${value} をindex ${cursor} へ書き込みました。`,
          variables: [
            { name: 'gap', value: gap },
            { name: '書き込み位置', value: cursor, index: cursor },
            { name: '書き込んだ値', value },
          ],
          actionIndices: [cursor],
          settledMeaning: 'range',
        }),
      )
    }

    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'gap-pass',
        flowNodeId: 'settle',
        title: `gap ${gap} の処理を完了`,
        description:
          gap === 1
            ? 'gap 1 の挿入ソートが完了し、配列全体が整列済みになりました。'
            : `gap ${gap} ごとの部分列が整列済みになりました。`,
        variables: [{ name: '完了したgap', value: gap }],
        settledIndices: gap === 1 ? rangeIndices(0, array.length - 1) : [],
        settledMeaning: 'range',
      }),
    )
  }

  steps.push(createCompleteStep(array, 'range'))
  return steps
}
