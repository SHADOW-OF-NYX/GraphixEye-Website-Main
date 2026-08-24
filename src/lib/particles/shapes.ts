/**
 * Shape generators matching Auralis reference video morphs.
 * Returns Float32Array of interleaved [x,y,z,...] positions.
 */

const TAU = Math.PI * 2

function rand() { return Math.random() }
function randRange(a: number, b: number) { return a + rand() * (b - a) }

function catmullRom(
  p0: [number, number, number],
  p1: [number, number, number],
  p2: [number, number, number],
  p3: [number, number, number],
  t: number,
): [number, number, number] {
  const t2 = t * t
  const t3 = t2 * t
  return [
    0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
    0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
    0.5 * (2 * p1[2] + (-p0[2] + p2[2]) * t + (2 * p0[2] - 5 * p1[2] + 4 * p2[2] - p3[2]) * t2 + (-p0[2] + 3 * p1[2] - 3 * p2[2] + p3[2]) * t3),
  ]
}

function pointOnSpline(pts: [number, number, number][], t: number): [number, number, number] {
  const n = pts.length - 1
  const seg = Math.min(Math.floor(t * n), n - 1)
  const lt = t * n - seg
  return catmullRom(
    pts[Math.max(0, seg - 1)],
    pts[seg],
    pts[Math.min(n, seg + 1)],
    pts[Math.min(n, seg + 2)],
    lt,
  )
}

function cylinderPoint(
  base: [number, number, number],
  tip: [number, number, number],
  baseRadius: number,
  jitter = 0.035,
): [number, number, number] {
  const t = rand()
  const taper = 1 - t * 0.62
  const r = Math.sqrt(rand()) * baseRadius * taper
  const angle = rand() * TAU
  const ax = tip[0] - base[0], ay = tip[1] - base[1], az = tip[2] - base[2]
  const len = Math.hypot(ax, ay, az) || 1
  const nx = ax / len, ny = ay / len, nz = az / len
  let px: number, py: number, pz: number
  if (Math.abs(ny) < 0.9) { px = nz; py = 0; pz = -nx }
  else { px = 0; py = -nz; pz = ny }
  const pl = Math.hypot(px, py, pz) || 1
  px /= pl; py /= pl; pz /= pl
  const qx = ny * pz - nz * py
  const qy = nz * px - nx * pz
  const qz = nx * py - ny * px
  return [
    base[0] + nx * t * len + (Math.cos(angle) * px + Math.sin(angle) * qx) * r + randRange(-jitter, jitter),
    base[1] + ny * t * len + (Math.cos(angle) * py + Math.sin(angle) * qy) * r + randRange(-jitter, jitter),
    base[2] + nz * t * len + (Math.cos(angle) * pz + Math.sin(angle) * qz) * r + randRange(-jitter, jitter),
  ]
}

function ellipsoidPoint(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number): [number, number, number] {
  let x = 0, y = 0, z = 0, len = 2
  while (len > 1) {
    x = randRange(-1, 1); y = randRange(-1, 1); z = randRange(-1, 1)
    len = x * x + y * y + z * z
  }
  const k = Math.cbrt(rand())
  return [cx + x * rx * k, cy + y * ry * k, cz + z * rz * k]
}

function tubeAlongSpline(
  pts: [number, number, number][],
  count: number,
  radius: number,
  write: (x: number, y: number, z: number) => void,
) {
  for (let i = 0; i < count; i++) {
    const t = i / count
    const [x, y, z] = pointOnSpline(pts, t)
    const thickness = radius * (0.55 + 0.9 * Math.exp(-Math.pow((t - 0.5) * 2.8, 2)))
    write(
      x + randRange(-thickness, thickness),
      y + randRange(-thickness, thickness),
      z + randRange(-thickness * 0.6, thickness * 0.6),
    )
  }
}

// ─── HAND — open palm facing camera (matches crop_005 / crop_013) ───────────

export function generateHandPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let i = 0
  const set = (p: [number, number, number]) => {
    if (i >= count) return
    pos[i * 3] = p[0]; pos[i * 3 + 1] = p[1]; pos[i * 3 + 2] = p[2]
    i++
  }

  // Palm — slightly cupped, facing camera (z toward viewer)
  const palmN = Math.floor(count * 0.32)
  for (let j = 0; j < palmN; j++) set(ellipsoidPoint(0.02, -0.15, 0.05, 0.48, 0.52, 0.16))

  // Knuckle ridge
  const knuckleN = Math.floor(count * 0.06)
  for (let j = 0; j < knuckleN; j++) set(ellipsoidPoint(0.02, 0.32, 0.08, 0.46, 0.08, 0.10))

  // Fingers — open, slightly fanned, facing camera
  type Finger = { base: [number, number, number]; tip: [number, number, number]; r: number; n: number }
  const fingers: Finger[] = [
    { base: [0.28, 0.38, 0.06], tip: [0.38, 1.48, 0.04], r: 0.055, n: Math.floor(count * 0.12) }, // index
    { base: [0.08, 0.42, 0.08], tip: [0.10, 1.72, 0.05], r: 0.060, n: Math.floor(count * 0.14) }, // middle
    { base: [-0.12, 0.40, 0.06], tip: [-0.14, 1.55, 0.04], r: 0.055, n: Math.floor(count * 0.12) }, // ring
    { base: [-0.30, 0.30, 0.04], tip: [-0.36, 1.28, 0.02], r: 0.045, n: Math.floor(count * 0.09) }, // pinky
  ]
  for (const f of fingers) {
    for (let j = 0; j < f.n; j++) set(cylinderPoint(f.base, f.tip, f.r, 0.038))
  }

  // Thumb — left, ~45°
  const thumbN = count - i
  for (let j = 0; j < thumbN; j++) {
    set(cylinderPoint([-0.38, -0.18, 0.10], [-0.78, 0.55, 0.12], 0.062, 0.04))
  }

  return pos
}

// ─── EXPLOSION ───────────────────────────────────────────────────────────────

export function generateExplodePositions(count: number, radius = 3.2): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = rand() * TAU
    const phi = Math.acos(2 * rand() - 1)
    const r = Math.cbrt(rand()) * radius
    pos[i * 3]     = Math.sin(phi) * Math.cos(theta) * r
    pos[i * 3 + 1] = Math.cos(phi) * r
    pos[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r * 0.55
  }
  return pos
}

// ─── RIBBON TRAILS — magenta swirls (crop_011 / frame_007) ───────────────────

export function generateRibbonPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const set = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z
    idx++
  }

  const ribbons: [number, number, number][][] = [
    [[-2.6, -1.4, 0.2], [-1.4, 0.2, 0.4], [0.0, 1.1, 0.1], [1.4, 0.6, -0.2], [2.4, -0.4, 0.1]],
    [[-2.2, 0.6, -0.3], [-0.8, 1.4, 0.0], [0.6, 1.0, 0.3], [1.8, -0.2, 0.1], [2.6, -1.2, -0.1]],
    [[-1.8, -0.8, 0.5], [-0.4, -0.2, 0.6], [0.8, 0.8, 0.2], [2.0, 1.3, -0.2]],
  ]

  const shares = [0.38, 0.28, 0.18]
  ribbons.forEach((path, ri) => {
    tubeAlongSpline(path, Math.floor(count * shares[ri]), 0.10 + ri * 0.02, set)
  })

  while (idx < count) {
    set(randRange(-2.4, 2.4), randRange(-2.0, -0.6), randRange(-0.5, 0.5))
  }
  return pos
}

// ─── SCATTER / STARFIELD close-up ────────────────────────────────────────────

export function generateScatterPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = randRange(-3.6, 3.6)
    pos[i * 3 + 1] = randRange(-2.3, 2.3)
    pos[i * 3 + 2] = randRange(-1.2, 1.2)
  }
  return pos
}

// ─── X / CROSS — thick volumetric arms (crop_017) ────────────────────────────

export function generateXPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const arm = rand() < 0.5 ? 1 : -1
    const t = randRange(-1.45, 1.45)
    // Soft cylindrical falloff around the diagonal
    const ang = rand() * TAU
    const rad = Math.sqrt(rand()) * 0.32 * Math.exp(-Math.abs(t) * 0.15)
    const ox = Math.cos(ang) * rad
    const oy = Math.sin(ang) * rad * 0.7
    const oz = randRange(-0.22, 0.22)
    pos[i * 3]     = t * 0.92 + ox
    pos[i * 3 + 1] = t * arm * 0.92 + oy
    pos[i * 3 + 2] = oz
  }
  return pos
}

// ─── THIN NEON LINES ─────────────────────────────────────────────────────────

export function generateLinePositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const set = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z
    idx++
  }

  const lines: [number, [number, number], number, number][] = [
    [0.35,  [-3.3, 3.3],  0.20, 0.28],
    [-0.18, [-3.3, 3.3], -0.16, 0.24],
    [0.85,  [-2.0, 2.0],  0.12, 0.16],
    [1.20,  [-1.3, 1.3],  0.07, 0.10],
  ]

  for (const [yc, [xlo, xhi], bow, share] of lines) {
    const n = Math.floor(count * share)
    for (let j = 0; j < n; j++) {
      const x = randRange(xlo, xhi)
      const t = (x - xlo) / (xhi - xlo) - 0.5
      const y = yc + bow * (1 - 4 * t * t)
      set(x, y + randRange(-0.02, 0.02), randRange(-0.03, 0.03))
    }
  }

  while (idx < count) {
    set(randRange(-0.6, 0.6), randRange(-1.9, -1.0), randRange(-0.15, 0.15))
  }
  return pos
}

// ─── WIDE ARC ────────────────────────────────────────────────────────────────

export function generateArcPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const set = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z
    idx++
  }

  const arcN = Math.floor(count * 0.62)
  for (let j = 0; j < arcN; j++) {
    const t = j / arcN
    const angle = Math.PI - t * Math.PI
    const R = 2.55
    const cx = Math.cos(angle) * R
    const cy = Math.sin(angle) * R - 0.55
    const density = 0.11 + 0.16 * Math.exp(-Math.pow((t - 0.5) * 3.2, 2))
    set(cx + randRange(-density, density), cy + randRange(-density, density), randRange(-0.12, 0.12))
  }

  while (idx < count) {
    set(randRange(-3.0, 3.0), randRange(-2.2, 0.3), randRange(-0.5, 0.5))
  }
  return pos
}

// ─── BONSAI TREE (crop frame_017) ────────────────────────────────────────────

export function generateCloudPositions(count: number): Float32Array {
  // Named "cloud" in sequencer but renders as bonsai to match video
  return generateBonsaiPositions(count)
}

export function generateBonsaiPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  let idx = 0
  const set = (x: number, y: number, z: number) => {
    if (idx >= count) return
    pos[idx * 3] = x; pos[idx * 3 + 1] = y; pos[idx * 3 + 2] = z
    idx++
  }

  // Trunk — curved S
  const trunk: [number, number, number][] = [
    [0.05, -1.55, 0.0],
    [-0.08, -0.95, 0.05],
    [0.12, -0.35, 0.0],
    [0.0, 0.25, -0.05],
  ]
  tubeAlongSpline(trunk, Math.floor(count * 0.18), 0.09, set)

  // Foliage clusters (3–4 fluffy blobs)
  const clusters: [number, number, number, number, number, number][] = [
    // cx, cy, cz, rx, ry, rz
    [0.05, 0.85, 0.0, 0.55, 0.42, 0.38],
    [-0.45, 0.55, 0.1, 0.38, 0.30, 0.28],
    [0.48, 0.50, -0.05, 0.35, 0.28, 0.26],
    [0.15, 1.25, 0.05, 0.32, 0.25, 0.24],
    [-0.15, 0.35, 0.15, 0.22, 0.18, 0.18],
  ]
  const perCluster = Math.floor(count * 0.55 / clusters.length)
  for (const [cx, cy, cz, rx, ry, rz] of clusters) {
    for (let j = 0; j < perCluster; j++) {
      const [x, y, z] = ellipsoidPoint(cx, cy, cz, rx, ry, rz)
      // Lumpy edge
      const lump = 0.08 * Math.sin(x * 8) * Math.cos(y * 6)
      set(x + lump, y + lump * 0.4, z)
    }
  }

  // Falling dust below
  while (idx < count) {
    set(randRange(-0.9, 0.9), randRange(-1.9, -1.2), randRange(-0.25, 0.25))
  }
  return pos
}

// ─── WAVE / CLOTH topography (crop_007 / crop_015) ───────────────────────────

export function generateWavePositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = rand()
    const v = rand()
    const x = (u - 0.5) * 5.2
    const z = (v - 0.5) * 2.4
    const y =
      Math.sin(u * Math.PI * 2.2) * 0.55 +
      Math.cos(v * Math.PI * 3.0) * 0.35 +
      Math.sin((u + v) * Math.PI * 4) * 0.18 -
      0.15
    // Thickness around the surface
    const n = randRange(-0.08, 0.08)
    pos[i * 3]     = x + randRange(-0.02, 0.02)
    pos[i * 3 + 1] = y + n
    pos[i * 3 + 2] = z + randRange(-0.02, 0.02)
  }
  return pos
}

// ─── ORGANIC NEBULA CLOUD (crop_003 / crop_021) ──────────────────────────────

export function generateNebulaPositions(count: number): Float32Array {
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    // Core blob
    if (rand() < 0.72) {
      const [x, y, z] = ellipsoidPoint(0, 0.1, 0, 1.1, 0.85, 0.7)
      const wisp = 0.15 * Math.sin(x * 4 + y * 3)
      pos[i * 3] = x + wisp
      pos[i * 3 + 1] = y + wisp * 0.5
      pos[i * 3 + 2] = z
    } else {
      // Outer wisps
      const theta = rand() * TAU
      const r = 1.2 + rand() * 1.6
      pos[i * 3]     = Math.cos(theta) * r * randRange(0.6, 1.2)
      pos[i * 3 + 1] = Math.sin(theta) * r * 0.45 + randRange(-0.8, 0.8)
      pos[i * 3 + 2] = randRange(-0.6, 0.6)
    }
  }
  return pos
}
