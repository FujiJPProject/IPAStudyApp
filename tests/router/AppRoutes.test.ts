import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../../src/App.vue'
import { routes } from '../../src/router'

describe('application routes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it.each([
    ['/', '処理を1ステップずつ進めて'],
    ['/materials', 'ソートアルゴリズム可視化'],
    ['/materials/sort-visualizer', '教材の実行エリア'],
    ['/history', 'まだ学習履歴はありません'],
  ])('renders the basic screen for %s', async (path, expectedText) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push(path)
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    await flushPromises()
    expect(wrapper.text()).toContain(expectedText)
  })
})
