<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { findMaterialDefinition } from '../materials/definitions'
import { getLearningHistory } from '../services/historyService'

const historyItems = computed(() =>
  getLearningHistory().flatMap((entry) => {
    const definition = findMaterialDefinition(entry.materialId)
    return definition ? [{ entry, definition }] : []
  }),
)

function formatLastOpenedAt(value: string): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
</script>

<template>
  <div class="page">
    <div class="page-title-row">
      <div>
        <p class="eyebrow">Learning History</p>
        <h1>学習履歴</h1>
        <p>このブラウザ・端末で最近開いた教材を確認できます。</p>
      </div>
      <RouterLink class="back-link" to="/">← HOMEへ戻る</RouterLink>
    </div>

    <section v-if="historyItems.length === 0" class="empty-state" aria-labelledby="empty-history-title">
      <h2 id="empty-history-title">まだ学習履歴はありません</h2>
      <p>教材を開くと、この端末内に最後に開いた日時が記録されます。</p>
      <RouterLink class="button button-primary" to="/materials">学習一覧へ</RouterLink>
    </section>

    <section v-else class="history-list" aria-label="学習履歴一覧">
      <article v-for="item in historyItems" :key="item.entry.materialId" class="history-item">
        <div>
          <span class="tag">{{ item.definition.metadata.field }}</span>
          <h2>{{ item.definition.metadata.name }}</h2>
          <p class="history-time">最後に開いた日時：{{ formatLastOpenedAt(item.entry.lastOpenedAt) }}</p>
        </div>
        <RouterLink class="button button-primary" :to="`/materials/${item.entry.materialId}`">
          もう一度開く
        </RouterLink>
      </article>
    </section>
  </div>
</template>
