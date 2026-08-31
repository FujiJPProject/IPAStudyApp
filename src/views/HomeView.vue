<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="page">
    <section class="hero" aria-labelledby="home-title">
      <p class="eyebrow">応用情報技術者試験 学習支援</p>
      <h1 id="home-title">処理を1ステップずつ進めて、「なぜそうなるのか」を理解する。</h1>
      <p class="lead">
        文章だけでは追いにくいアルゴリズムや内部状態の変化を、処理の流れに沿って可視化する学習アプリです。
      </p>
      <div class="button-row">
        <RouterLink class="button button-primary" to="/materials">学習を始める</RouterLink>
        <RouterLink class="button button-secondary" to="/history">学習履歴を見る</RouterLink>
      </div>
    </section>

    <section class="section" aria-labelledby="learning-flow-title">
      <p class="eyebrow">学び方</p>
      <h2 id="learning-flow-title">結果を見るだけで終わらない学習フロー</h2>
      <div class="info-grid">
        <article class="card">
          <span class="step-number">1</span>
          <h3>初期状態・条件を確認</h3>
          <p>教材で使うデータと、学ぶ内容を最初に確認します。</p>
        </article>
        <article class="card">
          <span class="step-number">2</span>
          <h3>処理を1ステップずつ実行</h3>
          <p>現在の処理と状態の変化を見比べます。</p>
        </article>
        <article class="card">
          <span class="step-number">3</span>
          <h3>結果の理由まで確認</h3>
          <p>最終結果とともに、理由と学習ポイントを確認します。</p>
        </article>
      </div>
    </section>
  </div>
</template>
