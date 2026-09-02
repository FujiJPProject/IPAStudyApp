<script setup lang="ts">
import { computed } from 'vue'
import type { SortAlgorithmId, SortStep } from '../domain/sortLogic'
import { algorithmPresentations } from '../presentation'

const props = defineProps<{
  algorithm: SortAlgorithmId
  currentStep: SortStep | null
  currentArray: readonly number[]
  started: boolean
  completed: boolean
}>()

const presentation = computed(() => algorithmPresentations[props.algorithm])

const phaseLabel = computed(() => {
  const phase = props.currentStep?.phase
  if (phase === 'heap-build') return 'ヒープ構築フェーズ'
  if (phase === 'heap-extract') return '最大値抽出フェーズ'
  if (phase === 'gap-pass') return 'gap別の挿入フェーズ'
  if (phase === 'partition') return '分割・再帰フェーズ'
  if (phase === 'merge') return '再帰分割・結合フェーズ'
  if (phase === 'insert') return '挿入フェーズ'
  if (phase === 'scan') return '探索・比較フェーズ'
  if (phase === 'complete') return '完了'
  return '開始前'
})
</script>

<template>
  <section class="aside-section" aria-labelledby="sort-current-title">
    <p class="eyebrow">Current Step</p>
    <h3 id="sort-current-title">現在の処理と変数</h3>

    <div class="phase-badge">{{ phaseLabel }}</div>
    <div class="current-action" aria-live="polite">
      <template v-if="currentStep">
        <strong>{{ currentStep.title }}</strong>
        <p>{{ currentStep.description }}</p>
      </template>
      <template v-else-if="started">
        <strong>処理を開始しました</strong>
        <p>「1ステップ実行」または「自動再生」で最初の処理へ進んでください。</p>
      </template>
      <template v-else>
        <strong>まだ処理は始まっていません</strong>
        <p>基準配列とアルゴリズムを確認し、「処理を開始」を押してください。</p>
      </template>
    </div>

    <div class="variables-grid" aria-label="現在の変数">
      <div v-if="!currentStep?.variables.length" class="locked-block full-width">
        処理開始後に、役割が分かる日本語名で変数を表示します。
      </div>
      <div
        v-for="variable in currentStep?.variables ?? []"
        v-else
        :key="variable.name"
        class="variable-card"
      >
        <span class="variable-name">{{ variable.name }}</span>
        <strong class="variable-value mono">
          {{ variable.value }}<template v-if="variable.index !== undefined">（index {{ variable.index }}）</template>
        </strong>
      </div>
    </div>
  </section>

  <section class="aside-section" aria-labelledby="sort-result-title">
    <p class="eyebrow">Result</p>
    <h3 id="sort-result-title">最終結果</h3>
    <div v-if="completed" data-testid="final-result" class="result-block">
      <strong class="mono">[{{ currentArray.join(', ') }}]</strong>
      <p>{{ presentation.result }}</p>
    </div>
    <div v-else class="locked-block">処理完了後に最終結果を表示します。</div>
  </section>

  <section class="aside-section" aria-labelledby="sort-why-title">
    <p class="eyebrow">Why</p>
    <h3 id="sort-why-title">なぜそうなるのか</h3>
    <div v-if="completed" data-testid="why" class="result-block">{{ presentation.why }}</div>
    <div v-else class="locked-block">処理完了後に解説を表示します。</div>
  </section>

  <section class="aside-section" aria-labelledby="sort-insight-title">
    <p class="eyebrow">Insight</p>
    <h3 id="sort-insight-title">そこから何が分かるか</h3>
    <div v-if="completed" data-testid="insight" class="result-block">
      {{ presentation.insight }}
    </div>
    <div v-else class="locked-block">処理完了後に学習ポイントを表示します。</div>
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

.phase-badge {
  display: inline-flex;
  margin-bottom: 10px;
  border-radius: 999px;
  background: var(--sort-primary-soft);
  color: var(--sort-primary);
  padding: 4px 9px;
  font-size: 0.7rem;
  font-weight: 800;
}

.current-action {
  border-left: 4px solid var(--sort-primary);
  border-radius: 10px;
  background: var(--sort-primary-soft);
  padding: 13px;
}

.current-action strong {
  display: block;
  margin-bottom: 4px;
}

.current-action p {
  margin-bottom: 0;
  color: #35506f;
  font-size: 0.82rem;
}

.variables-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.variable-card {
  min-width: 0;
  border: 1px solid var(--sort-border);
  border-radius: 9px;
  background: var(--sort-surface-muted);
  padding: 8px 9px;
}

.variable-name {
  display: block;
  color: var(--sort-text-subtle);
  font-size: 0.67rem;
  font-weight: 700;
}

.variable-value {
  display: block;
  overflow-wrap: anywhere;
  font-size: 0.8rem;
}

.locked-block,
.result-block {
  border-radius: 11px;
  padding: 12px 13px;
  font-size: 0.82rem;
}

.locked-block {
  border: 1px dashed #d7dee9;
  background: var(--sort-surface-muted);
  color: var(--sort-text-subtle);
}

.locked-block.full-width {
  grid-column: 1 / -1;
}

.result-block {
  border: 1px solid #b9dfc8;
  background: #ecfdf3;
  color: #14532d;
}

.result-block p {
  margin: 5px 0 0;
  color: #166534;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

@media (max-width: 360px) {
  .variables-grid {
    grid-template-columns: 1fr;
  }
}
</style>
