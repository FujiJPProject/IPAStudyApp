import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SortExplanationPanel from '../../../src/materials/sort/components/SortExplanationPanel.vue'
import SortVisualizationPanel from '../../../src/materials/sort/components/SortVisualizationPanel.vue'
import {
  createSortTrace,
  type SortAlgorithmId,
} from '../../../src/materials/sort/domain/sortLogic'

describe('SortVisualizationPanel comparison operands', () => {
  it.each([
    {
      algorithm: 'insertion' as const,
      input: [3, 2, 1, 4, 5, 6, 7, 8, 9],
      stepNumber: 9,
      arrayBarValues: [2],
      externalOperands: [{ source: 'held', label: '保持している挿入値', value: 1 }],
    },
    {
      algorithm: 'shell' as const,
      input: [9, 8, 7, 6, 5, 4, 3, 2, 1],
      stepNumber: 16,
      arrayBarValues: [5],
      externalOperands: [{ source: 'held', label: '保持している挿入値', value: 1 }],
    },
    {
      algorithm: 'merge' as const,
      input: [5, 6, 1, 2, 7, 8, 3, 4, 9],
      stepNumber: 23,
      arrayBarValues: [],
      externalOperands: [
        { source: 'left-buffer', label: '左buffer候補', value: 5 },
        { source: 'right-buffer', label: '右buffer候補', value: 7 },
      ],
    },
  ])(
    '$algorithm Step $stepNumber connects faithful operands to orange bars and ARIA',
    ({ algorithm, input, stepNumber, arrayBarValues, externalOperands }) => {
      const trace = createSortTrace(input, algorithm satisfies SortAlgorithmId)
      const step = trace[stepNumber - 1]
      const wrapper = mount(SortVisualizationPanel, {
        props: {
          baseArray: input,
          currentArray: step.array,
          currentStep: step,
          settledLabel: '整列済み範囲',
          statusLabel: '実行中',
          completed: false,
          currentIndex: stepNumber,
          totalSteps: trace.length,
        },
      })

      const orangeArrayBars = wrapper.findAll('.bar.state-compare')
      expect(orangeArrayBars.map((bar) => Number(bar.get('.bar-value').text()))).toEqual(
        arrayBarValues,
      )
      expect(
        orangeArrayBars.map((bar) => bar.attributes('aria-label')),
      ).toEqual(arrayBarValues.map((value) => expect.stringContaining(`値 ${value}、状態 比較中`)))

      const externalCards = wrapper.findAll('.comparison-operand.external')
      expect(externalCards).toHaveLength(externalOperands.length)
      externalOperands.forEach((expectedOperand, index) => {
        const card = externalCards[index]
        expect(card.attributes('data-operand-source')).toBe(expectedOperand.source)
        expect(card.text()).toContain(expectedOperand.label)
        expect(card.get('.comparison-value').text()).toBe(String(expectedOperand.value))
        expect(card.attributes('aria-label')).toContain(
          `${expectedOperand.label}、値 ${expectedOperand.value}`,
        )
        expect(card.attributes('aria-label')).toContain('配列外')
        expect(card.attributes('aria-label')).toContain('状態 比較中')
      })

      expect(wrapper.findAll('[data-testid="compare-operand"]')).toHaveLength(2)

      const explanation = mount(SortExplanationPanel, {
        props: {
          algorithm,
          currentStep: step,
          currentArray: step.array,
          started: true,
          completed: false,
        },
      })
      expect(explanation.text()).toContain(step.description)
      for (const variable of step.variables) {
        expect(explanation.text()).toContain(variable.name)
      }
    },
  )
})
