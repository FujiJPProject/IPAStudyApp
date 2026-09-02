import type { SortTrace } from '../sortTypes'
import { createCompleteStep, createStep } from '../traceBuilder'

export function createHeapTrace(input: readonly number[]): SortTrace {
  const array = [...input]
  const steps = []
  const settled: number[] = []

  function heapify(size: number, root: number, phase: 'heap-build' | 'heap-extract'): void {
    let largest = root
    const left = root * 2 + 1
    const right = root * 2 + 2

    if (left < size) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase,
          flowNodeId: 'compare',
          title: '親と左の子を比較',
          description: `${array[largest]} と左の子 ${array[left]} を比較します。`,
          variables: [
            { name: 'ヒープサイズ', value: size },
            { name: '親位置', value: root, index: root },
            { name: '左の子位置', value: left, index: left },
          ],
          compareIndices: [largest, left],
          settledIndices: settled,
        }),
      )
      if (array[left] > array[largest]) largest = left
    }

    if (right < size) {
      steps.push(
        createStep(array, {
          kind: 'compare',
          phase,
          flowNodeId: 'compare',
          title: '最大候補と右の子を比較',
          description: `${array[largest]} と右の子 ${array[right]} を比較します。`,
          variables: [
            { name: 'ヒープサイズ', value: size },
            { name: '最大候補位置', value: largest, index: largest },
            { name: '右の子位置', value: right, index: right },
          ],
          compareIndices: [largest, right],
          settledIndices: settled,
        }),
      )
      if (array[right] > array[largest]) largest = right
    }

    if (largest !== root) {
      ;[array[root], array[largest]] = [array[largest], array[root]]
      steps.push(
        createStep(array, {
          kind: 'action',
          phase,
          flowNodeId: 'swap',
          title: '親と大きい子を交換',
          description: '大きい子を親の位置へ移動し、最大ヒープの形を整えました。',
          variables: [
            { name: '交換元位置', value: largest, index: largest },
            { name: '交換先位置', value: root, index: root },
          ],
          actionIndices: [root, largest],
          settledIndices: settled,
        }),
      )
      heapify(size, largest, phase)
    }
  }

  for (let root = Math.floor(array.length / 2) - 1; root >= 0; root -= 1) {
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'heap-build',
        flowNodeId: 'build',
        title: '最大ヒープを構築',
        description: `index ${root} を根とする部分木を最大ヒープにします。`,
        variables: [{ name: 'ヒープ化する根位置', value: root, index: root }],
      }),
    )
    heapify(array.length, root, 'heap-build')
  }

  for (let end = array.length - 1; end > 0; end -= 1) {
    steps.push(
      createStep(array, {
        kind: 'phase',
        phase: 'heap-extract',
        flowNodeId: 'extract',
        title: '最大値の抽出を開始',
        description: `根の最大値を未確定範囲の末尾index ${end} へ移します。`,
        variables: [
          { name: '最大値の位置', value: 0, index: 0 },
          { name: '確定候補位置', value: end, index: end },
        ],
        settledIndices: settled,
      }),
    )
    ;[array[0], array[end]] = [array[end], array[0]]
    steps.push(
      createStep(array, {
        kind: 'action',
        phase: 'heap-extract',
        flowNodeId: 'extract',
        title: '最大値を末尾へ移動',
        description: `最大値をindex ${end} へ移動しました。`,
        variables: [
          { name: '抽出元位置', value: 0, index: 0 },
          { name: '移動先位置', value: end, index: end },
        ],
        actionIndices: [0, end],
        settledIndices: settled,
      }),
    )
    settled.unshift(end)
    steps.push(
      createStep(array, {
        kind: 'settled',
        phase: 'heap-extract',
        flowNodeId: 'settle',
        title: '末尾位置を確定',
        description: `index ${end} の位置が確定しました。`,
        variables: [{ name: '確定した位置', value: end, index: end }],
        settledIndices: settled,
      }),
    )
    heapify(end, 0, 'heap-extract')
  }

  steps.push(createCompleteStep(array, 'position'))
  return steps
}

