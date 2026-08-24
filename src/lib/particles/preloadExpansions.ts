import { loadBakedTargets } from './loadTargets'

let preloadPromise: Promise<void> | null = null

/** Shared dynamic import — same module ThreeSceneLoader lazy-loads. */
export function importThreeScene() {
  return import('../../components/particles/ThreeScene')
}

/**
 * Warm-load Expansions assets in the background (bins + Three.js chunk).
 * Safe to call multiple times; runs once and caches.
 */
export function preloadExpansions(): Promise<void> {
  if (preloadPromise) return preloadPromise

  preloadPromise = Promise.all([
    loadBakedTargets(),
    importThreeScene(),
    import('three/examples/jsm/postprocessing/EffectComposer.js'),
    import('three/examples/jsm/postprocessing/RenderPass.js'),
    import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
  ])
    .then(() => undefined)
    .catch((err) => {
      // Allow retry if preload fails (offline, etc.)
      preloadPromise = null
      console.warn('[Expansions] background preload failed', err)
    })

  return preloadPromise
}

/** Schedule preload after the landing page has painted — avoids blocking first load. */
export function scheduleExpansionsPreload() {
  if (typeof window === 'undefined') return

  const run = () => {
    preloadExpansions()
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 3500 })
  } else {
    window.setTimeout(run, 1800)
  }
}
