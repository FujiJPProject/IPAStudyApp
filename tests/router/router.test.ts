import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { routes } from '../../src/router'

describe('router', () => {
  it.each([
    ['/', 'home'],
    ['/materials', 'materials'],
    ['/materials/sort-visualizer', 'material'],
    ['/history', 'history'],
  ])('resolves %s to the expected view', async (path, expectedName) => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push(path)
    await router.isReady()

    expect(router.currentRoute.value.name).toBe(expectedName)
  })

  it('redirects an unknown URL to HOME', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push('/unknown-path')
    await router.isReady()

    expect(router.currentRoute.value.fullPath).toBe('/')
    expect(router.currentRoute.value.name).toBe('home')
  })

  it('supports back and forward navigation', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    })

    await router.push('/')
    await router.isReady()
    await router.push('/materials')

    await new Promise<void>((resolve) => {
      const removeGuard = router.afterEach((to) => {
        if (to.fullPath === '/') {
          removeGuard()
          resolve()
        }
      })
      router.back()
    })
    expect(router.currentRoute.value.fullPath).toBe('/')

    await new Promise<void>((resolve) => {
      const removeGuard = router.afterEach((to) => {
        if (to.fullPath === '/materials') {
          removeGuard()
          resolve()
        }
      })
      router.forward()
    })
    expect(router.currentRoute.value.fullPath).toBe('/materials')
  })
})
