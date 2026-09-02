<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import SortControls from './components/SortControls.vue'
import SortExplanationPanel from './components/SortExplanationPanel.vue'
import SortFlowchart from './components/SortFlowchart.vue'
import SortVisualizationPanel from './components/SortVisualizationPanel.vue'
import { createRandomPermutation, shufflePermutation } from './domain/random'
import {
  createSortTrace,
  type SortAlgorithmId,
  type SortTrace,
} from './domain/sortLogic'
import { algorithmPresentations } from './presentation'

const baseArray = ref(createRandomPermutation())
const algorithm = ref<SortAlgorithmId>('bubble')
const trace = ref<SortTrace>(createSortTrace(baseArray.value, algorithm.value))
const currentIndex = ref(0)
const started = ref(false)
const playing = ref(false)
const paused = ref(false)
const speed = ref(600)

let timerId: number | null = null

const currentStep = computed(() =>
  currentIndex.value > 0 ? (trace.value[currentIndex.value - 1] ?? null) : null,
)
const currentArray = computed(() => currentStep.value?.array ?? baseArray.value)
const completed = computed(() => currentStep.value?.complete ?? false)
const presentation = computed(() => algorithmPresentations[algorithm.value])
const statusLabel = computed(() => {
  if (completed.value) return '完了'
  if (paused.value) return '一時停止'
  if (started.value) return '実行中'
  return '開始前'
})
const activeFlowNodeId = computed(() => currentStep.value?.flowNodeId ?? 'start')

function clearTimer(): void {
  if (timerId !== null) window.clearInterval(timerId)
  timerId = null
  playing.value = false
}

function stopAutoPlay(markPaused = false): void {
  clearTimer()
  paused.value = markPaused && started.value && !completed.value
}

function startTimer(): void {
  clearTimer()
  playing.value = true
  paused.value = false
  timerId = window.setInterval(() => executeStep(false), speed.value)
}

function rebuildTrace(): void {
  trace.value = createSortTrace(baseArray.value, algorithm.value)
  currentIndex.value = 0
  started.value = false
  paused.value = false
}

function resetRun(): void {
  stopAutoPlay()
  rebuildTrace()
}

function startRun(): void {
  if (started.value) return
  started.value = true
  paused.value = false
}

function executeStep(manual = true): void {
  if (!started.value || completed.value) return
  if (manual) paused.value = false

  if (currentIndex.value < trace.value.length) currentIndex.value += 1

  if (completed.value || currentIndex.value >= trace.value.length) stopAutoPlay()
}

function toggleAutoPlay(): void {
  if (playing.value) {
    stopAutoPlay(true)
    return
  }
  if (!started.value || completed.value) return
  startTimer()
}

function changeAlgorithm(nextAlgorithm: SortAlgorithmId): void {
  stopAutoPlay()
  algorithm.value = nextAlgorithm
  rebuildTrace()
}

function restart(): void {
  resetRun()
}

function shuffle(): void {
  stopAutoPlay()
  baseArray.value = shufflePermutation(baseArray.value)
  rebuildTrace()
}

function changeSpeed(nextSpeed: number): void {
  speed.value = Math.min(1200, Math.max(100, Math.round(nextSpeed / 50) * 50))
  if (playing.value) startTimer()
}

onUnmounted(() => stopAutoPlay())
</script>

<template>
  <article class="sort-material">
    <section class="overview" aria-labelledby="sort-overview-title">
      <div>
        <p class="eyebrow">Overview</p>
        <h2 id="sort-overview-title">7種類の違いを、同じ配列で見比べる</h2>
      </div>
      <p>
        基準配列は教材を開いたときに1〜9からランダム生成されます。比較と変更を別々のStepで確認し、
        最後にアルゴリズムごとの理由と学習ポイントを振り返ります。
      </p>
    </section>

    <div class="learning-shell">
      <div class="main-column">
        <SortVisualizationPanel
          :base-array="baseArray"
          :current-array="currentArray"
          :current-step="currentStep"
          :settled-label="presentation.settledLabel"
          :status-label="statusLabel"
          :completed="completed"
          :current-index="currentIndex"
          :total-steps="trace.length"
        />
        <SortControls
          :algorithm="algorithm"
          :started="started"
          :completed="completed"
          :playing="playing"
          :speed="speed"
          @algorithm-change="changeAlgorithm"
          @start="startRun"
          @step="executeStep(true)"
          @toggle-play="toggleAutoPlay"
          @restart="restart"
          @shuffle="shuffle"
          @speed-change="changeSpeed"
        />
      </div>

      <aside class="aside-panel" aria-label="現在の処理、フローチャート、完了解説">
        <SortExplanationPanel
          :algorithm="algorithm"
          :current-step="currentStep"
          :current-array="currentArray"
          :started="started"
          :completed="completed"
        />
        <SortFlowchart :algorithm="algorithm" :active-node-id="activeFlowNodeId" />
      </aside>
    </div>
  </article>
</template>

<style scoped>
.sort-material {
  --sort-text: #172033;
  --sort-text-subtle: #58657a;
  --sort-border: #dfe5ee;
  --sort-surface: #fff;
  --sort-surface-muted: #f8fafc;
  --sort-primary: #2458d3;
  --sort-primary-soft: #edf3ff;
  --sort-normal: #94a3b8;
  --sort-compare: #f59e0b;
  --sort-action: #dc2626;
  --sort-settled: #15803d;
  --sort-shadow: 0 7px 20px rgb(23 32 51 / 5%);
  --sort-radius: 16px;

  min-width: 0;
  color: var(--sort-text);
}

.overview {
  display: grid;
  grid-template-columns: minmax(260px, 0.65fr) minmax(0, 1fr);
  align-items: start;
  gap: 20px;
  margin-bottom: 20px;
  border: 1px solid var(--sort-border);
  border-radius: var(--sort-radius);
  background: linear-gradient(145deg, #fff 0%, #f7faff 100%);
  padding: 20px;
}

.overview h2,
.overview p {
  margin-bottom: 0;
}

.learning-shell {
  display: grid;
  min-width: 0;
  grid-template-columns: minmax(0, 1.45fr) minmax(290px, 0.75fr);
  align-items: start;
  gap: 20px;
}

.main-column {
  min-width: 0;
}

.aside-panel {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--sort-border);
  border-radius: var(--sort-radius);
  background: var(--sort-surface);
  box-shadow: var(--sort-shadow);
}

@media (max-width: 900px) {
  .learning-shell {
    grid-template-columns: 1fr;
  }

  .overview {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .overview {
    padding: 16px;
  }
}
</style>
