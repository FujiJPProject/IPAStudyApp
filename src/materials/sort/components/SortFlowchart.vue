<script setup lang="ts">
import { computed } from 'vue'
import type { SortAlgorithmId } from '../domain/sortLogic'
import { algorithmPresentations } from '../presentation'

const props = defineProps<{
  algorithm: SortAlgorithmId
  activeNodeId: string
}>()

const presentation = computed(() => algorithmPresentations[props.algorithm])
</script>

<template>
  <section class="aside-section" aria-labelledby="sort-flow-title">
    <p class="eyebrow">Flowchart</p>
    <h3 id="sort-flow-title">高水準フローチャート</h3>
    <p class="flow-description">
      現在位置を強調します。再帰は処理として明示し、直線的な反復として表しません。
    </p>
    <div class="flow-legend" aria-label="フローチャート図形の意味">
      <span>端子：開始・終了</span>
      <span>◇：条件分岐</span>
      <span>反復形：実際の反復</span>
      <span>▭：処理</span>
    </div>
    <ol class="flow-list" aria-live="polite">
      <li v-for="(node, index) in presentation.flow" :key="node.id" class="flow-item">
        <div
          class="flow-shape"
          :class="[node.type, { active: node.id === activeNodeId }]"
          :aria-current="node.id === activeNodeId ? 'step' : undefined"
        >
          {{ node.label }}
        </div>
        <span v-if="index < presentation.flow.length - 1" class="flow-arrow" aria-hidden="true">
          ↓
        </span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.aside-section {
  padding: 18px 20px;
}

.aside-section + .aside-section {
  border-top: 1px solid var(--sort-border);
}

.eyebrow {
  margin-bottom: 4px;
}

.flow-description {
  margin-bottom: 10px;
  font-size: 0.82rem;
}

.flow-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  color: var(--sort-text-subtle);
  font-size: 0.68rem;
  font-weight: 700;
}

.flow-list {
  display: grid;
  justify-items: center;
  gap: 0;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.flow-item {
  display: grid;
  width: 100%;
  justify-items: center;
}

.flow-shape {
  display: grid;
  width: min(100%, 270px);
  min-height: 48px;
  place-items: center;
  border: 2px solid var(--sort-border);
  background: var(--sort-surface-muted);
  padding: 8px 16px;
  font-size: 0.74rem;
  font-weight: 800;
  line-height: 1.35;
  text-align: center;
}

.flow-shape.process {
  border-radius: 8px;
}

.flow-shape.terminal {
  border-radius: 999px;
}

.flow-shape.decision {
  min-height: 70px;
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  padding-inline: 46px;
}

.flow-shape.repeat {
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0 100%);
}

.flow-shape.active {
  border-color: var(--sort-primary);
  background: var(--sort-primary-soft);
  color: var(--sort-primary);
  box-shadow: 0 0 0 3px rgb(36 88 211 / 12%);
}

.flow-arrow {
  color: var(--sort-text-subtle);
  line-height: 1.2;
}
</style>

