import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getLearningHistory,
  LEARNING_HISTORY_STORAGE_KEY,
  recordMaterialOpened,
} from '../../src/services/historyService'

describe('historyService', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('records a material with an ISO 8601 last opened time', () => {
    vi.setSystemTime(new Date('2026-08-31T01:02:03.000Z'))

    recordMaterialOpened('sort-visualizer')

    expect(getLearningHistory()).toEqual([
      {
        materialId: 'sort-visualizer',
        lastOpenedAt: '2026-08-31T01:02:03.000Z',
      },
    ])
  })

  it('updates an existing material entry instead of adding a duplicate', () => {
    vi.setSystemTime(new Date('2026-08-31T01:02:03.000Z'))
    recordMaterialOpened('sort-visualizer')
    vi.setSystemTime(new Date('2026-08-31T02:03:04.000Z'))

    recordMaterialOpened('sort-visualizer')

    expect(getLearningHistory()).toEqual([
      {
        materialId: 'sort-visualizer',
        lastOpenedAt: '2026-08-31T02:03:04.000Z',
      },
    ])
  })

  it('returns entries ordered by the most recently opened material', () => {
    vi.setSystemTime(new Date('2026-08-31T01:02:03.000Z'))
    recordMaterialOpened('first-material')
    vi.setSystemTime(new Date('2026-08-31T02:03:04.000Z'))
    recordMaterialOpened('second-material')

    expect(getLearningHistory().map((entry) => entry.materialId)).toEqual([
      'second-material',
      'first-material',
    ])
  })

  it('ignores malformed storage data', () => {
    localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, '{not-json')
    expect(getLearningHistory()).toEqual([])

    localStorage.setItem(
      LEARNING_HISTORY_STORAGE_KEY,
      JSON.stringify([
        { materialId: 'sort-visualizer', lastOpenedAt: '2026-08-31T01:02:03.000Z' },
        { materialId: 10, lastOpenedAt: '2026-08-31T01:02:03.000Z' },
        { materialId: 'invalid-date', lastOpenedAt: 'not-a-date' },
      ]),
    )

    expect(getLearningHistory()).toEqual([
      { materialId: 'sort-visualizer', lastOpenedAt: '2026-08-31T01:02:03.000Z' },
    ])
  })

  it('continues safely when storage reads or writes fail', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })
    expect(getLearningHistory()).toEqual([])

    vi.restoreAllMocks()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage is unavailable')
    })
    expect(() => recordMaterialOpened('sort-visualizer')).not.toThrow()
  })
})
