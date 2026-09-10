/** Coarse pointer ≈ phones/tablets; used to prefer native scroll over Lenis. */
export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

/** Narrow viewports (phones + small tablets in portrait). */
export function isNarrowViewport(maxWidth = 768): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
}

/**
 * Particle / WebGL budget for the current device.
 * Phones get fewer points and a lower DPR; tablets sit in between.
 */
export function getParticleBudget() {
  if (typeof window === 'undefined') {
    return { countScale: 1, maxDpr: 2, reduceBloom: false };
  }

  const coarse = isCoarsePointer();
  const narrow = isNarrowViewport(768);
  const mid = isNarrowViewport(1024);
  const cores = navigator.hardwareConcurrency || 4;
  const lowPower = cores <= 4 || coarse;

  if (narrow || (coarse && mid)) {
    return {
      countScale: lowPower ? 0.35 : 0.45,
      maxDpr: 1.25,
      reduceBloom: true,
    };
  }

  if (mid || coarse) {
    return {
      countScale: 0.65,
      maxDpr: 1.5,
      reduceBloom: false,
    };
  }

  return { countScale: 1, maxDpr: 2, reduceBloom: false };
}

export function scaledParticleCount(base: number): number {
  const { countScale } = getParticleBudget();
  return Math.max(4_000, Math.round(base * countScale));
}

/** Keep every stride-th vec3 so baked bins can run at a lower particle budget. */
export function subsampleVec3(src: Float32Array, targetCount: number): Float32Array {
  const srcCount = Math.floor(src.length / 3);
  if (targetCount >= srcCount) return src;
  const out = new Float32Array(targetCount * 3);
  for (let i = 0; i < targetCount; i++) {
    const srcI = Math.floor((i / targetCount) * srcCount) * 3;
    out[i * 3] = src[srcI];
    out[i * 3 + 1] = src[srcI + 1];
    out[i * 3 + 2] = src[srcI + 2];
  }
  return out;
}

export function subsampleScalar(src: Float32Array, targetCount: number): Float32Array {
  if (targetCount >= src.length) return src;
  const out = new Float32Array(targetCount);
  for (let i = 0; i < targetCount; i++) {
    out[i] = src[Math.floor((i / targetCount) * src.length)];
  }
  return out;
}
