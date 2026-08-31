import type { LearningHistoryEntry } from '../materials/types'

export const LEARNING_HISTORY_STORAGE_KEY = 'ap-visual-learning:history'

function isLearningHistoryEntry(value: unknown): value is LearningHistoryEntry {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const entry = value as Record<string, unknown>
  return (
    typeof entry.materialId === 'string' &&
    entry.materialId.length > 0 &&
    typeof entry.lastOpenedAt === 'string' &&
    !Number.isNaN(Date.parse(entry.lastOpenedAt))
  )
}

export function getLearningHistory(): LearningHistoryEntry[] {
  try {
    const rawHistory = localStorage.getItem(LEARNING_HISTORY_STORAGE_KEY)
    if (!rawHistory) {
      return []
    }

    const parsedHistory: unknown = JSON.parse(rawHistory)
    if (!Array.isArray(parsedHistory)) {
      return []
    }

    return parsedHistory
      .filter(isLearningHistoryEntry)
      .sort((first, second) => Date.parse(second.lastOpenedAt) - Date.parse(first.lastOpenedAt))
  } catch {
    return []
  }
}

export function recordMaterialOpened(materialId: string): void {
  const nextHistory: LearningHistoryEntry[] = [
    {
      materialId,
      lastOpenedAt: new Date().toISOString(),
    },
    ...getLearningHistory().filter((entry) => entry.materialId !== materialId),
  ]

  try {
    localStorage.setItem(LEARNING_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory))
  } catch {
    // Storageが利用できない場合も教材閲覧は継続する。
  }
}
