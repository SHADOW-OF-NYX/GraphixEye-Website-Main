/**
 * Bake Vendor Registration particle targets from the GraphixEye logo and
 * supplied GLBs. Runtime loads only the .bin files — source GLBs are not needed.
 *
 * Usage: node scripts/bake-vendors.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { PNG } from 'pngjs'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

globalThis.self = globalThis
globalThis.URL = URL
globalThis.webkitURL = URL
class FakeImage {
  set src(_) {
    setTimeout(() => {
      this.width = 1
      this.height = 1
      this.onload?.()
    }, 0)
  }
}
globalThis.Image = FakeImage
globalThis.createImageBitmap = async () => ({ width: 1, height: 1, close() {} })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'public', 'particle-targets', 'vendors')
const LOGO = path.join(ROOT, 'public', 'ge-logo.png')
const FORKLIFT = 'c:/Users/gauth/Downloads/forklift.glb'
const HANDSHAKE = 'c:/Users/gauth/Downloads/handshake_-_ramadhan_series.glb'

/** Must match FEELS.vendors.count in CareerParticles.tsx */
const N = 16_000
const FORKLIFT_FRAMES = 32

// Distinct hand hues (linear). A = hot copper, B = bright gold — clear split on dark ground.
const HAND_A = new THREE.Color().setRGB(1, 0.32, 0.04, THREE.SRGBColorSpace)
const HAND_B = new THREE.Color().setRGB(1, 0.88, 0.42, THREE.SRGBColorSpace)

fs.mkdirSync(OUT, { recursive: true })

function writeBin(name, arr) {
  const file = path.join(OUT, name)
  fs.writeFileSync(file, Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength))
  console.log('wrote', name, arr.length, 'floats')
}

function computeNorm(positions, targetSpan = 2.6) {
  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity
  const n = positions.length / 3
  for (let i = 0; i < n; i++) {
    const x = positions[i * 3]
    const y = positions[i * 3 + 1]
    const z = positions[i * 3 + 2]
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const cz = (minZ + maxZ) / 2
  const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1
  return { cx, cy, cz, s: targetSpan / span }
}

function applyNorm(positions, norm) {
  const n = positions.length / 3
  for (let i = 0; i < n; i++) {
    positions[i * 3] = (positions[i * 3] - norm.cx) * norm.s
    positions[i * 3 + 1] = (positions[i * 3 + 1] - norm.cy) * norm.s
    positions[i * 3 + 2] = (positions[i * 3 + 2] - norm.cz) * norm.s
  }
}

function normalizePositions(positions, targetSpan = 2.6) {
  const norm = computeNorm(positions, targetSpan)
  applyNorm(positions, norm)
  return norm
}

/** Rotate every point around the origin (after normalize). */
function rotatePositions(positions, euler) {
  const e = new THREE.Euler(euler.x || 0, euler.y || 0, euler.z || 0, 'YXZ')
  const m = new THREE.Matrix4().makeRotationFromEuler(e)
  const v = new THREE.Vector3()
  const n = positions.length / 3
  for (let i = 0; i < n; i++) {
    v.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]).applyMatrix4(m)
    positions[i * 3] = v.x
    positions[i * 3 + 1] = v.y
    positions[i * 3 + 2] = v.z
  }
}

function defaultSizes(n, lo = 0.55, hi = 1.3) {
  const sizes = new Float32Array(n)
  for (let i = 0; i < n; i++) sizes[i] = lo + Math.random() * (hi - lo)
  return sizes
}

async function loadGltf(filePath) {
  const buf = fs.readFileSync(filePath)
  const loader = new GLTFLoader()
  return new Promise((resolve, reject) => {
    loader.parse(
      buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
      '',
      resolve,
      reject,
    )
  })
}

function collectMeshes(root) {
  const meshes = []
  root.traverse((o) => {
    if (o.isMesh || o.isSkinnedMesh) meshes.push(o)
  })
  return meshes
}

function meshWeight(mesh) {
  const g = mesh.geometry
  if (!g?.attributes?.position) return 0
  const idx = g.index
  return idx ? idx.count / 3 : g.attributes.position.count / 3
}

/**
 * Bake a mesh into world-space geometry with skinning applied.
 * Critical for handshake — MeshSurfaceSampler on a SkinnedMesh otherwise
 * samples the bind pose and the hands fall apart.
 */
function bakeMeshWorldGeometry(mesh) {
  const src = mesh.geometry
  const pos = src.attributes.position
  const arr = new Float32Array(pos.count * 3)
  const v = new THREE.Vector3()

  mesh.updateMatrixWorld(true)
  if (mesh.isSkinnedMesh) mesh.skeleton.update()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    if (mesh.isSkinnedMesh) mesh.applyBoneTransform(i, v)
    v.applyMatrix4(mesh.matrixWorld)
    arr[i * 3] = v.x
    arr[i * 3 + 1] = v.y
    arr[i * 3 + 2] = v.z
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
  if (src.index) geo.setIndex(src.index.clone())
  else {
    // Non-indexed: sampler still works off triangle triples
  }
  geo.computeVertexNormals()
  return geo
}

function sampleWorldMeshes(entries, count, positions, colorFn) {
  const colors = new Float32Array(count * 3)
  const weights = entries.map((e) => meshWeight(e.mesh) || e.geo.attributes.position.count)
  const total = weights.reduce((a, b) => a + b, 0) || 1
  let offset = 0
  const tmp = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const color = new THREE.Color()

  for (let m = 0; m < entries.length; m++) {
    const { mesh, geo, hand } = entries[m]
    const share =
      m === entries.length - 1
        ? count - offset
        : Math.max(1, Math.round((weights[m] / total) * count))
    if (share <= 0) continue

    const proxy = new THREE.Mesh(geo)
    const sampler = new MeshSurfaceSampler(proxy).setWeightAttribute(null).build()
    for (let i = 0; i < share && offset + i < count; i++) {
      sampler.sample(tmp, normal)
      const i3 = (offset + i) * 3
      positions[i3] = tmp.x
      positions[i3 + 1] = tmp.y
      positions[i3 + 2] = tmp.z
      colorFn(color, hand, tmp)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    offset += share
    geo.dispose()
  }

  while (offset < count) {
    const src = (offset % Math.max(1, offset)) * 3
    positions[offset * 3] = positions[src]
    positions[offset * 3 + 1] = positions[src + 1]
    positions[offset * 3 + 2] = positions[src + 2]
    colors[offset * 3] = colors[src]
    colors[offset * 3 + 1] = colors[src + 1]
    colors[offset * 3 + 2] = colors[src + 2]
    offset++
  }

  return colors
}

function captureLocalSamples(meshes, count, weightFn) {
  const weights = meshes.map((mesh, i) => (weightFn ? weightFn(mesh, i) : meshWeight(mesh)))
  const total = weights.reduce((a, b) => a + b, 0) || 1
  const samples = []
  const tmp = new THREE.Vector3()
  const normal = new THREE.Vector3()

  for (let m = 0; m < meshes.length; m++) {
    const mesh = meshes[m]
    const share =
      m === meshes.length - 1
        ? count - samples.length
        : Math.max(1, Math.round((weights[m] / total) * count))
    if (share <= 0 || !mesh.geometry?.attributes?.position) continue
    const sampler = new MeshSurfaceSampler(mesh).setWeightAttribute(null).build()
    for (let i = 0; i < share && samples.length < count; i++) {
      sampler.sample(tmp, normal)
      samples.push({ mesh, local: tmp.clone() })
    }
  }
  while (samples.length < count) {
    const s = samples[samples.length % Math.max(1, samples.length)]
    samples.push(s || { mesh: meshes[0], local: new THREE.Vector3() })
  }
  return samples
}

function evaluateLocalSamples(samples, positions) {
  const tmp = new THREE.Vector3()
  for (let i = 0; i < samples.length; i++) {
    const { mesh, local } = samples[i]
    tmp.copy(local).applyMatrix4(mesh.matrixWorld)
    positions[i * 3] = tmp.x
    positions[i * 3 + 1] = tmp.y
    positions[i * 3 + 2] = tmp.z
  }
}

function bakeLogo() {
  console.log('\n— logo from', LOGO)
  const png = PNG.sync.read(fs.readFileSync(LOGO))
  const { width, height, data } = png
  const opaque = []
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const a = data[i + 3]
      const luma = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
      if (a > 50 && luma > 25) opaque.push([x, y, luma])
    }
  }
  if (opaque.length < 100) throw new Error('Logo sample too sparse — check ge-logo.png')

  const positions = new Float32Array(N * 3)
  const colors = new Float32Array(N * 3)
  const aspect = width / height

  // Bright foundry mark — stay in the hot end of the ramp so it reads on black
  const bright = [
    new THREE.Color('#ff8c1f'),
    new THREE.Color('#ffb43f'),
    new THREE.Color('#ffdc90'),
    new THREE.Color('#fff6e2'),
  ]

  for (let i = 0; i < N; i++) {
    const [x, y, luma] = opaque[Math.floor(Math.random() * opaque.length)]
    const u = (x + Math.random()) / width
    const v = (y + Math.random()) / height
    // Compact mark — sits beside hero copy, not over it
    positions[i * 3] = (u - 0.5) * 1.45 * aspect
    positions[i * 3 + 1] = (0.5 - v) * 1.45
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05

    const t = Math.min(1, Math.max(0, (luma - 30) / 200))
    const i0 = Math.min(bright.length - 2, Math.floor(t * (bright.length - 1)))
    const f = t * (bright.length - 1) - i0
    const c0 = bright[i0]
    const c1 = bright[i0 + 1]
    // Push toward the hot end so the mark reads on the dark foundry ground
    const boost = 1.12
    colors[i * 3] = Math.min(1, (c0.r + (c1.r - c0.r) * f) * boost)
    colors[i * 3 + 1] = Math.min(1, (c0.g + (c1.g - c0.g) * f) * boost)
    colors[i * 3 + 2] = Math.min(1, (c0.b + (c1.b - c0.b) * f) * boost)
  }

  normalizePositions(positions, 1.22)
  writeBin('logo.bin', positions)
  writeBin('logo_colors.bin', colors)
  writeBin('logo_sizes.bin', defaultSizes(N, 1.05, 1.75))
}

async function bakeForklift() {
  console.log('\n— forklift from', FORKLIFT)
  const gltf = await loadGltf(FORKLIFT)
  const clip =
    gltf.animations.find((a) => /upDownForwardBack/i.test(a.name)) || gltf.animations[0]
  if (!clip) throw new Error('Forklift has no animation clips')

  /*
   * Keep the GLB in model space (forks at −X). The runtime camera sits on an
   * elevated front-left 3/4 so the L-silhouette (mast + forks) reads clearly.
   * Oversample the fork/mast zone so those thin parts aren't lost in the cloud.
   */
  gltf.scene.updateMatrixWorld(true)

  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(clip)
  action.play()
  action.paused = true

  const meshes = collectMeshes(gltf.scene)
  // Pose with forks extended before classifying mesh zones
  action.time = clip.duration * 0.5
  mixer.update(0)
  gltf.scene.updateMatrixWorld(true)

  const worldBox = new THREE.Box3().setFromObject(gltf.scene)
  const minX = worldBox.min.x
  const spanX = worldBox.max.x - worldBox.min.x || 1
  const forkCut = minX + spanX * 0.26
  const mastCut = minX + spanX * 0.48
  const groundY = worldBox.min.y + (worldBox.max.y - worldBox.min.y) * 0.28

  const samples = captureLocalSamples(meshes, N, (mesh) => {
    let w = meshWeight(mesh)
    const box = new THREE.Box3().setFromObject(mesh)
    const cx = (box.min.x + box.max.x) / 2
    if (cx < forkCut) w *= 4.2
    else if (cx < mastCut) w *= 2.2
    // Wheels are dense discs — they steal the silhouette if over-sampled
    if (box.max.y < groundY && box.max.x - box.min.x < spanX * 0.22) w *= 0.5
    return Math.max(w, 1)
  })

  // Tag fork-region particles from first evaluate (stable across frames)
  const tagPos = new Float32Array(N * 3)
  evaluateLocalSamples(samples, tagPos)
  const isFork = new Uint8Array(N)
  for (let i = 0; i < N; i++) {
    isFork[i] = tagPos[i * 3] < forkCut ? 1 : 0
  }

  const framePositions = []
  let colors = null
  let sizes = null
  let norm = null
  // Start loop mid-clip so the held morph pose already shows forks extended
  const phase = clip.duration * 0.45

  for (let f = 0; f < FORKLIFT_FRAMES; f++) {
    action.time = (phase + (f / FORKLIFT_FRAMES) * clip.duration) % clip.duration
    mixer.update(0)
    gltf.scene.updateMatrixWorld(true)
    const positions = new Float32Array(N * 3)
    evaluateLocalSamples(samples, positions)

    if (!norm) {
      norm = computeNorm(positions, 2.5)
      colors = new Float32Array(N * 3)
      sizes = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        const y = (positions[i * 3 + 1] - norm.cy) * norm.s
        const tt = Math.min(1, Math.max(0, (y + 1.0) / 2.0))
        if (isFork[i]) {
          // Hot, bright forks — the recognition cue
          colors[i * 3] = 1.0
          colors[i * 3 + 1] = 0.78 + tt * 0.18
          colors[i * 3 + 2] = 0.28 + tt * 0.25
          sizes[i] = 1.2 + Math.random() * 0.55
        } else {
          // Body must stay readable, not a ghost behind hot wheels
          colors[i * 3] = 0.95 + tt * 0.05
          colors[i * 3 + 1] = 0.48 + tt * 0.4
          colors[i * 3 + 2] = 0.1 + tt * 0.28
          sizes[i] = 0.72 + Math.random() * 0.55
        }
      }
    }
    applyNorm(positions, norm)
    framePositions.push(positions)
    process.stdout.write(`  frame ${f + 1}/${FORKLIFT_FRAMES}\r`)
  }
  console.log(`  frame ${FORKLIFT_FRAMES}/${FORKLIFT_FRAMES}`)

  writeBin('forklift.bin', framePositions[0])
  const anim = new Float32Array(FORKLIFT_FRAMES * N * 3)
  for (let f = 0; f < FORKLIFT_FRAMES; f++) anim.set(framePositions[f], f * N * 3)
  writeBin('forklift_anim.bin', anim)
  writeBin('forklift_colors.bin', colors)
  writeBin('forklift_sizes.bin', sizes)
  fs.writeFileSync(
    path.join(OUT, 'forklift_meta.json'),
    JSON.stringify({ frames: FORKLIFT_FRAMES, count: N, duration: clip.duration, clip: clip.name }),
  )
}

async function bakeHandshake() {
  console.log('\n— handshake from', HANDSHAKE)
  const gltf = await loadGltf(HANDSHAKE)
  gltf.scene.updateMatrixWorld(true)

  const meshes = collectMeshes(gltf.scene)
  const entries = []

  for (const mesh of meshes) {
    const name = mesh.name || ''
    // Armature_22 / Object_7+10 = one figure; Armature001 / Object_34+37 = the other
    let hand = 'A'
    if (name === 'Object_34' || name === 'Object_37') hand = 'B'
    else if (name === 'Object_7' || name === 'Object_10') hand = 'A'
    else {
      const box = new THREE.Box3().setFromObject(mesh)
      const c = box.getCenter(new THREE.Vector3())
      hand = c.z >= 0.7 ? 'A' : 'B'
    }

    const geo = bakeMeshWorldGeometry(mesh)
    entries.push({ mesh, geo, hand })
    console.log('  baked', name, 'hand', hand, 'verts', geo.attributes.position.count)
  }

  const positions = new Float32Array(N * 3)
  const colors = sampleWorldMeshes(entries, N, positions, (color, hand) => {
    color.copy(hand === 'A' ? HAND_A : HAND_B)
    // Mild variation so it doesn't read as flat paint
    const j = 0.9 + Math.random() * 0.2
    color.r = Math.min(1, color.r * j)
    color.g = Math.min(1, color.g * j)
    color.b = Math.min(1, color.b * j)
  })

  normalizePositions(positions, 2.45)
  /*
   * Model is long in Z (arms toward/away from a +Z camera), so the default
   * view stacks the hands in depth and reads as "separate pieces". Rotate so
   * the clasp faces the camera the way the GLB looks in a viewer — slight
   * elevated side of the grip, both sleeves framing the meeting hands.
   */
  rotatePositions(positions, { x: -0.28, y: Math.PI * 0.5, z: 0.04 })
  normalizePositions(positions, 2.3)

  writeBin('handshake.bin', positions)
  writeBin('handshake_colors.bin', colors)
  writeBin('handshake_sizes.bin', defaultSizes(N, 0.7, 1.4))
}

bakeLogo()
await bakeForklift()
await bakeHandshake()
console.log('\nDone →', OUT)
