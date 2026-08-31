import { mount, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import HistoryView from '../../src/views/HistoryView.vue'
import { recordMaterialOpened } from '../../src/services/historyService'

describe('HistoryView', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows an empty state when no history exists', () => {
    const wrapper = mount(HistoryView, {
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })

    expect(wrapper.text()).toContain('まだ学習履歴はありません')
  })

  it('shows a recorded material and links back to it', () => {
    recordMaterialOpened('sort-visualizer')
    const wrapper = mount(HistoryView, {
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    })

    expect(wrapper.text()).toContain('ソートアルゴリズム可視化')
    expect(wrapper.text()).toContain('最後に開いた日時：')

    const materialLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.text().includes('もう一度開く'))

    expect(materialLink?.props('to')).toBe('/materials/sort-visualizer')
  })
})
