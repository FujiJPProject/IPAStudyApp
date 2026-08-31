import { describe, expect, it } from 'vitest'
import { findMaterialDefinition, materialDefinitions } from '../../src/materials/definitions'

describe('material definitions', () => {
  it('has unique material IDs and required metadata', () => {
    const ids = materialDefinitions.map(({ metadata }) => metadata.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(materialDefinitions).toHaveLength(1)

    for (const definition of materialDefinitions) {
      expect(definition.metadata.id).not.toBe('')
      expect(definition.metadata.name).not.toBe('')
      expect(definition.metadata.field).not.toBe('')
      expect(definition.metadata.summary).not.toBe('')
      expect(definition.component).toBeTruthy()
    }
  })

  it('finds the MVP material by ID', () => {
    expect(findMaterialDefinition('sort-visualizer')?.metadata.name).toBe('ソートアルゴリズム可視化')
    expect(findMaterialDefinition('unknown')).toBeUndefined()
  })
})
