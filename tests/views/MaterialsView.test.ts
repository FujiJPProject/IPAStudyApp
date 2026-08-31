import { mount, RouterLinkStub } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import MaterialsView from '../../src/views/MaterialsView.vue'

describe('MaterialsView', () => {
  it('shows the MVP material and its destination', () => {
    const wrapper = mount(MaterialsView, {
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.text()).toContain('ソートアルゴリズム可視化')
    expect(wrapper.text()).toContain('アルゴリズム')

    const materialLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.text().includes('教材を開く'))

    expect(materialLink?.props('to')).toBe('/materials/sort-visualizer')
  })
})
