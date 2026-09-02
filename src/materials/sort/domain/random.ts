export type RandomSource = () => number

function randomIndex(random: RandomSource, upperExclusive: number): number {
  const value = random()
  const normalized = Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.9999999999999999) : 0
  return Math.floor(normalized * upperExclusive)
}

function shuffledCopy(values: readonly number[], random: RandomSource): number[] {
  const result = [...values]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomIndex(random, index + 1)
    ;[result[index], result[target]] = [result[target], result[index]]
  }

  return result
}

export function createRandomPermutation(random: RandomSource = Math.random): number[] {
  return shuffledCopy(
    Array.from({ length: 9 }, (_, index) => index + 1),
    random,
  )
}

export function shufflePermutation(
  current: readonly number[],
  random: RandomSource = Math.random,
): number[] {
  const shuffled = shuffledCopy(current, random)

  if (shuffled.length > 1 && shuffled.every((value, index) => value === current[index])) {
    return [...shuffled.slice(1), shuffled[0]]
  }

  return shuffled
}

