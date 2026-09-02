import type { MaterialDefinition } from './types'
import SortMaterial from './sort/SortMaterial.vue'

export const materialDefinitions: readonly MaterialDefinition[] = [
  {
    metadata: {
      id: 'sort-visualizer',
      name: 'ソートアルゴリズム可視化',
      field: 'アルゴリズム',
      summary: '7種類のソートについて、比較、交換・移動・書き込みから整列までをステップ単位で確認します。',
    },
    component: SortMaterial,
  },
]

export function findMaterialDefinition(materialId: string): MaterialDefinition | undefined {
  return materialDefinitions.find(({ metadata }) => metadata.id === materialId)
}
