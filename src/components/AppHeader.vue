<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const currentSection = computed(() => {
  if (route.name === 'material') return 'materials'
  return route.name
})
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="HOMEへ移動">
        応用情報 可視化ラーニング
        <small>ステップ実行で「なぜ」を理解する</small>
      </RouterLink>

      <nav class="global-nav" aria-label="メインナビゲーション">
        <RouterLink class="nav-link" to="/" :aria-current="currentSection === 'home' ? 'page' : undefined">
          HOME
        </RouterLink>
        <RouterLink
          class="nav-link"
          to="/materials"
          :aria-current="currentSection === 'materials' ? 'page' : undefined"
        >
          学習一覧
        </RouterLink>
        <RouterLink
          class="nav-link"
          to="/history"
          :aria-current="currentSection === 'history' ? 'page' : undefined"
        >
          学習履歴
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
