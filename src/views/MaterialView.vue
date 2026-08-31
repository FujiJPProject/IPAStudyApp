<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { findMaterialDefinition } from '../materials/definitions'

const route = useRoute()

const materialId = computed(() => {
  const value = route.params.materialId
  return Array.isArray(value) ? value[0] : value
})

const definition = computed(() => findMaterialDefinition(materialId.value ?? ''))
</script>

<template>
  <div class="page">
    <template v-if="definition">
      <div class="page-title-row">
        <div>
          <p class="eyebrow">Visualization Material</p>
          <span class="tag">{{ definition.metadata.field }}</span>
          <h1 class="material-title">{{ definition.metadata.name }}</h1>
          <p>{{ definition.metadata.summary }}</p>
        </div>
        <RouterLink class="back-link" to="/materials">← 学習一覧へ戻る</RouterLink>
      </div>

      <component :is="definition.component" />
    </template>

    <section v-else class="empty-state" aria-labelledby="missing-material-title">
      <h1 id="missing-material-title">教材が見つかりません</h1>
      <p>指定された教材IDに一致する教材は登録されていません。</p>
      <RouterLink class="button button-primary" to="/materials">学習一覧へ戻る</RouterLink>
    </section>
  </div>
</template>
