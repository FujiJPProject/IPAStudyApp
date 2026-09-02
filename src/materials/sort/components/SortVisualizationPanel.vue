<script setup lang="ts">
import { computed } from 'vue'
import type { SortCompareOperand, SortStep } from '../domain/sortLogic'
import { getBarStateLabel, resolveBarState, type BarState } from '../barState'

const props = defineProps<{
  baseArray: readonly number[]
  currentArray: readonly number[]
  currentStep: SortStep | null
  settledLabel: string
  statusLabel: string
  completed: boolean
  currentIndex: number
  totalSteps: number
}>()

const markers = computed(() => {
  const result = new Map<number, string[]>()
  for (const variable of props.currentStep?.variables ?? []) {
    if (variable.index === undefined) continue
    const labels = result.get(variable.index) ?? []
    labels.push(variable.name)
    result.set(variable.index, labels)
  }
  return result
})

const positionVariables = computed(
  () => props.currentStep?.variables.filter((variable) => variable.index !== undefined) ?? [],
)

const compareOperands = computed(() => props.currentStep?.compareOperands ?? [])

function operandLocationLabel(operand: SortCompareOperand): string {
  if (operand.source === 'array') return `配列 index ${operand.index} のバー`
  if (operand.source === 'held') return '配列外に保持している値'
  if (operand.source === 'left-buffer') return '配列外の左buffer内の値'
  return '配列外の右buffer内の値'
}

function stateFor(index: number): BarState {
  return resolveBarState(index, props.currentStep)
}

function stateLabel(index: number): string {
  return getBarStateLabel(stateFor(index), props.settledLabel)
}

function stateShortLabel(index: number): string {
  const state = stateFor(index)
  if (state === 'action') return '変更'
  if (state === 'compare') return '比較'
  if (state === 'settled') return props.currentStep?.settledMeaning === 'range' ? '整列' : '確定'
  return '通常'
}

function heightFor(value: number): string {
  return `${Math.max(20, Math.round((value / 9) * 82))}%`
}
</script>

<template>
  <section class="visual-panel" aria-labelledby="sort-visual-title">
    <header class="panel-head">
      <div>
        <h2 id="sort-visual-title">状態変化の可視化</h2>
        <p>同じ基準配列を使い、選択した処理を1ステップずつ確認します。</p>
      </div>
      <span
        class="status-badge"
        :class="{ running: statusLabel === '実行中', done: completed }"
        aria-live="polite"
      >
        {{ statusLabel }}
      </span>
    </header>

    <div class="visual-body">
      <div class="condition-item">
        <span class="condition-label">今回の基準配列（表示時にランダム生成）</span>
        <strong data-testid="base-array" class="condition-value mono">
          [{{ baseArray.join(', ') }}]
        </strong>
      </div>

      <div class="legend" aria-label="バー状態の意味。色と文字の両方で示しています">
        <span><i class="legend-dot normal" aria-hidden="true"></i>通常（灰）</span>
        <span><i class="legend-dot compare" aria-hidden="true"></i>比較中（橙）</span>
        <span><i class="legend-dot action" aria-hidden="true"></i>交換・移動・書き込み（赤）</span>
        <span><i class="legend-dot settled" aria-hidden="true"></i>{{ settledLabel }}（緑）</span>
      </div>

      <div class="bar-variable-box">
        <span class="condition-label">バーに関係する現在の変数</span>
        <div class="bar-variable-list" aria-live="polite">
          <span v-if="positionVariables.length === 0" class="bar-variable-chip muted">
            このStepでバー位置を指す変数はありません。
          </span>
          <span
            v-for="variable in positionVariables"
            v-else
            :key="`${variable.name}-${variable.index}`"
            class="bar-variable-chip"
          >
            {{ variable.name }} = index {{ variable.index }}
          </span>
        </div>
      </div>

      <div
        v-if="compareOperands.length > 0"
        class="comparison-box"
        aria-label="現在の比較対象。橙色と文字の両方で示しています"
      >
        <span class="condition-label">現在の比較対象（橙）</span>
        <div class="comparison-list" role="list">
          <div
            v-for="(operand, operandIndex) in compareOperands"
            :key="`${operand.source}-${operand.label}-${operandIndex}`"
            class="comparison-operand"
            :class="{ external: operand.source !== 'array' }"
            role="listitem"
            data-testid="compare-operand"
            :data-operand-source="operand.source"
            :aria-label="`${operand.label}、値 ${operand.value}、${operandLocationLabel(operand)}、状態 比較中`"
          >
            <span class="comparison-label">{{ operand.label }}</span>
            <strong class="comparison-value mono">{{ operand.value }}</strong>
            <span class="comparison-location">{{ operandLocationLabel(operand) }}</span>
          </div>
        </div>
      </div>

      <div
        class="bars-wrap"
        role="list"
        aria-label="配列の状態を表す棒グラフ。indexは0始まりです"
      >
        <div
          v-for="(value, index) in currentArray"
          :key="index"
          class="bar-column"
          role="listitem"
        >
          <div class="bar-marker" aria-hidden="true">
            {{ markers.get(index)?.join(' / ') ?? '' }}
          </div>
          <div
            class="bar"
            :class="`state-${stateFor(index)}`"
            :style="{ height: heightFor(value) }"
            :aria-label="`index ${index}、値 ${value}、状態 ${stateLabel(index)}`"
          >
            <strong class="bar-value">{{ value }}</strong>
            <span class="bar-state">{{ stateShortLabel(index) }}</span>
          </div>
          <span class="bar-index">index {{ index }}</span>
        </div>
      </div>

      <div class="array-row">
        <output class="array-view mono" aria-label="現在の配列">
          [{{ currentArray.join(', ') }}]
        </output>
        <strong data-testid="step-progress" class="step-progress">
          Step {{ currentIndex }} / {{ totalSteps }}
        </strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visual-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--sort-border);
  border-radius: var(--sort-radius);
  background: var(--sort-surface);
  box-shadow: var(--sort-shadow);
}

.panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--sort-border);
  padding: 18px 20px;
}

.panel-head h2 {
  margin-bottom: 2px;
}

.panel-head p {
  margin-bottom: 0;
  font-size: 0.875rem;
}

.status-badge {
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--sort-surface-muted);
  color: var(--sort-text-subtle);
  padding: 6px 10px;
  font-size: 0.75rem;
  font-weight: 800;
}

.status-badge.running {
  background: #fff7e8;
  color: #9a4e00;
}

.status-badge.done {
  background: #ecfdf3;
  color: #166534;
}

.visual-body {
  min-width: 0;
  padding: 20px;
}

.condition-item,
.bar-variable-box,
.comparison-box {
  border: 1px solid var(--sort-border);
  border-radius: 12px;
  background: var(--sort-surface-muted);
  padding: 12px 14px;
}

.condition-label {
  display: block;
  color: var(--sort-text-subtle);
  font-size: 0.75rem;
  font-weight: 800;
}

.condition-value {
  display: block;
  margin-top: 3px;
  overflow-wrap: anywhere;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 9px 14px;
  margin: 14px 0;
  color: var(--sort-text-subtle);
  font-size: 0.75rem;
  font-weight: 700;
}

.legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-dot.normal,
.bar.state-normal {
  background: var(--sort-normal);
}

.legend-dot.compare,
.bar.state-compare {
  background: var(--sort-compare);
}

.legend-dot.action,
.bar.state-action {
  background: var(--sort-action);
}

.legend-dot.settled,
.bar.state-settled {
  background: var(--sort-settled);
}

.bar-variable-box {
  margin-bottom: 12px;
}

.comparison-box {
  margin-bottom: 12px;
  border-color: #f5b942;
  background: #fffaf0;
}

.comparison-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 7px;
}

.comparison-operand {
  display: grid;
  min-width: 132px;
  flex: 1 1 0;
  grid-template-columns: 1fr auto;
  gap: 2px 10px;
  border: 2px solid #b45309;
  border-radius: 9px;
  background: var(--sort-compare);
  padding: 7px 9px;
  color: #111827;
}

.comparison-operand.external {
  border-style: dashed;
}

.comparison-label,
.comparison-location {
  font-size: 0.68rem;
  font-weight: 800;
}

.comparison-value {
  grid-row: 1 / span 2;
  grid-column: 2;
  align-self: center;
  font-size: 1rem;
}

.comparison-location {
  color: #5f3705;
}

.bar-variable-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 7px;
}

.bar-variable-chip {
  border: 1px solid var(--sort-border);
  border-radius: 8px;
  background: var(--sort-surface);
  padding: 4px 8px;
  color: var(--sort-text);
  font-size: 0.7rem;
  font-weight: 700;
}

.bar-variable-chip.muted {
  color: var(--sort-text-subtle);
}

.bars-wrap {
  display: flex;
  width: 100%;
  min-width: 0;
  height: 320px;
  align-items: flex-end;
  gap: 8px;
  overflow: hidden;
  border: 1px solid var(--sort-border);
  border-radius: 14px;
  background: linear-gradient(to top, #f8fafc 0%, #fff 100%);
  padding: 12px 9px 8px;
}

.bar-column {
  display: flex;
  min-width: 0;
  height: 100%;
  flex: 1 1 0;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
}

.bar-marker {
  display: flex;
  min-height: 38px;
  align-items: flex-end;
  justify-content: center;
  overflow-wrap: anywhere;
  color: var(--sort-text-subtle);
  font-size: 0.58rem;
  line-height: 1.15;
  text-align: center;
}

.bar {
  display: flex;
  min-height: 48px;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 9px 9px 3px 3px;
  padding: 6px 2px 4px;
  color: #111827;
  transition: height 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.bar.state-compare,
.bar.state-action {
  transform: translateY(-3px);
}

.bar.state-action,
.bar.state-settled {
  color: #fff;
}

.bar-value {
  font-size: 0.88rem;
}

.bar-state {
  max-width: 100%;
  font-size: 0.58rem;
  font-weight: 900;
  line-height: 1;
}

.bar-index {
  color: var(--sort-text-subtle);
  font-size: 0.61rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.array-row {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 12px;
}

.array-view {
  min-width: 0;
  overflow-wrap: anywhere;
  border-radius: 9px;
  background: #111827;
  color: #f9fafb;
  padding: 9px 11px;
  font-size: 0.82rem;
}

.step-progress {
  flex: 0 0 auto;
  color: var(--sort-text-subtle);
  font-size: 0.8rem;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 620px) {
  .panel-head,
  .visual-body {
    padding-left: 15px;
    padding-right: 15px;
  }

  .bars-wrap {
    height: 270px;
    gap: 5px;
    padding-inline: 6px;
  }

  .bar-marker {
    min-height: 34px;
    font-size: 0.5rem;
  }

  .bar-state {
    font-size: 0.5rem;
  }

  .array-row {
    align-items: stretch;
    flex-direction: column;
  }

  .step-progress {
    align-self: flex-end;
  }
}

@media (max-width: 360px) {
  .bars-wrap {
    height: 250px;
    gap: 3px;
    padding-inline: 4px;
  }

  .bar-index {
    font-size: 0.52rem;
  }

  .bar-value {
    font-size: 0.75rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bar {
    transition: none;
  }
}
</style>
