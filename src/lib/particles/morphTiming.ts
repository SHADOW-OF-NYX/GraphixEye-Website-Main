/** Shared scroll morph timing — keep ThreeScene + ServiceShowcase in sync. */
export const SHAPE_COUNT = 4

/** Fraction of each scroll segment spent fully formed (before morphing to next). */
export const MORPH_HOLD = 0.45

/**
 * Opacity for service title i given scroll progress in [0,1].
 * Titles peak only while their paired shape is fully formed.
 */
export function titleOpacityForProgress(progress: number, index: number, count = SHAPE_COUNT): number {
  const n = count
  const start = index / n
  const end = (index + 1) / n
  const span = end - start
  const holdEnd = start + span * MORPH_HOLD

  // Fade in over first 20% of hold; fade out in first 15% of morph
  const fadeInEnd = start + span * MORPH_HOLD * 0.2
  const fadeOutEnd = holdEnd + span * (1 - MORPH_HOLD) * 0.18

  const smoothstep = (t: number) => {
    const x = Math.max(0, Math.min(1, t))
    return x * x * x * (x * (x * 6 - 15) + 10)
  }

  if (progress < start || progress > fadeOutEnd) return 0
  if (progress < fadeInEnd) return smoothstep((progress - start) / Math.max(1e-6, fadeInEnd - start))
  if (progress <= holdEnd) return 1
  return smoothstep((fadeOutEnd - progress) / Math.max(1e-6, fadeOutEnd - holdEnd))
}
