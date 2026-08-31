import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { MaterialDefinition } from '../../src/materials/types'
import { materialDefinitions } from '../../src/materials/definitions'
import { getLearningHistory } from '../../src/services/historyService'
import App from '../../src/App.vue'
import { routes } from '../../src/router'

const definitions = materialDefinitions as MaterialDefinition[]
const initialDefinitions = [...definitions]

describe('MaterialView', () => {
  beforeEach(() => {
    localStorage.clear()
    definitions.splice(0, definitions.length, ...initialDefinitions)
  })

  afterEach(() => {
    definitions.splice(0, definitions.length, ...initialDefinitions)
  })

  it('records valid materials, including when the route material ID changes', async () => {
    definitions.push({
      ...initialDefinitions[0],
      metadata: {
        ...initialDefinitions[0].metadata,
        id: 'second-material',
        name: '2つ目の教材',
      },
    })
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/materials/sort-visualizer')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    await router.push('/materials/second-material')
    await flushPromises()

    expect(getLearningHistory().map((entry) => entry.materialId)).toEqual([
      'second-material',
      'sort-visualizer',
    ])
    wrapper.unmount()
  })

  it('does not record an unknown material ID', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/materials/unknown-material')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })
    await flushPromises()

    expect(wrapper.text()).toContain('教材が見つかりません')
    expect(getLearningHistory()).toEqual([])
    wrapper.unmount()
  })
})
