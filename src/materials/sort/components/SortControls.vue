<script setup lang="ts">
import type { SortAlgorithmId } from '../domain/sortLogic'
import { algorithmOptions, isSortAlgorithmId } from '../presentation'

defineProps<{
  algorithm: SortAlgorithmId
  started: boolean
  completed: boolean
  playing: boolean
  speed: number
}>()

const emit = defineEmits<{
  algorithmChange: [algorithm: SortAlgorithmId]
  start: []
  step: []
  togglePlay: []
  restart: []
  shuffle: []
  speedChange: [speed: number]
}>()

function onAlgorithmChange(event: Event): void {
  const value = (event.target as HTMLSelectElement).value
  if (isSortAlgorithmId(value)) emit('algorithmChange', value)
}

function onSpeedChange(event: Event): void {
  emit('speedChange', Number((event.target as HTMLInputElement).value))
}
</script>

<template>
  <div class="sort-controls" aria-label="教材操作">
    <label class="algorithm-control">
      <span>アルゴリズム選択</span>
      <select
        data-testid="algorithm-select"
        :value="algorithm"
        aria-label="ソートアルゴリズム"
        @change="onAlgorithmChange"
      >
        <option v-for="option in algorithmOptions" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
    </label>

    <div class="control-buttons">
      <button
        type="button"
        class="sort-button primary"
        :disabled="started"
        @click="emit('start')"
      >
        処理を開始
      </button>
      <button
        type="button"
        class="sort-button primary"
        :disabled="!started || completed"
        @click="emit('step')"
      >
        1ステップ実行
      </button>
      <button
        type="button"
        class="sort-button secondary"
        :disabled="!started || completed"
        :aria-pressed="playing"
        @click="emit('togglePlay')"
      >
        {{ playing ? 'Ⅱ 一時停止' : '▶ 自動再生' }}
      </button>
      <button type="button" class="sort-button secondary" @click="emit('restart')">
        最初から
      </button>
      <button type="button" class="sort-button secondary" @click="emit('shuffle')">
        シャッフル
      </button>
    </div>

    <label class="speed-control">
      <span class="speed-label">
        <span>再生速度</span>
        <output class="mono" :value="speed">{{ speed }} ms</output>
      </span>
      <input
        data-testid="speed-range"
        type="range"
        min="100"
        max="1200"
        step="50"
        :value="speed"
        aria-label="自動再生速度"
        @input="onSpeedChange"
      />
    </label>
  </div>
</template>

<style scoped>
.sort-controls {
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  margin-top: 18px;
  border: 1px solid var(--sort-border);
  border-radius: 14px;
  background: var(--sort-surface-muted);
  padding: 12px;
}

.algorithm-control,
.speed-control {
  display: grid;
  min-width: 0;
  gap: 5px;
  color: var(--sort-text-subtle);
  font-size: 0.75rem;
  font-weight: 800;
}

.algorithm-control {
  flex: 1 1 220px;
}

.algorithm-control select {
  width: 100%;
  min-height: 46px;
  min-width: 0;
  border: 1px solid var(--sort-border);
  border-radius: 10px;
  background: var(--sort-surface);
  color: var(--sort-text);
  padding: 8px 11px;
  font: inherit;
  font-size: 0.9rem;
}

.control-buttons {
  display: flex;
  min-width: 0;
  flex: 2 1 480px;
  flex-wrap: wrap;
  gap: 8px;
}

.sort-button {
  min-height: 46px;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 9px 14px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.sort-button.primary {
  background: var(--sort-primary);
  color: #fff;
}

.sort-button.secondary {
  border-color: var(--sort-border);
  background: var(--sort-surface);
  color: var(--sort-text);
}

.sort-button:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.sort-button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid rgb(36 88 211 / 25%);
  outline-offset: 2px;
}

.speed-control {
  flex: 1 1 210px;
}

.speed-label {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.speed-control input {
  width: 100%;
  min-height: 40px;
  margin: 0;
  accent-color: var(--sort-primary);
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

@media (max-width: 620px) {
  .control-buttons,
  .algorithm-control,
  .speed-control {
    flex-basis: 100%;
  }

  .sort-button {
    flex: 1 1 calc(50% - 8px);
  }
}

@media (max-width: 360px) {
  .sort-button {
    flex-basis: 100%;
    width: 100%;
  }
}
</style>

