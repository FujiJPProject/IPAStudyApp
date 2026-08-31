<script setup lang="ts">
import { RouterLink } from 'vue-router'
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

    <section class="empty-state" aria-labelledby="empty-history-title">
      <h2 id="empty-history-title">まだ学習履歴はありません</h2>
      <p>学習履歴の記録と表示は、後続の履歴機能実装で追加します。</p>
      <RouterLink class="button button-primary" to="/materials">学習一覧へ</RouterLink>
    </section>
  </div>
</template>
