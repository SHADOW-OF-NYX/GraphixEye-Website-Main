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
 * Safari / iOS WebKit — Lenis + GSAP pins fight native scroll here.
 * Includes iPadOS "desktop" mode (fine pointer, still WebKit).
 */
export function isSafariOrIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const desktopSafari = /Safari/i.test(ua) && !/Chrome|Chromium|Edg|Android/i.test(ua);
  return iOS || desktopSafari;
}

/** Prefer native scroll whenever Lenis is likely to break (touch, narrow, Safari). */
export function shouldUseNativeScroll(): boolean {
  return isSafariOrIOS() || isCoarsePointer() || isNarrowViewport(900);
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
  const safari = isSafariOrIOS();
  const cores = navigator.hardwareConcurrency || 4;
  const lowPower = cores <= 4 || coarse || safari;

  if (narrow || (coarse && mid) || (safari && mid)) {
    return {
      countScale: lowPower ? 0.35 : 0.45,
      maxDpr: safari ? 1 : 1.25,
      reduceBloom: true,
    };
  }

  if (mid || coarse || safari) {
    return {
      countScale: safari ? 0.55 : 0.65,
      maxDpr: safari ? 1.25 : 1.5,
      reduceBloom: safari,
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

/** MediaQueryList.change — older Safari only had addListener/removeListener. */
export function onMediaQueryChange(mq: MediaQueryList, handler: () => void): () => void {
  if (typeof mq.addEventListener === 'function') {
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }
  mq.addListener(handler);
  return () => mq.removeListener(handler);
}
