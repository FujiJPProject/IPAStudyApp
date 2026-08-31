<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MaterialMetadata } from '../materials/types'

defineProps<{
  material: MaterialMetadata
}>()
</script>

<template>
  <article class="material-card">
    <div>
      <span class="tag">{{ material.field }}</span>
      <h2>{{ material.name }}</h2>
      <p>{{ material.summary }}</p>
    </div>
    <RouterLink class="button button-primary" :to="`/materials/${material.id}`">
      教材を開く
    </RouterLink>
  </article>
</template>
