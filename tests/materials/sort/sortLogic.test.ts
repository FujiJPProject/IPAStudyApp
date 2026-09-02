import { describe, expect, it } from 'vitest'
import { resolveBarState } from '../../../src/materials/sort/barState'
import { createRandomPermutation, shufflePermutation } from '../../../src/materials/sort/domain/random'
import {
  createSortTrace,
  type SettledMeaning,
  type SortAlgorithmId,
  type SortStep,
} from '../../../src/materials/sort/domain/sortLogic'

const algorithms: readonly SortAlgorithmId[] = [
  'bubble',
  'selection',
  'insertion',
  'quick',
  'merge',
  'heap',
  'shell',
]

const input = [7, 3, 9, 2, 6, 4, 8, 1, 5]
const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9]

describe('sort trace domain', () => {
  it.each(algorithms)('%s sorts ascending without changing its input', (algorithm) => {
    const source = [...input]
    const trace = createSortTrace(source, algorithm)

    expect(source).toEqual(input)
    expect(trace.length).toBeGreaterThan(0)
    expect(trace.at(-1)?.array).toEqual(sorted)
    expect(trace.at(-1)?.complete).toBe(true)
    expect(trace.at(-1)?.flowNodeId).toBe('end')
    expect(trace.at(-1)?.settledIndices).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8])
  })

  it.each(algorithms)('%s separates comparisons from array-changing actions', (algorithm) => {
    const trace = createSortTrace(input, algorithm)
    const comparisons = trace.filter((step) => step.kind === 'compare')
    const actions = trace.filter((step) => step.kind === 'action')

    expect(comparisons.length).toBeGreaterThan(0)
    expect(actions.length).toBeGreaterThan(0)
    expect(comparisons.every((step) => step.actionIndices.length === 0)).toBe(true)
    expect(actions.every((step) => step.compareIndices.length === 0)).toBe(true)
    expect(
      trace.every(
        (step) => step.title.length > 0 && step.description.length > 0 && step.flowNodeId.length > 0,
      ),
    ).toBe(true)
  })

  it.each(algorithms)('%s keeps comparison metadata faithful to each snapshot', (algorithm) => {
    const comparisons = createSortTrace(input, algorithm).filter((step) => step.kind === 'compare')

    for (const step of comparisons) {
      const arrayOperands = step.compareOperands.filter((operand) => operand.source === 'array')
      const externalOperands = step.compareOperands.filter((operand) => operand.source !== 'array')

      expect(step.compareOperands).toHaveLength(2)
      expect(step.compareIndices).toEqual(arrayOperands.map((operand) => operand.index))
      expect(arrayOperands.map((operand) => step.array[operand.index])).toEqual(
        arrayOperands.map((operand) => operand.value),
      )
      expect(externalOperands.every((operand) => !('index' in operand))).toBe(true)
    }
  })

  it.each([
    ['bubble', 'position'],
    ['selection', 'position'],
    ['insertion', 'range'],
    ['quick', 'position'],
    ['merge', 'range'],
    ['heap', 'position'],
    ['shell', 'range'],
  ] as const)('%s distinguishes the intended settled meaning', (algorithm, meaning) => {
    const trace = createSortTrace(input, algorithm)
    expect(trace.at(-1)?.settledMeaning).toBe(meaning satisfies SettledMeaning)
  })

  it('identifies heap construction and maximum extraction as different phases', () => {
    const trace = createSortTrace(input, 'heap')
    const buildSteps = trace.filter((step) => step.phase === 'heap-build')
    const extractSteps = trace.filter((step) => step.phase === 'heap-extract')

    expect(buildSteps.length).toBeGreaterThan(0)
    expect(extractSteps.length).toBeGreaterThan(0)
    expect(buildSteps.some((step) => step.kind === 'phase' && step.flowNodeId === 'build')).toBe(true)
    expect(extractSteps.some((step) => step.kind === 'phase' && step.flowNodeId === 'extract')).toBe(
      true,
    )
  })

  it('uses shell gaps 4, 2, 1 for a nine-value array', () => {
    const gapSteps = createSortTrace(input, 'shell').filter(
      (step) => step.kind === 'phase' && step.flowNodeId === 'gap',
    )
    const gaps = gapSteps.map(
      (step) => step.variables.find((variable) => variable.name === 'gap')?.value,
    )

    expect(gaps).toEqual([4, 2, 1])
  })

  it('keeps snapshots independent from later trace changes', () => {
    const trace = createSortTrace(input, 'bubble')
    const firstSnapshot = [...trace[0].array]

    expect(trace.at(-1)?.array).toEqual(sorted)
    expect(trace[0].array).toEqual(firstSnapshot)
    expect(trace[0].array).not.toBe(trace.at(-1)?.array)
  })

  it('resolves overlapping bar states with action, compare, settled, normal priority', () => {
    const baseStep = createSortTrace(input, 'bubble')[0]
    const overlappingStep: SortStep = {
      ...baseStep,
      actionIndices: [0],
      compareOperands: [
        { source: 'array', label: '左の値', value: input[0], index: 0 },
        { source: 'array', label: '右の値', value: input[1], index: 1 },
      ],
      compareIndices: [0, 1],
      settledIndices: [0, 1, 2],
    }

    expect(resolveBarState(0, overlappingStep)).toBe('action')
    expect(resolveBarState(1, overlappingStep)).toBe('compare')
    expect(resolveBarState(2, overlappingStep)).toBe('settled')
    expect(resolveBarState(3, overlappingStep)).toBe('normal')
  })

  it.each([
    {
      algorithm: 'insertion' as const,
      input: [3, 2, 1, 4, 5, 6, 7, 8, 9],
      stepNumber: 9,
      snapshot: [2, 3, 3, 4, 5, 6, 7, 8, 9],
      compareIndices: [0],
      operands: [
        { source: 'array', value: 2, index: 0 },
        { source: 'held', value: 1 },
      ],
      variableNames: ['比較位置', '書き込み候補位置', '保持している挿入値'],
    },
    {
      algorithm: 'shell' as const,
      input: [9, 8, 7, 6, 5, 4, 3, 2, 1],
      stepNumber: 16,
      snapshot: [5, 4, 3, 2, 9, 8, 7, 6, 9],
      compareIndices: [0],
      operands: [
        { source: 'array', value: 5, index: 0 },
        { source: 'held', value: 1 },
      ],
      variableNames: ['gap', '比較位置', '挿入対象位置', '保持している挿入値'],
    },
    {
      algorithm: 'merge' as const,
      input: [5, 6, 1, 2, 7, 8, 3, 4, 9],
      stepNumber: 23,
      snapshot: [1, 2, 6, 2, 7, 8, 3, 4, 9],
      compareIndices: [],
      operands: [
        { source: 'left-buffer', value: 5 },
        { source: 'right-buffer', value: 7 },
      ],
      variableNames: [
        '左buffer候補',
        '左buffer内位置',
        '右buffer候補',
        '右buffer内位置',
        '書き込み位置',
      ],
    },
  ])(
    '$algorithm Step $stepNumber keeps array and external comparison operands faithful',
    ({ algorithm, input: caseInput, stepNumber, snapshot, compareIndices, operands, variableNames }) => {
      const step = createSortTrace(caseInput, algorithm)[stepNumber - 1]

      expect(step.kind).toBe('compare')
      expect(step.array).toEqual(snapshot)
      expect(step.compareIndices).toEqual(compareIndices)
      expect(step.compareOperands).toMatchObject(operands)
      expect(step.compareOperands.map((operand) => operand.value)).toEqual(
        operands.map((operand) => operand.value),
      )
      expect(step.variables.map((variable) => variable.name)).toEqual(variableNames)
      expect(
        step.compareOperands
          .filter((operand) => operand.source === 'array')
          .map((operand) => step.array[operand.index]),
      ).toEqual(
        step.compareOperands
          .filter((operand) => operand.source === 'array')
          .map((operand) => operand.value),
      )
      expect(
        step.compareOperands
          .filter((operand) => operand.source !== 'array')
          .every((operand) => !('index' in operand)),
      ).toBe(true)
    },
  )
})

describe('sort permutation domain', () => {
  it('creates a deterministic 1 to 9 permutation when a random source is injected', () => {
    const first = createRandomPermutation(() => 0.25)
    const second = createRandomPermutation(() => 0.25)

    expect(first).toEqual(second)
    expect([...first].sort((left, right) => left - right)).toEqual(sorted)
    expect(first).toHaveLength(9)
  })

  it('shuffles to a different order even when the random source produces no swaps', () => {
    const current = [...sorted]
    const next = shufflePermutation(current, () => 0.999999)

    expect(current).toEqual(sorted)
    expect(next).not.toEqual(current)
    expect([...next].sort((left, right) => left - right)).toEqual(sorted)
  })
})
