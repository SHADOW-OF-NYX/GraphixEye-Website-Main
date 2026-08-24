/** Shared scroll morph timing — keep ThreeScene + ServiceShowcase in sync. */

/** Morph sequence length: eye → face → holo → quest → bonsai */
export const SHAPE_COUNT = 5

/** Service titles skip the opening eye and map onto shapes 1..4 */
export const TITLE_SHAPE_OFFSET = 1

/** Fraction of each scroll segment spent fully formed (before morphing to next). */
export const MORPH_HOLD = 0.45

/**
 * Opacity for service title i given scroll progress in [0,1].
 * Titles peak only while their paired shape is fully formed.
 */
export function titleOpacityForProgress(
  progress: number,
  serviceIndex: number,
  shapeCount = SHAPE_COUNT,
  shapeOffset = TITLE_SHAPE_OFFSET,
): number {
  const shapeIndex = serviceIndex + shapeOffset
  const n = shapeCount
  const start = shapeIndex / n
  const end = (shapeIndex + 1) / n
  const span = end - start
  const holdEnd = start + span * MORPH_HOLD

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
