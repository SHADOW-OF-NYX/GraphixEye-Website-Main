/**
 * Load pre-baked particle target Float32Arrays from /public/particle-targets.
 */

const N = 32_000
const FLOATS = N * 3

async function loadBin(url: string): Promise<Float32Array> {
  const res = await fetch(`${url}?v=quest2`)
  if (!res.ok) throw new Error(`Failed to load ${url}`)
  const buf = await res.arrayBuffer()
  const arr = new Float32Array(buf)
  if (arr.length !== FLOATS) {
    console.warn(`[targets] ${url} length ${arr.length}, expected ${FLOATS}`)
  }
  return arr
}

export type BakedTargets = {
  eye: Float32Array
  eyeBlink: Float32Array[]
  eyeColors: Float32Array | null
  face: Float32Array | null
  faceColors: Float32Array | null
  holo: Float32Array | null
  holoColors: Float32Array | null
  quest: Float32Array | null
  questColors: Float32Array | null
  bonsai: Float32Array
  bonsaiColors: Float32Array | null
}

let cache: BakedTargets | null = null

export function clearBakedTargetCache() {
  cache = null
}

export async function loadBakedTargets(): Promise<BakedTargets> {
  if (cache) return cache
  const [eye, b0, b1, b2, bonsai] = await Promise.all([
    loadBin('/particle-targets/eye.bin'),
    loadBin('/particle-targets/eye_blink_0.bin'),
    loadBin('/particle-targets/eye_blink_1.bin'),
    loadBin('/particle-targets/eye_blink_2.bin'),
    loadBin('/particle-targets/bonsai.bin'),
  ])

  let eyeColors: Float32Array | null = null
  let face: Float32Array | null = null
  let faceColors: Float32Array | null = null
  let holo: Float32Array | null = null
  let holoColors: Float32Array | null = null
  let quest: Float32Array | null = null
  let questColors: Float32Array | null = null
  let bonsaiColors: Float32Array | null = null
  try {
    eyeColors = await loadBin('/particle-targets/eye_colors.bin')
  } catch {
    eyeColors = null
  }
  try {
    face = await loadBin('/particle-targets/face.bin')
  } catch {
    face = null
  }
  try {
    faceColors = await loadBin('/particle-targets/face_colors.bin')
  } catch {
    faceColors = null
  }
  try {
    holo = await loadBin('/particle-targets/holo.bin')
  } catch {
    holo = null
  }
  try {
    holoColors = await loadBin('/particle-targets/holo_colors.bin')
  } catch {
    holoColors = null
  }
  try {
    quest = await loadBin('/particle-targets/quest.bin')
  } catch {
    quest = null
  }
  try {
    questColors = await loadBin('/particle-targets/quest_colors.bin')
  } catch {
    questColors = null
  }
  try {
    bonsaiColors = await loadBin('/particle-targets/bonsai_colors.bin')
  } catch {
    bonsaiColors = null
  }

  cache = {
    eye,
    eyeBlink: [b0, b1, b2],
    eyeColors,
    face,
    faceColors,
    holo,
    holoColors,
    quest,
    questColors,
    bonsai,
    bonsaiColors,
  }
  return cache
}

/** Blend blink frames: t in [0,1] where 0=open, 0.5=mid, 1=closed */
export function sampleEyeBlink(
  frames: Float32Array[],
  t: number,
  out: Float32Array,
) {
  const x = Math.max(0, Math.min(1, t)) * 2
  const i0 = Math.min(Math.floor(x), 1)
  const i1 = i0 + 1
  const f = x - i0
  const a = frames[i0]
  const b = frames[i1]
  for (let i = 0; i < out.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * f
  }
}
