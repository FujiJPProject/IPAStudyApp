import { describe, expect, it } from 'vitest'
import {
  algorithmOptions,
  algorithmPresentations,
} from '../../../src/materials/sort/presentation'

describe('sort presentation definitions', () => {
  it('provides result, why, insight, and a high-level flow for all seven algorithms', () => {
    expect(algorithmOptions).toHaveLength(7)

    for (const presentation of algorithmOptions) {
      expect(presentation.result.length).toBeGreaterThan(10)
      expect(presentation.why.length).toBeGreaterThan(10)
      expect(presentation.insight.length).toBeGreaterThan(10)
      expect(presentation.flow[0]).toMatchObject({ id: 'start', type: 'terminal' })
      expect(presentation.flow.at(-1)).toMatchObject({ id: 'end', type: 'terminal' })
      expect(presentation.flow.some((node) => node.type === 'decision')).toBe(true)
    }
  })

  it('shows quick and merge recursion as a process instead of a linear repeat', () => {
    expect(algorithmPresentations.quick.flow.find((node) => node.id === 'recurse')).toMatchObject({
      type: 'process',
      label: expect.stringContaining('再帰'),
    })
    expect(algorithmPresentations.merge.flow.find((node) => node.id === 'split')).toMatchObject({
      type: 'process',
      label: expect.stringContaining('再帰'),
    })
    expect(algorithmPresentations.quick.flow.some((node) => node.type === 'repeat')).toBe(false)
    expect(algorithmPresentations.merge.flow.some((node) => node.type === 'repeat')).toBe(false)
  })
})
