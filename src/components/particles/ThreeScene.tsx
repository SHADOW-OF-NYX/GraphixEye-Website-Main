import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createNoise3D } from 'simplex-noise'
import {
  generateScatterPositions,
  generateXPositions,
  generateBonsaiPositions,
  generateHandPositions,
} from '../../lib/particles/shapes'
import { loadBakedTargets, sampleEyeBlink, type BakedTargets } from '../../lib/particles/loadTargets'
import { MORPH_HOLD } from '../../lib/particles/morphTiming'

gsap.registerPlugin(ScrollTrigger)

const N = 32_000
const noise3D = createNoise3D()

const VERTEX_SHADER = /* glsl */`
  uniform float uPixelRatio;
  uniform float uScale;
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  varying float vAlpha;
  varying vec3 vColor;
  varying float vIsSparkle;

  void main() {
    vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    float depthScale = uScale / max(-viewPosition.z, 0.001);
    gl_PointSize = aSize * uPixelRatio * depthScale;
    gl_PointSize = clamp(gl_PointSize, 0.5, 64.0);
    vAlpha = aAlpha;
    vColor = aColor;
    vIsSparkle = aSize > 4.8 ? 1.0 : 0.0;
  }
`

const FRAGMENT_SHADER = /* glsl */`
  varying float vAlpha;
  varying vec3 vColor;
  varying float vIsSparkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = (1.0 - smoothstep(0.22, 0.50, dist)) * vAlpha;

    if (vIsSparkle > 0.5) {
      float h = max(0.0, 1.0 - abs(uv.y) * 14.0) * max(0.0, 1.0 - abs(uv.x) * 2.2);
      float v = max(0.0, 1.0 - abs(uv.x) * 14.0) * max(0.0, 1.0 - abs(uv.y) * 2.2);
      float d1 = max(0.0, 1.0 - abs(uv.x + uv.y) * 10.0) * max(0.0, 1.0 - abs(uv.x - uv.y) * 3.0);
      float star = (h + v + d1 * 0.55) * vAlpha * 0.85;
      alpha = max(alpha, star);
    }

    gl_FragColor = vec4(vColor, alpha);
  }
`

type ShapeName = 'eye' | 'face' | 'holo' | 'quest' | 'bonsai'

const SHAPES: {
  name: ShapeName
  cameraX: number
  cameraY: number
  cameraZ: number
  lookX: number
  lookY: number
  fov: number
  cageOpa: number
  pinkBias: number
  bloom: number
  noiseAmp: number
}[] = [
  // Opening eye — centered
  { name: 'eye',    cameraX: 0.0,  cameraY: 0.05, cameraZ: 4.4, lookX: 0.0,  lookY: 0.0,  fov: 50, cageOpa: 0.12, pinkBias: 0.0,  bloom: 0.75, noiseAmp: 0.008 },
  // AI face — cam right so mesh sits left; copy on right
  { name: 'face',   cameraX: 0.72, cameraY: 0.08, cameraZ: 3.15, lookX: -0.25, lookY: 0.05, fov: 46, cageOpa: 0.06, pinkBias: 0.15, bloom: 0.7,  noiseAmp: 0.006 },
  // AR hologram — frontal portrait (ring above figure), model on right; copy on left
  { name: 'holo',   cameraX: -0.58, cameraY: -0.1,  cameraZ: 4.25, lookX: -0.58, lookY: 0.0,  fov: 45, cageOpa: 0.05, pinkBias: 0.2,  bloom: 0.85, noiseAmp: 0.008 },
  // VR Quest 3 — cam right so headset sits left; copy on right
  { name: 'quest',  cameraX: 0.65, cameraY: 0.02, cameraZ: 4.35, lookX: -0.2,  lookY: 0.02, fov: 48, cageOpa: 0.04, pinkBias: 0.55, bloom: 0.95, noiseAmp: 0.012 },
  // MR bonsai — cam right so tree sits left; copy on right
  { name: 'bonsai', cameraX: 0.95, cameraY: 0.1, cameraZ: 3.55, lookX: -0.48, lookY: -0.05, fov: 44, cageOpa: 0.13, pinkBias: 0.12, bloom: 0.55, noiseAmp: 0.008 },
]

function resolveShape(name: ShapeName, baked: BakedTargets | null): Float32Array {
  switch (name) {
    case 'eye':    return baked?.eye ?? generateHandPositions(N)
    case 'face':   return baked?.face ?? generateHandPositions(N)
    case 'holo':   return baked?.holo ?? generateXPositions(N)
    case 'quest':  return baked?.quest ?? generateXPositions(N)
    case 'bonsai': return baked?.bonsai ?? generateBonsaiPositions(N)
  }
}

function paintColors(colors: Float32Array, pinkBias: number) {
  for (let i = 0; i < N; i++) {
    const usePink = Math.random() < pinkBias
    if (usePink) {
      const t = Math.random()
      colors[i * 3]     = 0.83 + t * 0.10
      colors[i * 3 + 1] = 0.45 + t * 0.22
      colors[i * 3 + 2] = 0.88 + t * 0.08
    } else {
      const v = 0.92 + Math.random() * 0.08
      colors[i * 3] = v
      colors[i * 3 + 1] = v
      colors[i * 3 + 2] = v
    }
  }
}

function paintEyeRGB(colors: Float32Array, baked: Float32Array | null) {
  if (baked && baked.length === colors.length) {
    colors.set(baked)
    return
  }
  for (let i = 0; i < N; i++) {
    const roll = Math.random()
    if (roll < 0.34) {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.18; colors[i * 3 + 2] = 0.14
    } else if (roll < 0.68) {
      colors[i * 3] = 0.28; colors[i * 3 + 1] = 0.48; colors[i * 3 + 2] = 1
    } else {
      const v = 0.92 + Math.random() * 0.08
      colors[i * 3] = v; colors[i * 3 + 1] = v; colors[i * 3 + 2] = v
    }
  }
}

/** Particles tagged as pupil in the baked eye palette (deep blue, darker than iris). */
function buildEyePupilMask(colors: Float32Array | null, eyePos: Float32Array): Uint8Array {
  const mask = new Uint8Array(N)
  if (colors && colors.length === N * 3) {
    for (let i = 0; i < N; i++) {
      const i3 = i * 3
      const r = colors[i3]
      const g = colors[i3 + 1]
      const b = colors[i3 + 2]
      if (r < 0.14 && g < 0.22 && b > 0.38 && b < 0.72 && b > r * 2.2 && b > g * 1.6) {
        mask[i] = 1
      }
    }
    return mask
  }
  // Procedural fallback — center cluster of the open eye
  for (let i = 0; i < N; i++) {
    const i3 = i * 3
    const x = eyePos[i3]
    const y = eyePos[i3 + 1]
    if (Math.hypot(x, y) < 0.22 && Math.abs(eyePos[i3 + 2]) < 0.18) mask[i] = 1
  }
  return mask
}

function pupilVisibilityFromBlink(blink: number) {
  const t = Math.max(0, Math.min(1, blink))
  // Smooth out during close / reopen so the pupil hides before lids meet
  return 1 - t * t * (3 - 2 * t)
}

function easeInOut(t: number) {
  // Smootherstep — gentler accel/decel than quadratic ease
  const x = Math.max(0, Math.min(1, t))
  return x * x * x * (x * (x * 6 - 15) + 10)
}

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    const disposeList: Array<() => void> = []

    const init = async () => {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
      if (cancelled) return

      let baked: BakedTargets | null = null
      try {
        baked = await loadBakedTargets()
      } catch (err) {
        console.warn('[Expansions] baked targets missing, using procedural fallback', err)
      }
      if (cancelled) return

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      disposeList.push(() => renderer.dispose())

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(SHAPES[0].fov, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(SHAPES[0].cameraX, SHAPES[0].cameraY, SHAPES[0].cameraZ)
      const lookTarget = new THREE.Vector3(SHAPES[0].lookX, SHAPES[0].lookY, 0)
      camera.lookAt(lookTarget)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.15, 0.55, 0.12,
      )
      composer.addPass(bloomPass)
      disposeList.push(() => composer.dispose())
      bloomPass.strength = SHAPES[0].bloom

      // ── Prefetch all shape targets for scroll scrubbing ──────────────────
      const shapePos = SHAPES.map((s) => resolveShape(s.name, baked))
      const shapeColors = SHAPES.map((s) => {
        const c = new Float32Array(N * 3)
        if (s.name === 'eye') paintEyeRGB(c, baked?.eyeColors ?? null)
        else if (s.name === 'face' && baked?.faceColors) c.set(baked.faceColors)
        else if (s.name === 'face') paintEyeRGB(c, null)
        else if (s.name === 'holo' && baked?.holoColors) c.set(baked.holoColors)
        else if (s.name === 'holo') paintColors(c, 0.25)
        else if (s.name === 'quest' && baked?.questColors) c.set(baked.questColors)
        else if (s.name === 'bonsai' && baked?.bonsaiColors) c.set(baked.bonsaiColors)
        else paintColors(c, s.pinkBias)
        return c
      })

      const sizesDefault = new Float32Array(N)
      const sizesEye = new Float32Array(N)
      const sizesFace = new Float32Array(N)
      const sizesBonsai = new Float32Array(N)
      for (let i = 0; i < N; i++) {
        const sparkle = Math.random() < 0.055
        sizesDefault[i] = sparkle ? 5.0 + Math.random() * 2.2 : 1.4 + Math.random() * 3.2
        sizesEye[i] = 1.1 + Math.random() * 2.2
        if (Math.random() < 0.04) sizesEye[i] = 3.8 + Math.random() * 1.2
        sizesFace[i] = 1.0 + Math.random() * 1.8
        if (Math.random() < 0.035) sizesFace[i] = 3.2 + Math.random() * 1.1
        sizesBonsai[i] = 0.9 + Math.random() * 1.6
        if (Math.random() < 0.03) sizesBonsai[i] = 2.8 + Math.random() * 1.0
      }
      const shapeSizes = SHAPES.map((s) =>
        s.name === 'eye' ? sizesEye
          : s.name === 'face' || s.name === 'holo' || s.name === 'quest' ? sizesFace
          : s.name === 'bonsai' ? sizesBonsai
          : sizesDefault,
      )

      const posArr = new Float32Array(N * 3)
      const eyeLive = new Float32Array(N * 3)
      const sizes = new Float32Array(N)
      const alphas = new Float32Array(N)
      const colorsArr = new Float32Array(N * 3)
      const baseAlphas = new Float32Array(N)

      // Face leave/fade loop state — stagnant mesh, then particles drift off and die
      const facePhase = new Float32Array(N)
      const faceDirX = new Float32Array(N)
      const faceDirY = new Float32Array(N)
      const faceDirZ = new Float32Array(N)
      const faceSpeed = new Float32Array(N)
      const faceLeave = new Uint8Array(N) // 1 = this particle participates in leave cycle
      const faceHome = shapePos[SHAPES.findIndex((s) => s.name === 'face')] ?? shapePos[1]
      for (let i = 0; i < N; i++) {
        const i3 = i * 3
        const hx = faceHome[i3], hy = faceHome[i3 + 1], hz = faceHome[i3 + 2]
        const len = Math.hypot(hx, hy, hz) || 1
        // Outward from face center + noise
        faceDirX[i] = hx / len + (Math.random() - 0.5) * 0.55
        faceDirY[i] = hy / len + (Math.random() - 0.5) * 0.55
        faceDirZ[i] = hz / len + (Math.random() - 0.5) * 0.35
        const dlen = Math.hypot(faceDirX[i], faceDirY[i], faceDirZ[i]) || 1
        faceDirX[i] /= dlen
        faceDirY[i] /= dlen
        faceDirZ[i] /= dlen
        faceSpeed[i] = 0.35 + Math.random() * 0.55
        facePhase[i] = Math.random() // stagger the loop
        faceLeave[i] = Math.random() < 0.38 ? 1 : 0 // keep silhouette; ~38% peel off
        baseAlphas[i] = 0.38 + Math.random() * 0.55
      }

      const initScatter = generateScatterPositions(N)
      posArr.set(initScatter)
      sizes.set(sizesEye)
      alphas.set(baseAlphas)
      paintEyeRGB(colorsArr, baked?.eyeColors ?? null)
      if (baked?.eye) eyeLive.set(baked.eye)
      const eyePupilMask = buildEyePupilMask(baked?.eyeColors ?? null, shapePos[0])

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
      geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1))
      geometry.setAttribute('aColor', new THREE.BufferAttribute(colorsArr, 3))
      disposeList.push(() => geometry.dispose())

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
          uScale: { value: 3.0 },
        },
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        transparent: true,
      })
      disposeList.push(() => material.dispose())

      const points = new THREE.Points(geometry, material)
      scene.add(points)

      // ── Wireframe cage ───────────────────────────────────────────────────
      const cageGeo = new THREE.BoxGeometry(2.6, 3.2, 1.6)
      const cageEdges = new THREE.EdgesGeometry(cageGeo)
      const gridLines: number[] = []
      const gx = 2.6 / 2, gy = 3.2 / 2, gz = 1.6 / 2
      for (let r = 1; r < 6; r++) {
        const y = -gy + (r / 6) * 3.2
        gridLines.push(-gx, y, gz, gx, y, gz)
      }
      for (let c = 1; c < 5; c++) {
        const x = -gx + (c / 5) * 2.6
        gridLines.push(x, -gy, gz, x, gy, gz)
      }
      for (let r = 1; r < 5; r++) {
        const y = -gy + (r / 5) * 3.2
        gridLines.push(gx, y, -gz, gx, y, gz)
        gridLines.push(-gx, y, -gz, -gx, y, gz)
      }

      const gridExtra = new THREE.BufferGeometry()
      gridExtra.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gridLines), 3))

      const cageMat = new THREE.LineBasicMaterial({
        color: 0xc4a0e8,
        transparent: true,
        opacity: SHAPES[0].cageOpa,
      })
      const gridMat = new THREE.LineBasicMaterial({
        color: 0x96b4dc,
        transparent: true,
        opacity: SHAPES[0].cageOpa * 0.5,
      })

      const cage = new THREE.LineSegments(cageEdges, cageMat)
      const cageGrid = new THREE.LineSegments(gridExtra, gridMat)
      cage.rotation.x = -0.06
      cage.rotation.y = 0.08
      cageGrid.rotation.copy(cage.rotation)
      scene.add(cage)
      scene.add(cageGrid)

      disposeList.push(() => {
        cageGeo.dispose(); cageEdges.dispose(); gridExtra.dispose()
        cageMat.dispose(); gridMat.dispose()
      })

      const mouse = { x: 0, y: 0 }
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1
        mouse.y = (e.clientY / window.innerHeight) * 2 - 1
      }
      window.addEventListener('mousemove', onMouseMove)
      disposeList.push(() => window.removeEventListener('mousemove', onMouseMove))

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)
      disposeList.push(() => window.removeEventListener('resize', onResize))

      // ── Scroll-driven morph state ────────────────────────────────────────
      // target = raw ScrollTrigger progress; display = eased catch-up for smoother morphs
      const scrollState = { target: 0, display: 0 }
      let entryDone = false
      let entryProgress = 0
      const entryFrom = initScatter
      const entryTo = shapePos[0]

      // Intro: scatter → eye, then hand off to scroll
      const entryTween = gsap.to({ t: 0 }, {
        t: 1,
        duration: 2.4,
        delay: 0.5,
        ease: 'power3.inOut',
        onUpdate() {
          entryProgress = (this.targets()[0] as { t: number }).t
        },
        onComplete() {
          entryDone = true
          entryProgress = 1
          posArr.set(shapePos[0])
          colorsArr.set(shapeColors[0])
          sizes.set(shapeSizes[0])
          geometry.attributes.aColor.needsUpdate = true
          geometry.attributes.aSize.needsUpdate = true
        },
      })
      disposeList.push(() => entryTween.kill())

      gsap.fromTo(canvas, { opacity: 0 }, { opacity: 1, duration: 2.0, ease: 'power1.inOut' })

      // Wait for morph track in DOM (page may hydrate after canvas mounts)
      const bindScroll = () => {
        const track = document.getElementById('morph-track')
        if (!track) {
          requestAnimationFrame(bindScroll)
          return
        }
        const st = ScrollTrigger.create({
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          // Higher scrub = more lag → morph eases after the wheel stops
          scrub: 1.6,
          onUpdate: (self) => {
            scrollState.target = self.progress
          },
        })
        disposeList.push(() => st.kill())
      }
      bindScroll()

      // Eye blink while resting near start of scroll
      const EYE_OPEN = 3.8
      const EYE_CLOSE = 0.65
      const EYE_SHUT = 0.3
      const EYE_REOPEN = 0.85
      const EYE_SETTLE = 1.15
      const EYE_TOTAL = EYE_OPEN + EYE_CLOSE + EYE_SHUT + EYE_REOPEN + EYE_SETTLE
      let eyeHoldClock = 0

      const blinkAmount = (t: number) => {
        if (t < EYE_OPEN) return 0
        if (t < EYE_OPEN + EYE_CLOSE) return (t - EYE_OPEN) / EYE_CLOSE
        if (t < EYE_OPEN + EYE_CLOSE + EYE_SHUT) return 1
        const reopenAt = EYE_OPEN + EYE_CLOSE + EYE_SHUT
        if (t < reopenAt + EYE_REOPEN) return 1 - (t - reopenAt) / EYE_REOPEN
        return 0
      }

      const v1 = new THREE.Vector3(1, 1, 1)
      const clock = new THREE.Clock()
      let elapsed = 0
      let rafId = 0
      let lastI0 = 0

      const applySegmentVisuals = (i0: number, i1: number, localT: number) => {
        const a = SHAPES[i0]
        const b = SHAPES[i1]
        const u = easeInOut(localT)
        const catchUp = 0.075

        const tx = a.cameraX + (b.cameraX - a.cameraX) * u
        const ty = a.cameraY + (b.cameraY - a.cameraY) * u
        const tz = a.cameraZ + (b.cameraZ - a.cameraZ) * u
        const lx = a.lookX + (b.lookX - a.lookX) * u
        const ly = a.lookY + (b.lookY - a.lookY) * u
        const fov = a.fov + (b.fov - a.fov) * u

        // Ride framing + light mouse parallax on top
        camera.position.x += (tx + mouse.x * 0.14 - camera.position.x) * catchUp
        camera.position.y += (ty + -mouse.y * 0.1 - camera.position.y) * catchUp
        camera.position.z += (tz - camera.position.z) * catchUp
        lookTarget.x += (lx - lookTarget.x) * catchUp
        lookTarget.y += (ly - lookTarget.y) * catchUp
        camera.lookAt(lookTarget)

        if (Math.abs(camera.fov - fov) > 0.05) {
          camera.fov += (fov - camera.fov) * catchUp
          camera.updateProjectionMatrix()
        }

        bloomPass.strength += ((a.bloom + (b.bloom - a.bloom) * u) - bloomPass.strength) * 0.055
        cageMat.opacity += ((a.cageOpa + (b.cageOpa - a.cageOpa) * u) - cageMat.opacity) * 0.055
        gridMat.opacity = cageMat.opacity * 0.5
      }

      const tick = () => {
        rafId = requestAnimationFrame(tick)
        const delta = clock.getDelta()
        elapsed += delta

        cage.rotation.y = 0.08 + Math.sin(elapsed * 0.25) * 0.04
        cage.rotation.x = -0.06 + Math.cos(elapsed * 0.2) * 0.02
        cageGrid.rotation.copy(cage.rotation)

        const t = elapsed * 0.55
        const nShapes = SHAPES.length

        // Resolve current/next shape from scroll (or entry intro)
        let i0 = 0
        let i1 = 0
        let localT = 0
        let holdingEye = false

        if (!entryDone) {
          i0 = 0
          i1 = 0
          localT = 0
          applySegmentVisuals(0, 0, 0)
          const u = easeInOut(entryProgress)
          for (let i = 0; i < N; i++) {
            const i3 = i * 3
            const bx = entryFrom[i3] + (entryTo[i3] - entryFrom[i3]) * u
            const by = entryFrom[i3 + 1] + (entryTo[i3 + 1] - entryFrom[i3 + 1]) * u
            const bz = entryFrom[i3 + 2] + (entryTo[i3 + 2] - entryFrom[i3 + 2]) * u
            const amp = 0.02
            posArr[i3] = bx + noise3D(bx * 0.9 + t, by * 0.9, bz * 0.9) * amp
            posArr[i3 + 1] = by + noise3D(bx * 0.9, by * 0.9 + t, bz * 0.9) * amp
            posArr[i3 + 2] = bz + noise3D(bx * 0.9, by * 0.9, bz * 0.9 + t) * amp * 0.7
          }
          geometry.attributes.position.needsUpdate = true
          composer.render()
          return
        }

        // Ease display progress toward scroll target (extra inertia beyond scrub)
        scrollState.display += (scrollState.target - scrollState.display) * Math.min(1, delta * 3.2)
        const p = scrollState.display
        // Share with service titles so labels track the same damped morph clock
        ;(window as unknown as { __morphProgress?: number }).__morphProgress = p

        // Equal dwell per shape; morph across most of each slice (hold briefly, then glide)
        const raw = p * nShapes
        i0 = Math.min(Math.floor(raw), nShapes - 1)
        const local = raw - Math.floor(raw)
        const morphStart = MORPH_HOLD
        if (i0 >= nShapes - 1) {
          i1 = i0
          localT = 0
        } else if (local < morphStart) {
          i1 = i0
          localT = 0
        } else {
          i1 = i0 + 1
          localT = (local - morphStart) / (1 - morphStart)
        }

        applySegmentVisuals(i0, i1, localT)

        // Soft color / size crossfade
        if (i0 !== lastI0 || localT < 0.98) {
          const u = easeInOut(localT)
          const c0 = shapeColors[i0]
          const c1 = shapeColors[i1]
          const s0 = shapeSizes[i0]
          const s1 = shapeSizes[i1]
          for (let i = 0; i < N * 3; i++) {
            colorsArr[i] = c0[i] + (c1[i] - c0[i]) * u
          }
          for (let i = 0; i < N; i++) {
            sizes[i] = s0[i] + (s1[i] - s0[i]) * u
          }
          geometry.attributes.aColor.needsUpdate = true
          geometry.attributes.aSize.needsUpdate = true
        }
        lastI0 = i0

        // Blink only while parked on eye (start of track)
        holdingEye =
          SHAPES[i0].name === 'eye' &&
          localT < 0.08 &&
          !!baked?.eyeBlink &&
          baked.eyeBlink.length === 3

        const holdingFace = SHAPES[i0].name === 'face' && localT < 0.12
        const faceBlend =
          (SHAPES[i0].name === 'face' ? 1 - localT : 0) +
          (SHAPES[i1].name === 'face' ? localT : 0)

        if (holdingEye) {
          eyeHoldClock += delta
          if (eyeHoldClock > EYE_TOTAL) eyeHoldClock = 0
          sampleEyeBlink(baked!.eyeBlink, blinkAmount(eyeHoldClock), eyeLive)
        } else {
          eyeHoldClock = 0
        }

        const pupilVis = holdingEye ? pupilVisibilityFromBlink(blinkAmount(eyeHoldClock)) : 1

        const from = shapePos[i0]
        const to = shapePos[i1]
        const u = easeInOut(localT)
        const noiseAmp =
          SHAPES[i0].noiseAmp + (SHAPES[i1].noiseAmp - SHAPES[i0].noiseAmp) * u

        // Face leave loop: settle on mesh → peel outward → fade → respawn
        const FACE_SETTLE = 0.42
        const FACE_DIST = 1.85
        if (holdingFace) {
          for (let i = 0; i < N; i++) {
            facePhase[i] += delta * faceSpeed[i] * 0.42
            if (facePhase[i] >= 1) facePhase[i] -= 1
          }
        } else if (faceBlend < 0.02) {
          // Reset when fully off the face beat
          for (let i = 0; i < N; i++) {
            alphas[i] = baseAlphas[i]
            if (facePhase[i] > FACE_SETTLE) facePhase[i] = Math.random() * FACE_SETTLE
          }
        }

        for (let i = 0; i < N; i++) {
          const i3 = i * 3
          let bx: number, by: number, bz: number
          if (holdingEye) {
            bx = eyeLive[i3]
            by = eyeLive[i3 + 1]
            bz = eyeLive[i3 + 2]
          } else {
            bx = from[i3] + (to[i3] - from[i3]) * u
            by = from[i3 + 1] + (to[i3 + 1] - from[i3 + 1]) * u
            bz = from[i3 + 2] + (to[i3 + 2] - from[i3 + 2]) * u
          }

          if (holdingFace && faceLeave[i]) {
            const phase = facePhase[i]
            if (phase < FACE_SETTLE) {
              // Stagnant on mesh
              alphas[i] = baseAlphas[i]
            } else {
              const leaveT = (phase - FACE_SETTLE) / (1 - FACE_SETTLE)
              const ease = leaveT * leaveT * (3 - 2 * leaveT)
              const dist = FACE_DIST * ease
              bx += faceDirX[i] * dist
              by += faceDirY[i] * dist
              bz += faceDirZ[i] * dist
              alphas[i] = baseAlphas[i] * (1 - ease)
            }
          } else if (holdingFace) {
            alphas[i] = baseAlphas[i]
          } else if (holdingEye && eyePupilMask[i]) {
            alphas[i] = baseAlphas[i] * pupilVis
          } else if (faceBlend > 0.01 && faceLeave[i] && facePhase[i] > FACE_SETTLE) {
            // Softly wind down leave during morph away
            const leaveT = Math.min(1, (facePhase[i] - FACE_SETTLE) / (1 - FACE_SETTLE))
            const ease = leaveT * leaveT * (3 - 2 * leaveT) * faceBlend
            bx += faceDirX[i] * FACE_DIST * ease
            by += faceDirY[i] * FACE_DIST * ease
            bz += faceDirZ[i] * FACE_DIST * ease
            alphas[i] = baseAlphas[i] * (1 - ease * 0.85)
          } else {
            alphas[i] = baseAlphas[i]
          }

          const amp = holdingEye || holdingFace ? noiseAmp * 0.2 : noiseAmp
          posArr[i3] = bx + noise3D(bx * 0.9 + t, by * 0.9, bz * 0.9) * amp
          posArr[i3 + 1] = by + noise3D(bx * 0.9, by * 0.9 + t, bz * 0.9) * amp
          posArr[i3 + 2] = bz + noise3D(bx * 0.9, by * 0.9, bz * 0.9 + t) * amp * 0.7
        }
        geometry.attributes.position.needsUpdate = true
        geometry.attributes.aAlpha.needsUpdate = true

        // Gentle motion accents per shape
        const holoW =
          (SHAPES[i0].name === 'holo' ? 1 - localT : 0) +
          (SHAPES[i1].name === 'holo' ? localT : 0)
        const bonsaiW =
          (SHAPES[i0].name === 'bonsai' ? 1 - localT : 0) +
          (SHAPES[i1].name === 'bonsai' ? localT : 0)

        if (holdingEye) {
          points.rotation.y = Math.sin(eyeHoldClock * 0.35) * 0.06
          points.rotation.x *= 0.95
          points.scale.lerp(v1, 0.06)
        } else if (holdingFace) {
          points.rotation.y = Math.sin(elapsed * 0.22) * 0.04
          points.rotation.x *= 0.96
          points.scale.lerp(v1, 0.06)
        } else if (holoW > 0.01) {
          // Subtle hover — keep the portrait pose readable like the reference
          points.rotation.y = Math.sin(elapsed * 0.16) * 0.022 * holoW
          points.rotation.x = Math.sin(elapsed * 0.12) * 0.01 * holoW
          points.scale.setScalar(1 + Math.sin(elapsed * 0.85) * 0.008 * holoW)
        } else if (bonsaiW > 0.01) {
          points.rotation.y = Math.sin(elapsed * 0.35) * 0.06 * bonsaiW
          points.rotation.x *= 0.95
          points.scale.setScalar(1 + Math.sin(elapsed * 1.2) * 0.015 * bonsaiW)
        } else {
          points.rotation.y *= 0.95
          points.rotation.x *= 0.95
          points.scale.lerp(v1, 0.06)
        }

        composer.render()
      }

      tick()
      disposeList.push(() => cancelAnimationFrame(rafId))
    }

    init().catch(console.error)

    return () => {
      cancelled = true
      disposeList.forEach((fn) => fn())
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full block"
      style={{ zIndex: 0, opacity: 0 }}
    />
  )
}
