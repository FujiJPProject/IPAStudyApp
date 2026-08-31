<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MaterialCard from '../components/MaterialCard.vue'
import { materialDefinitions } from '../materials/definitions'
</script>

<template>
  <div class="page">
    <div class="page-title-row">
      <div>
        <p class="eyebrow">Learning Materials</p>
        <h1>学習一覧</h1>
        <p>利用できる可視化教材から、確認したい内容を選びます。</p>
      </div>
      <RouterLink class="back-link" to="/">← HOMEへ戻る</RouterLink>
    </div>

    <div class="material-grid">
      <MaterialCard
        v-for="definition in materialDefinitions"
        :key="definition.metadata.id"
        :material="definition.metadata"
      />
    </div>
  </div>
</template>
