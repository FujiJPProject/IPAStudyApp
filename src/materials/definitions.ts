import type { MaterialDefinition } from './types'
import SortMaterial from './sort/SortMaterial.vue'

export const materialDefinitions: readonly MaterialDefinition[] = [
  {
    metadata: {
      id: 'sort-visualizer',
      name: 'ソートアルゴリズム可視化',
      field: 'アルゴリズム',
      summary: '配列の比較と交換をステップ単位で確認し、整列までの流れを理解します。',
    },
    component: SortMaterial,
  },
]

export function findMaterialDefinition(materialId: string): MaterialDefinition | undefined {
  return materialDefinitions.find(({ metadata }) => metadata.id === materialId)
}
