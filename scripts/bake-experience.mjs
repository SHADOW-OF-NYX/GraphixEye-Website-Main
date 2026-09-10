/**
 * Bake Experience page particle targets from warehouse + Haas press GLBs.
 * Runtime loads only the .bin files — source GLBs are not needed.
 *
 * Usage: node scripts/bake-experience.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
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
const OUT = path.join(ROOT, 'public', 'particle-targets', 'experience')
const WAREHOUSE = 'c:/Users/gauth/Downloads/sample_warehouse_-_revit.glb'
const HAAS = 'c:/Users/gauth/Downloads/the_haas-galinha_press.glb'

/** Must match FEELS.experience.count in CareerParticles.tsx */
const N = 34_000
const HAAS_FRAMES = 32

// Workshop brass ramp (linear)
const BRASS_LO = new THREE.Color().setRGB(0.35, 0.42, 0.22, THREE.SRGBColorSpace) // olive
const BRASS_MID = new THREE.Color().setRGB(0.72, 0.58, 0.28, THREE.SRGBColorSpace) // brass
const BRASS_HI = new THREE.Color().setRGB(0.95, 0.88, 0.7, THREE.SRGBColorSpace) // cream

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

function brassColor(out, t) {
  const x = Math.min(1, Math.max(0, t))
  if (x < 0.55) {
    const k = x / 0.55
    out.copy(BRASS_LO).lerp(BRASS_MID, k)
  } else {
    const k = (x - 0.55) / 0.45
    out.copy(BRASS_MID).lerp(BRASS_HI, k)
  }
  const j = 0.92 + Math.random() * 0.16
  out.r = Math.min(1, out.r * j)
  out.g = Math.min(1, out.g * j)
  out.b = Math.min(1, out.b * j)
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

function sampleMeshes(meshes, count, positions, colorFn) {
  const colors = new Float32Array(count * 3)
  const weights = meshes.map(meshWeight)
  const total = weights.reduce((a, b) => a + b, 0) || 1
  let offset = 0
  const tmp = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const color = new THREE.Color()

  for (let m = 0; m < meshes.length; m++) {
    const mesh = meshes[m]
    const share =
      m === meshes.length - 1
        ? count - offset
        : Math.max(1, Math.round((weights[m] / total) * count))
    if (share <= 0 || !mesh.geometry?.attributes?.position) continue
    const sampler = new MeshSurfaceSampler(mesh).setWeightAttribute(null).build()
    for (let i = 0; i < share && offset + i < count; i++) {
      sampler.sample(tmp, normal)
      tmp.applyMatrix4(mesh.matrixWorld)
      const i3 = (offset + i) * 3
      positions[i3] = tmp.x
      positions[i3 + 1] = tmp.y
      positions[i3 + 2] = tmp.z
      colorFn(color, tmp)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }
    offset += share
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

function captureLocalSamples(meshes, count) {
  const weights = meshes.map(meshWeight)
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

async function bakeWarehouse() {
  console.log('\n— warehouse from', WAREHOUSE)
  const gltf = await loadGltf(WAREHOUSE)
  /*
   * Revit sample shed — longest in Z. Elevated front-left 3/4 so facade depth
   * and roof volume read together (not a flat side strip).
   */
  gltf.scene.rotation.set(-0.38, 1.05, 0.03)
  gltf.scene.updateMatrixWorld(true)

  const meshes = collectMeshes(gltf.scene)
  const positions = new Float32Array(N * 3)
  const colors = sampleMeshes(meshes, N, positions, (color, p) => {
    const t = Math.min(1, Math.max(0, (p.y + 2) / 10))
    brassColor(color, 0.25 + t * 0.7)
    const boost = 1.15
    color.r = Math.min(1, color.r * boost)
    color.g = Math.min(1, color.g * boost)
    color.b = Math.min(1, color.b * boost)
  })

  normalizePositions(positions, 2.4)
  writeBin('warehouse.bin', positions)
  writeBin('warehouse_colors.bin', colors)
  writeBin('warehouse_sizes.bin', defaultSizes(N, 0.7, 1.45))
}

async function bakeHaasPress() {
  console.log('\n— Haas press from', HAAS)
  const gltf = await loadGltf(HAAS)
  const clip = gltf.animations[0]
  if (!clip) throw new Error('Haas press has no animation clips')

  /*
   * Tall letterpress. Classic product 3/4 — slightly elevated, whole machine in
   * frame (bed + frame + operating lever), not a cropped side fragment.
   */
  gltf.scene.rotation.set(-0.32, 0.88, 0.02)
  gltf.scene.updateMatrixWorld(true)

  const mixer = new THREE.AnimationMixer(gltf.scene)
  const action = mixer.clipAction(clip)
  action.play()
  action.paused = true

  const meshes = collectMeshes(gltf.scene)
  action.time = clip.duration * 0.35
  mixer.update(0)
  gltf.scene.updateMatrixWorld(true)
  const samples = captureLocalSamples(meshes, N)

  const framePositions = []
  let colors = null
  let norm = null

  for (let f = 0; f < HAAS_FRAMES; f++) {
    action.time = (f / HAAS_FRAMES) * clip.duration
    mixer.update(0)
    gltf.scene.updateMatrixWorld(true)
    const positions = new Float32Array(N * 3)
    evaluateLocalSamples(samples, positions)

    if (!norm) {
      norm = computeNorm(positions, 2.45)
      colors = new Float32Array(N * 3)
      const c = new THREE.Color()
      for (let i = 0; i < N; i++) {
        const y = (positions[i * 3 + 1] - norm.cy) * norm.s
        const t = Math.min(1, Math.max(0, (y + 1.1) / 2.2))
        brassColor(c, 0.35 + t * 0.65) // bias hot so the frame reads on black
        const boost = 1.28
        colors[i * 3] = Math.min(1, c.r * boost)
        colors[i * 3 + 1] = Math.min(1, c.g * boost)
        colors[i * 3 + 2] = Math.min(1, c.b * boost)
      }
    }
    applyNorm(positions, norm)
    framePositions.push(positions)
    process.stdout.write(`  frame ${f + 1}/${HAAS_FRAMES}\r`)
  }
  console.log(`  frame ${HAAS_FRAMES}/${HAAS_FRAMES}`)

  writeBin('haasPress.bin', framePositions[0])
  const anim = new Float32Array(HAAS_FRAMES * N * 3)
  for (let f = 0; f < HAAS_FRAMES; f++) anim.set(framePositions[f], f * N * 3)
  writeBin('haasPress_anim.bin', anim)
  writeBin('haasPress_colors.bin', colors)
  // Larger cores so thin levers / bed rails don't dissolve into grain
  writeBin('haasPress_sizes.bin', defaultSizes(N, 0.95, 1.75))
  fs.writeFileSync(
    path.join(OUT, 'haasPress_meta.json'),
    JSON.stringify({ frames: HAAS_FRAMES, count: N, duration: clip.duration, clip: clip.name }),
  )
}

await bakeWarehouse()
await bakeHaasPress()
console.log('\nDone →', OUT)
