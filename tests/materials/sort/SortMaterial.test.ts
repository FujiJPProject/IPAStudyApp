import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import SortMaterial from '../../../src/materials/sort/SortMaterial.vue'

function button(wrapper: VueWrapper, label: string) {
  const match = wrapper.findAll('button').find((candidate) => candidate.text().includes(label))
  if (!match) throw new Error(`Button not found: ${label}`)
  return match
}

function baseArrayText(wrapper: VueWrapper): string {
  return wrapper.get('[data-testid="base-array"]').text()
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('SortMaterial', () => {
  it('shows a random 1 to 9 base array and all seven algorithms before starting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25)
    const wrapper = mount(SortMaterial)
    const select = wrapper.get('[data-testid="algorithm-select"]')
    const values = baseArrayText(wrapper).match(/\d+/g)?.map(Number)

    expect(values?.sort((left, right) => left - right)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(select.findAll('option').map((option) => option.text())).toEqual([
      'バブルソート',
      '選択ソート',
      '挿入ソート',
      'クイックソート',
      'マージソート',
      'ヒープソート',
      'シェルソート',
    ])
    expect(button(wrapper, '1ステップ実行').attributes('disabled')).toBeDefined()
    expect(button(wrapper, '自動再生').attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('開始前')
    expect(wrapper.text()).toContain('処理完了後に最終結果を表示します。')
  })

  it('starts independently and advances one meaningful step', async () => {
    const wrapper = mount(SortMaterial)

    await button(wrapper, '処理を開始').trigger('click')
    expect(wrapper.text()).toContain('処理を開始しました')
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')
    expect(button(wrapper, '1ステップ実行').attributes('disabled')).toBeUndefined()

    await button(wrapper, '1ステップ実行').trigger('click')
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 1 /')
    expect(wrapper.text()).toContain('未確定範囲の走査を開始')
    expect(wrapper.text()).toContain('未確定範囲の右端位置')
  })

  it('keeps the base array while switching algorithms and restarting at Step 0', async () => {
    const wrapper = mount(SortMaterial)
    const original = baseArrayText(wrapper)

    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '1ステップ実行').trigger('click')
    await wrapper.get('[data-testid="algorithm-select"]').setValue('heap')

    expect(baseArrayText(wrapper)).toBe(original)
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')
    expect(wrapper.text()).toContain('ヒープソート')
    expect(wrapper.text()).toContain('開始前')

    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '1ステップ実行').trigger('click')
    await button(wrapper, '最初から').trigger('click')
    expect(baseArrayText(wrapper)).toBe(original)
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')
  })

  it('shuffles the same nine values to a different base order and resets', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999)
    const wrapper = mount(SortMaterial)
    const before = baseArrayText(wrapper)

    await button(wrapper, 'シャッフル').trigger('click')
    const after = baseArrayText(wrapper)
    const values = after.match(/\d+/g)?.map(Number)

    expect(after).not.toBe(before)
    expect(values?.sort((left, right) => left - right)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')
  })

  it('auto-plays from the current step, pauses with the same button, and uses fake time', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SortMaterial)
    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '1ステップ実行').trigger('click')

    await button(wrapper, '自動再生').trigger('click')
    expect(wrapper.text()).toContain('Ⅱ 一時停止')
    vi.advanceTimersByTime(600)
    await nextTick()
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 2 /')

    await button(wrapper, '一時停止').trigger('click')
    const pausedProgress = wrapper.get('[data-testid="step-progress"]').text()
    expect(wrapper.text()).toContain('一時停止')
    vi.advanceTimersByTime(2400)
    await nextTick()
    expect(wrapper.get('[data-testid="step-progress"]').text()).toBe(pausedProgress)
  })

  it('supports 100 to 1200 ms in 50 ms steps and restarts a running timer at new speed', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SortMaterial)
    const speed = wrapper.get('[data-testid="speed-range"]')

    expect(speed.attributes()).toMatchObject({ min: '100', max: '1200', step: '50' })
    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')
    await speed.setValue('100')
    await flushPromises()

    vi.advanceTimersByTime(100)
    await nextTick()
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 1 /')
    expect(wrapper.text()).toContain('100 ms')
  })

  it('stops auto-play on algorithm change and cleans the timer on unmount', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SortMaterial)
    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')
    expect(vi.getTimerCount()).toBe(1)

    await wrapper.get('[data-testid="algorithm-select"]').setValue('shell')
    expect(vi.getTimerCount()).toBe(0)
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')

    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')
    expect(vi.getTimerCount()).toBe(1)
    wrapper.unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('stops auto-play when restarting or shuffling', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SortMaterial)

    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')
    expect(vi.getTimerCount()).toBe(1)
    await button(wrapper, '最初から').trigger('click')
    expect(vi.getTimerCount()).toBe(0)
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')

    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')
    expect(vi.getTimerCount()).toBe(1)
    await button(wrapper, 'シャッフル').trigger('click')
    expect(vi.getTimerCount()).toBe(0)
    expect(wrapper.get('[data-testid="step-progress"]').text()).toContain('Step 0 /')
  })

  it('completes with auto-play and unlocks Result, Why, and Insight', async () => {
    vi.useFakeTimers()
    const wrapper = mount(SortMaterial)
    await button(wrapper, '処理を開始').trigger('click')
    await button(wrapper, '自動再生').trigger('click')

    vi.runAllTimers()
    await nextTick()

    expect(wrapper.text()).toContain('完了')
    expect(wrapper.get('[data-testid="final-result"]').text()).toContain(
      '[1, 2, 3, 4, 5, 6, 7, 8, 9]',
    )
    expect(wrapper.get('[data-testid="why"]').text().length).toBeGreaterThan(10)
    expect(wrapper.get('[data-testid="insight"]').text().length).toBeGreaterThan(10)
    expect(vi.getTimerCount()).toBe(0)
  })
})
