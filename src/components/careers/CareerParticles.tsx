import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createNoise3D } from 'simplex-noise';
import { loadVendorBaked, type VendorBakedId } from '../../lib/particles/loadVendors';
import { loadExperienceBaked, type ExperienceBakedId } from '../../lib/particles/loadExperience';

gsap.registerPlugin(ScrollTrigger);

export type SceneVariant =
  // Careers
  | 'ring'
  | 'wave'
  | 'galaxy'
  | 'helix'
  | 'vortex'
  // Vendors — procedural
  | 'lattice'
  | 'lanes'
  | 'orbit'
  | 'stack'
  | 'converge'
  // Vendors — baked from logo / GLBs (see scripts/bake-vendors.mjs)
  | 'logo'
  | 'forklift'
  | 'handshake'
  // Experience — factory visit / craft process
  | 'press'
  | 'sheet'
  | 'die'
  | 'path'
  | 'seal'
  // Experience — baked warehouse + Haas press (see scripts/bake-experience.mjs)
  | 'warehouse'
  | 'haasPress';

const TAU = Math.PI * 2;
const noise3D = createNoise3D();

/*
 * Three identities share this renderer. A palette is an ordered ramp, darkest
 * first, so every builder indexes the same seven positions and a page can swap
 * its whole colour identity with one prop. Values keep their authored
 * brightness — additive blending plus bloom on a dark ground is what turns
 * them into glow, so darkening them here would only dim the effect.
 */
export type PaletteName = 'careers' | 'vendors' | 'experience';

interface Palette {
  ramp: THREE.Color[];
  white: THREE.Color;
}

const hexRamp = (hexes: string[]) => hexes.map((h) => new THREE.Color(h));

const PALETTES: Record<PaletteName, Palette> = {
  // Careers — the original cool spectrum, climbing from deep blue to hot red
  careers: {
    ramp: hexRamp(['#2563eb', '#4d86ff', '#8b7cff', '#b57cff', '#d946ef', '#ff5f7a', '#ff4d3d']),
    white: new THREE.Color('#ffffff'),
  },
  /*
   * Vendors — a foundry pour: copper through amber to white-hot. Like the
   * Careers ramp, even the "dark" end has to carry real luminance; additive
   * blending has nothing to subtract from, so a near-black stop renders as
   * absence rather than as shadow.
   */
  vendors: {
    ramp: hexRamp(['#b4400a', '#e0651a', '#ff8c1f', '#ffa93a', '#ffc65c', '#ffdc90', '#fff0c8']),
    white: new THREE.Color('#fff6e2'),
  },
  /*
   * Experience — workshop brass: olive through warm brass into cream. Bridged
   * to the site's sand/cream end without borrowing Careers cool or Vendors copper.
   */
  experience: {
    ramp: hexRamp(['#6b8f3a', '#8a9a42', '#a89b4a', '#c4a85a', '#d4b87a', '#e8d9a0', '#f5f0dc']),
    white: new THREE.Color('#faf6eb'),
  },
};

/*
 * How particles behave — not just what colour they are. Three pages sharing
 * one soft-dot + bloom recipe will always feel like the same effect with
 * different costumes. Each feel owns the shader, density, bloom curve, and
 * the kind of motion that sits on top of the shape builders.
 */
type DriftMode = 'nebula' | 'spark' | 'grain';

interface Feel {
  /** Point budget for this page. */
  count: number;
  fragmentShader: string;
  bloomRadius: number;
  bloomThreshold: number;
  /** Multiplier on per-shape bloom strength. */
  bloomMul: number;
  noiseSpeed: number;
  noiseScale: number;
  /** Size oscillation amplitude (0 = still). */
  twinkle: number;
  /** Brief alpha flicker (0 = steady). Foundry sparks. */
  sparkle: number;
  drift: DriftMode;
  /** Morph hold fraction — higher = shapes sit longer before dissolving. */
  morphHold: number;
  /** How quickly displayed scroll catches the target. */
  morphCatchup: number;
}

const FEELS: Record<PaletteName, Feel> = {
  /*
   * Careers — nebula. Soft round glow, heavy bloom, organic drift, twinkle.
   * Reads as a living cosmos rather than a point cloud of dots.
   */
  careers: {
    count: 28_000,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float a = pow(smoothstep(0.5, 0.0, d), 1.35);
        gl_FragColor = vec4(vColor, a * uAlpha);
      }
    `,
    bloomRadius: 0.78,
    bloomThreshold: 0.02,
    bloomMul: 1.15,
    noiseSpeed: 0.28,
    noiseScale: 0.85,
    twinkle: 0.22,
    sparkle: 0,
    drift: 'nebula',
    morphHold: 0.22,
    morphCatchup: 2.6,
  },
  /*
   * Vendors — foundry sparks. Hard cores, cross flecks, snap-flicker, axial
   * pour motion. Discrete and hot — not a soft wash of the same dots.
   */
  vendors: {
    count: 16_000,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float core = smoothstep(0.16, 0.0, d);
        float halo = pow(smoothstep(0.5, 0.0, d), 3.2);
        float cross =
          max(1.0 - abs(c.x) * 7.0, 0.0) * max(1.0 - abs(c.y) * 1.8, 0.0) +
          max(1.0 - abs(c.y) * 7.0, 0.0) * max(1.0 - abs(c.x) * 1.8, 0.0);
        float a = core + halo * 0.28 + cross * 0.55;
        gl_FragColor = vec4(vColor, clamp(a, 0.0, 1.0) * uAlpha);
      }
    `,
    bloomRadius: 0.38,
    bloomThreshold: 0.14,
    bloomMul: 1.05,
    noiseSpeed: 0.55,
    noiseScale: 1.15,
    twinkle: 0.08,
    sparkle: 0.45,
    drift: 'spark',
    morphHold: 0.3,
    morphCatchup: 4.2,
  },
  /*
   * Experience — craft dust. Elongated grain/fiber points, restrained bloom,
   * slow settling drift. Feels like paper dust in a shaft of workshop light.
   */
  experience: {
    count: 34_000,
    fragmentShader: /* glsl */ `
      uniform float uAlpha;
      varying vec3 vColor;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        // Stretch into a soft fiber rather than a round glow
        c.y *= 2.6;
        float d = length(c);
        if (d > 0.5) discard;
        float a = smoothstep(0.5, 0.08, d);
        gl_FragColor = vec4(vColor * 0.92, a * uAlpha);
      }
    `,
    bloomRadius: 0.32,
    bloomThreshold: 0.2,
    bloomMul: 0.72,
    noiseSpeed: 0.12,
    noiseScale: 1.4,
    twinkle: 0.05,
    sparkle: 0,
    drift: 'grain',
    morphHold: 0.34,
    morphCatchup: 2.0,
  },
};

type Stop = [number, THREE.Color];
const tmp = new THREE.Color();

function ramp(stops: Stop[], t: number): THREE.Color {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, c0] = stops[i];
    const [p1, c1] = stops[i + 1];
    if (x >= p0 && x <= p1) {
      const k = p1 === p0 ? 0 : (x - p0) / (p1 - p0);
      return tmp.copy(c0).lerp(c1, k);
    }
  }
  return tmp.copy(stops[stops.length - 1][1]);
}

interface Built {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  /** Optional looping position frames (forklift). */
  animFrames?: Float32Array[];
  animDuration?: number;
}

type ProceduralVariant = Exclude<
  SceneVariant,
  'logo' | 'forklift' | 'handshake' | 'warehouse' | 'haasPress'
>;
const BAKED_VENDOR = new Set<SceneVariant>(['logo', 'forklift', 'handshake']);
const BAKED_EXPERIENCE = new Set<SceneVariant>(['warehouse', 'haasPress']);

interface ShapeConfig {
  camera: { x: number; y: number; z: number; lookX: number; lookY: number; lookZ: number; fov: number };
  bloom: number;
  pointScale: number;
  alpha: number;
  noiseAmp: number;
  /** Static tilt applied to the point cloud */
  rotX: number;
  /** Continuous spin rate (radians/sec) */
  spinY: number;
  spinZ: number;
  /** 1 enables the rolling terrain motion used by the wave */
  wave: number;
}

/* ─────────────── Shape builders — every shape emits exactly N points
   so positions/colors/sizes can be lerped attribute-for-attribute ─────────────── */

function buildRing(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const R = 1.06;
  const r = 0.3;
  const BANDS = 46;
  const stops: Stop[] = [
    [0.0, P.ramp[0]],
    [0.22, P.ramp[1]],
    [0.45, P.ramp[2]],
    [0.62, P.ramp[4]],
    [0.8, P.ramp[5]],
    [1.0, P.ramp[6]],
  ];

  for (let i = 0; i < n; i++) {
    const theta = Math.random() * TAU;
    const band = Math.floor(Math.random() * BANDS) / BANDS;
    const phi = band * TAU + (Math.random() - 0.5) * 0.045;

    const rr = R + r * Math.cos(phi);
    const y = rr * Math.sin(theta);

    positions[i * 3] = rr * Math.cos(theta);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = r * Math.sin(phi) * 0.85;

    const c = ramp(stops, (y / (R + r) + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.75 + Math.random() * 0.85;
  }

  return { positions, colors, sizes };
}

function buildWave(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const cols = 220;
  const rows = Math.ceil(n / cols);
  const W = 8.0;
  const NEAR_Z = 0.5;
  const FAR_Z = -4.6;
  const stops: Stop[] = [
    [0.0, P.ramp[0]],
    [0.24, P.ramp[1]],
    [0.5, P.ramp[2]],
    [0.72, P.ramp[4]],
    [1.0, P.ramp[6]],
  ];

  for (let i = 0; i < n; i++) {
    const cx = i % cols;
    const cz = Math.floor(i / cols);

    const x = (cx / (cols - 1) - 0.5) * W + (Math.random() - 0.5) * 0.015;
    const z = NEAR_Z + (cz / Math.max(1, rows - 1)) * (FAR_Z - NEAR_Z) + (Math.random() - 0.5) * 0.015;

    positions[i * 3] = x;
    positions[i * 3 + 1] = -0.55;
    positions[i * 3 + 2] = z;

    const c = ramp(stops, cx / (cols - 1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.55 + Math.random() * 0.6;
  }

  return { positions, colors, sizes };
}

function buildGalaxy(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.white],
    [0.18, P.ramp[5]],
    [0.42, P.ramp[4]],
    [0.68, P.ramp[2]],
    [1.0, P.ramp[1]],
  ];

  const coreCount = Math.round(n * 0.2);
  const ringCount = 5;
  const remaining = n - coreCount;
  const perRing = Math.floor(remaining / ringCount);

  let i = 0;

  for (let k = 0; k < coreCount; k++, i++) {
    const rr = Math.pow(Math.random(), 2.4) * 0.34;
    const a = Math.random() * TAU;
    positions[i * 3] = Math.cos(a) * rr;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 2] = Math.sin(a) * rr * 0.9;

    const c = ramp(stops, (rr / 0.34) * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = 0.7 + Math.random() * 0.9;
  }

  for (let ring = 0; ring < ringCount; ring++) {
    // Last ring absorbs the rounding remainder so we always land on exactly n
    const take = ring === ringCount - 1 ? n - i : perRing;
    const radius = 0.62 + ring * 0.29;

    for (let k = 0; k < take; k++, i++) {
      const a = Math.random() * TAU;
      const rr = radius + (Math.random() - 0.5) * 0.05;

      positions[i * 3] = Math.cos(a) * rr;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.035;
      positions[i * 3 + 2] = Math.sin(a) * rr * 0.9;

      const c = ramp(stops, 0.25 + (ring / (ringCount - 1)) * 0.75);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.5 + Math.random() * 0.6;
    }
  }

  return { positions, colors, sizes };
}

function buildHelix(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const H = 5.4;
  const radius = 0.46;
  const turns = 4.2;
  const stops: Stop[] = [
    [0.0, P.ramp[1]],
    [0.35, P.ramp[2]],
    [0.6, P.ramp[3]],
    [1.0, P.white],
  ];

  const strandPts = Math.round(n * 0.38);
  let i = 0;

  for (let strand = 0; strand < 2; strand++) {
    const offset = strand * Math.PI;
    for (let k = 0; k < strandPts; k++, i++) {
      const u = k / strandPts;
      const a = u * turns * TAU + offset;

      positions[i * 3] = Math.cos(a) * radius + (Math.random() - 0.5) * 0.055;
      positions[i * 3 + 1] = (u - 0.5) * H + (Math.random() - 0.5) * 0.02;
      positions[i * 3 + 2] = Math.sin(a) * radius + (Math.random() - 0.5) * 0.055;

      const c = ramp(stops, 0.35 + Math.random() * 0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.6 + Math.random() * 0.8;
    }
  }

  for (; i < n; i++) {
    const u = Math.random();
    const a = u * turns * TAU;
    const t = Math.random();

    positions[i * 3] =
      THREE.MathUtils.lerp(Math.cos(a), Math.cos(a + Math.PI), t) * radius + (Math.random() - 0.5) * 0.03;
    positions[i * 3 + 1] = (u - 0.5) * H + (Math.random() - 0.5) * 0.02;
    positions[i * 3 + 2] =
      THREE.MathUtils.lerp(Math.sin(a), Math.sin(a + Math.PI), t) * radius + (Math.random() - 0.5) * 0.03;

    const c = ramp(stops, 0.15 + Math.random() * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = 0.45 + Math.random() * 0.5;
  }

  return { positions, colors, sizes };
}

function buildVortex(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[0]],
    [0.25, P.ramp[1]],
    [0.5, P.ramp[2]],
    [0.75, P.ramp[4]],
    [1.0, P.ramp[6]],
  ];

  const inner = 0.62;
  const outer = 3.3;

  for (let i = 0; i < n; i++) {
    const rr = inner + Math.pow(Math.random(), 0.62) * (outer - inner);
    const a = Math.random() * TAU;
    const x = Math.cos(a) * rr;

    positions[i * 3] = x;
    positions[i * 3 + 1] = Math.sin(a) * rr * 0.82;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;

    const c = ramp(stops, (x / outer + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    const edge = Math.min(1, (rr - inner) / 0.5);
    sizes[i] = (0.5 + Math.random() * 0.8) * (0.45 + edge * 0.55);
  }

  return { positions, colors, sizes };
}

/* ── Vendor shapes: a supply language rather than the Careers cosmos ── */

const CUBE_CORNERS: Array<[number, number, number]> = [
  [-1, -1, -1],
  [1, -1, -1],
  [1, 1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
  [1, -1, 1],
  [1, 1, 1],
  [-1, 1, 1],
];

const CUBE_EDGES: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

/**
 * Nested wireframe cubes — structure and stock, crated up.
 *
 * A filled lattice was the first attempt and it failed: spreading the budget
 * through a solid volume gives no silhouette and no clear centre, so it reads
 * as haze. Confining every point to the twelve edges of three shells puts the
 * same count on ~36 lines, which is what makes them read as drawn, and leaves
 * the middle open for the hero copy the way the Careers ring does.
 */
function buildLattice(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[1]],
    [0.32, P.ramp[3]],
    [0.66, P.ramp[5]],
    [1.0, P.ramp[6]],
  ];

  // Each shell turns a little further, so the frames never line up flat
  const SHELLS = [
    { half: 1.5, spin: 0.0 },
    { half: 1.14, spin: 0.34 },
    { half: 0.8, spin: 0.68 },
  ];

  for (let i = 0; i < n; i++) {
    const shell = SHELLS[i % SHELLS.length];
    const [a, b] = CUBE_EDGES[Math.floor(Math.random() * CUBE_EDGES.length)];
    const t = Math.random();

    const ca = CUBE_CORNERS[a];
    const cb = CUBE_CORNERS[b];
    const s = shell.half;

    const x0 = (ca[0] + (cb[0] - ca[0]) * t) * s;
    const y = (ca[1] + (cb[1] - ca[1]) * t) * s;
    const z0 = (ca[2] + (cb[2] - ca[2]) * t) * s;

    const cs = Math.cos(shell.spin);
    const sn = Math.sin(shell.spin);

    const jitter = 0.014;
    positions[i * 3] = x0 * cs - z0 * sn + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
    positions[i * 3 + 2] = x0 * sn + z0 * cs + (Math.random() - 0.5) * jitter;

    const c = ramp(stops, (y / 1.5 + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.5 + Math.random() * 0.7;
  }

  return { positions, colors, sizes };
}

/** Parallel supply lanes running to the horizon, each at its own depth. */
function buildLanes(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[0]],
    [0.28, P.ramp[2]],
    [0.66, P.ramp[4]],
    [1.0, P.ramp[6]],
  ];

  const LANES = 9;
  const NEAR_Z = 0.9;
  const FAR_Z = -5.2;

  for (let i = 0; i < n; i++) {
    const lane = Math.floor(Math.random() * LANES);
    const u = Math.random();

    // Lanes fan slightly outward as they approach the camera
    const spread = 0.24 + (1 - u) * 0.34;
    const x = (lane - (LANES - 1) / 2) * spread;
    const z = FAR_Z + u * (NEAR_Z - FAR_Z);

    positions[i * 3] = x + (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 1] = -0.42 + (Math.random() - 0.5) * 0.06;
    positions[i * 3 + 2] = z;

    const c = ramp(stops, u);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = (0.35 + Math.random() * 0.7) * (0.4 + u * 0.6);
  }

  return { positions, colors, sizes };
}

/** Concentric orbits — a supplier network circling one floor. */
function buildOrbit(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.white],
    [0.2, P.ramp[6]],
    [0.5, P.ramp[4]],
    [1.0, P.ramp[1]],
  ];

  const RINGS = 7;
  const core = Math.floor(n * 0.16);

  for (let i = 0; i < n; i++) {
    if (i < core) {
      // Dense core — the factory itself
      const rr = Math.pow(Math.random(), 2.2) * 0.28;
      const a = Math.random() * TAU;
      positions[i * 3] = Math.cos(a) * rr;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      positions[i * 3 + 2] = Math.sin(a) * rr;

      const c = ramp(stops, (rr / 0.28) * 0.22);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.6 + Math.random() * 0.9;
      continue;
    }

    const ring = Math.floor(Math.random() * RINGS);
    const radius = 0.55 + (ring / (RINGS - 1)) * 1.5;
    const a = Math.random() * TAU;
    // Each orbit tilts a little more than the last
    const tilt = (ring / RINGS) * 0.5;
    const rr = radius + (Math.random() - 0.5) * 0.045;

    const x = Math.cos(a) * rr;
    const z = Math.sin(a) * rr;
    positions[i * 3] = x;
    positions[i * 3 + 1] = z * Math.sin(tilt) + (Math.random() - 0.5) * 0.03;
    positions[i * 3 + 2] = z * Math.cos(tilt);

    const c = ramp(stops, 0.24 + (ring / (RINGS - 1)) * 0.76);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.4 + Math.random() * 0.7;
  }

  return { positions, colors, sizes };
}

/** Stacked strata — inventory on the rack, layer over layer. */
function buildStack(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[1]],
    [0.4, P.ramp[3]],
    [0.72, P.ramp[5]],
    [1.0, P.white],
  ];

  const LAYERS = 11;
  // Height is bounded by what the stack camera can frame — see CONFIG.stack
  const H = 3.2;
  const half = 1.05;

  for (let i = 0; i < n; i++) {
    const layer = Math.floor(Math.random() * LAYERS);
    const u = layer / (LAYERS - 1);
    // Slabs shrink as they rise, so the stack reads as a tapered column
    const w = half * (1 - u * 0.42);

    const edge = Math.random();
    let x: number;
    let z: number;
    if (edge < 0.5) {
      x = (Math.random() - 0.5) * 2 * w;
      z = (Math.random() < 0.5 ? -1 : 1) * w;
    } else {
      x = (Math.random() < 0.5 ? -1 : 1) * w;
      z = (Math.random() - 0.5) * 2 * w;
    }

    positions[i * 3] = x + (Math.random() - 0.5) * 0.03;
    positions[i * 3 + 1] = (u - 0.5) * H + (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.03;

    const c = ramp(stops, u);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.4 + Math.random() * 0.65;
  }

  return { positions, colors, sizes };
}

/** Many streams drawing into one point — every lane feeds one floor. */
function buildConverge(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.white],
    [0.22, P.ramp[6]],
    [0.55, P.ramp[3]],
    [1.0, P.ramp[0]],
  ];

  const STREAMS = 12;

  for (let i = 0; i < n; i++) {
    const stream = Math.floor(Math.random() * STREAMS);
    const a = (stream / STREAMS) * TAU;
    // t=0 at the hub, t=1 out at the rim
    const t = Math.pow(Math.random(), 0.7);
    const rr = t * 2.9;
    // Streams curl as they run outward
    const swirl = a + t * 0.9;

    positions[i * 3] = Math.cos(swirl) * rr + (Math.random() - 0.5) * 0.07 * t;
    positions[i * 3 + 1] = Math.sin(swirl) * rr * 0.84 + (Math.random() - 0.5) * 0.07 * t;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

    const c = ramp(stops, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Brightest and densest at the hub
    sizes[i] = (0.4 + Math.random() * 0.7) * (1.05 - t * 0.5);
  }

  return { positions, colors, sizes };
}

/* ── Experience shapes: press floor language rather than cosmos or foundry ── */

/**
 * Press cylinders — three rollers seen end-on. Circles in the YZ plane with a
 * short extrusion in X; gaps between radii keep them as three machines, not
 * one haze.
 */
function buildPress(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[2]],
    [0.4, P.ramp[4]],
    [0.75, P.ramp[5]],
    [1.0, P.ramp[6]],
  ];

  const ROLLERS = [
    { y: -1.15, r: 0.55 },
    { y: 0.0, r: 0.78 },
    { y: 1.15, r: 0.48 },
  ];
  const DEPTH = 0.55;

  for (let i = 0; i < n; i++) {
    const roller = ROLLERS[i % ROLLERS.length];
    const a = Math.random() * TAU;
    // Shell-biased radius so the rim carries the silhouette
    const rr = roller.r * (0.72 + Math.pow(Math.random(), 0.45) * 0.28);
    const x = (Math.random() - 0.5) * DEPTH;

    positions[i * 3] = x;
    positions[i * 3 + 1] = roller.y + Math.sin(a) * rr;
    positions[i * 3 + 2] = Math.cos(a) * rr;

    const c = ramp(stops, (rr / roller.r) * 0.7 + Math.random() * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    const rim = rr / roller.r;
    sizes[i] = (0.45 + Math.random() * 0.7) * (0.7 + rim * 0.45);
  }

  return { positions, colors, sizes };
}

/** A stock sheet with a soft curl at the leading edge. */
function buildSheet(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[0]],
    [0.4, P.ramp[3]],
    [0.75, P.ramp[5]],
    [1.0, P.white],
  ];

  const W = 3.2;
  const D = 2.4;

  for (let i = 0; i < n; i++) {
    const u = Math.random();
    const v = Math.random();
    const x = (u - 0.5) * W;
    const z = (v - 0.5) * D;
    // Curl lifts the near edge slightly — a sheet coming off the press
    const curl = Math.pow(Math.max(0, u - 0.55) / 0.45, 1.6) * 0.55;

    positions[i * 3] = x;
    positions[i * 3 + 1] = curl + (Math.random() - 0.5) * 0.02;
    positions[i * 3 + 2] = z;

    const c = ramp(stops, u * 0.7 + v * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Heavier on the edge so the silhouette holds
    const edge = Math.min(u, 1 - u, v, 1 - v) < 0.04 ? 1.35 : 1;
    sizes[i] = (0.4 + Math.random() * 0.65) * edge;
  }

  return { positions, colors, sizes };
}

/**
 * Nested die outlines — a cut silhouette. Confined to edges of concentric
 * rounded rectangles so the middle stays open for copy.
 */
function buildDie(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[2]],
    [0.45, P.ramp[4]],
    [1.0, P.ramp[6]],
  ];

  const SHELLS = [
    { hw: 1.55, hh: 1.05, r: 0.22 },
    { hw: 1.15, hh: 0.78, r: 0.16 },
    { hw: 0.72, hh: 0.48, r: 0.1 },
  ];

  for (let i = 0; i < n; i++) {
    const shellIdx = i % SHELLS.length;
    const shell = SHELLS[shellIdx];
    const { hw, hh, r } = shell;
    // Perimeter length of a rounded rect (approx)
    const straightX = 2 * (hw - r);
    const straightY = 2 * (hh - r);
    const arcs = TAU * r;
    const peri = 2 * straightX + 2 * straightY + arcs;
    let s = Math.random() * peri;

    let x = 0;
    let y = 0;
    // Walk the perimeter: bottom, right, top, left, with corner arcs
    const bottom = straightX;
    const br = bottom + (Math.PI / 2) * r;
    const right = br + straightY;
    const tr = right + (Math.PI / 2) * r;
    const top = tr + straightX;
    const tl = top + (Math.PI / 2) * r;
    const left = tl + straightY;

    if (s < bottom) {
      x = -hw + r + s;
      y = -hh;
    } else if (s < br) {
      const a = -Math.PI / 2 + (s - bottom) / r;
      x = hw - r + Math.cos(a) * r;
      y = -hh + r + Math.sin(a) * r;
    } else if (s < right) {
      x = hw;
      y = -hh + r + (s - br);
    } else if (s < tr) {
      const a = 0 + (s - right) / r;
      x = hw - r + Math.cos(a) * r;
      y = hh - r + Math.sin(a) * r;
    } else if (s < top) {
      x = hw - r - (s - tr);
      y = hh;
    } else if (s < tl) {
      const a = Math.PI / 2 + (s - top) / r;
      x = -hw + r + Math.cos(a) * r;
      y = hh - r + Math.sin(a) * r;
    } else if (s < left) {
      x = -hw;
      y = hh - r - (s - tl);
    } else {
      const a = Math.PI + (s - left) / r;
      x = -hw + r + Math.cos(a) * r;
      y = -hh + r + Math.sin(a) * r;
    }

    positions[i * 3] = x + (Math.random() - 0.5) * 0.012;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.012;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

    const shellT = shellIdx / (SHELLS.length - 1);
    const c = ramp(stops, shellT);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.5 + Math.random() * 0.7;
  }

  return { positions, colors, sizes };
}

/** Waypoints on a production path — stations linked by a soft arc. */
function buildPath(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.ramp[1]],
    [0.35, P.ramp[3]],
    [0.7, P.ramp[5]],
    [1.0, P.white],
  ];

  const STATIONS = 5;
  const core = Math.floor(n * 0.28);

  for (let i = 0; i < n; i++) {
    if (i < core) {
      // Dense station nodes
      const station = Math.floor(Math.random() * STATIONS);
      const t = station / (STATIONS - 1);
      const cx = (t - 0.5) * 3.4;
      const cy = Math.sin(t * Math.PI) * 0.55;
      const rr = Math.pow(Math.random(), 1.8) * 0.22;
      const a = Math.random() * TAU;

      positions[i * 3] = cx + Math.cos(a) * rr;
      positions[i * 3 + 1] = cy + Math.sin(a) * rr * 0.7;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.12;

      const c = ramp(stops, t);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.55 + Math.random() * 0.85;
      continue;
    }

    // Arc between stations
    const t = Math.random();
    const x = (t - 0.5) * 3.4;
    const y = Math.sin(t * Math.PI) * 0.55 + (Math.random() - 0.5) * 0.06;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

    const c = ramp(stops, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = 0.35 + Math.random() * 0.55;
  }

  return { positions, colors, sizes };
}

/** A stamp seal — concentric rings with a dense core, for the visit CTA. */
function buildSeal(n: number, P: Palette): Built {
  const positions = new Float32Array(n * 3);
  const colors = new Float32Array(n * 3);
  const sizes = new Float32Array(n);

  const stops: Stop[] = [
    [0.0, P.white],
    [0.25, P.ramp[6]],
    [0.55, P.ramp[4]],
    [1.0, P.ramp[1]],
  ];

  const RINGS = 5;
  const core = Math.floor(n * 0.18);

  for (let i = 0; i < n; i++) {
    if (i < core) {
      const rr = Math.pow(Math.random(), 2.4) * 0.32;
      const a = Math.random() * TAU;
      positions[i * 3] = Math.cos(a) * rr;
      positions[i * 3 + 1] = Math.sin(a) * rr;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

      const c = ramp(stops, rr / 0.32 * 0.2);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      sizes[i] = 0.55 + Math.random() * 0.8;
      continue;
    }

    const ring = Math.floor(Math.random() * RINGS);
    const radius = 0.55 + (ring / (RINGS - 1)) * 1.35;
    const a = Math.random() * TAU;
    const rr = radius + (Math.random() - 0.5) * 0.04;

    positions[i * 3] = Math.cos(a) * rr;
    positions[i * 3 + 1] = Math.sin(a) * rr;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

    const c = ramp(stops, 0.25 + (ring / (RINGS - 1)) * 0.75);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
    sizes[i] = 0.4 + Math.random() * 0.65;
  }

  return { positions, colors, sizes };
}

const BUILDERS: Record<ProceduralVariant, (n: number, P: Palette) => Built> = {
  ring: buildRing,
  wave: buildWave,
  galaxy: buildGalaxy,
  helix: buildHelix,
  vortex: buildVortex,
  lattice: buildLattice,
  lanes: buildLanes,
  orbit: buildOrbit,
  stack: buildStack,
  converge: buildConverge,
  press: buildPress,
  sheet: buildSheet,
  die: buildDie,
  path: buildPath,
  seal: buildSeal,
};

const CONFIG: Record<SceneVariant, ShapeConfig> = {
  ring: {
    camera: { x: 0, y: 0, z: 3.3, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.15,
    pointScale: 3.0,
    alpha: 0.6,
    noiseAmp: 0.012,
    rotX: 0,
    spinY: 0,
    spinZ: 0.045,
    wave: 0,
  },
  wave: {
    camera: { x: 0, y: 0.34, z: 2.2, lookX: 0, lookY: -0.5, lookZ: -1.4, fov: 55 },
    bloom: 0.95,
    pointScale: 2.4,
    alpha: 0.55,
    noiseAmp: 0.006,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 1,
  },
  galaxy: {
    camera: { x: 0, y: 0.72, z: 3.0, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.3,
    pointScale: 2.6,
    alpha: 0.55,
    noiseAmp: 0.01,
    rotX: -0.5,
    spinY: 0.07,
    spinZ: 0,
    wave: 0,
  },
  helix: {
    camera: { x: 0, y: 0, z: 3.6, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.15,
    pointScale: 2.8,
    alpha: 0.6,
    noiseAmp: 0.012,
    rotX: 0,
    spinY: 0.22,
    spinZ: 0,
    wave: 0,
  },
  vortex: {
    camera: { x: 0, y: 0, z: 3.2, lookX: 0, lookY: 0, lookZ: 0, fov: 50 },
    bloom: 1.05,
    pointScale: 2.6,
    alpha: 0.6,
    noiseAmp: 0.014,
    rotX: 0,
    spinY: 0,
    spinZ: -0.05,
    wave: 0,
  },

  /*
   * Vendor scenes. Snappier spins; the spark feel already carries the heat —
   * keep noiseAmp modest so the hard cores stay readable.
   */
  lattice: {
    /*
     * Distance is set by the nearest corner, not the centre. The outer shell's
     * front face sits ~2.1 units closer than the origin once rotated, and at
     * this fov that face is what breaks the frame first.
     */
    camera: { x: 0, y: 0, z: 6.8, lookX: 0, lookY: 0, lookZ: 0, fov: 42 },
    bloom: 1.35,
    pointScale: 3.8,
    alpha: 0.68,
    noiseAmp: 0.006,
    rotX: -0.2,
    spinY: 0.05,
    spinZ: 0,
    wave: 0,
  },
  lanes: {
    camera: { x: 0, y: 0.3, z: 2.1, lookX: 0, lookY: -0.42, lookZ: -1.6, fov: 58 },
    bloom: 1.15,
    pointScale: 3.2,
    alpha: 0.62,
    noiseAmp: 0.005,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  orbit: {
    camera: { x: 0, y: 0.9, z: 3.3, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.3,
    pointScale: 3.4,
    alpha: 0.62,
    noiseAmp: 0.01,
    rotX: -0.42,
    spinY: 0.06,
    spinZ: 0,
    wave: 0,
  },
  stack: {
    // Frames a 3.2-tall column with margin once the near face is accounted for
    camera: { x: 0, y: 0, z: 5.2, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.25,
    pointScale: 3.6,
    alpha: 0.65,
    noiseAmp: 0.007,
    rotX: 0,
    spinY: 0.14,
    spinZ: 0,
    wave: 0,
  },
  converge: {
    camera: { x: 0, y: 0, z: 3.1, lookX: 0, lookY: 0, lookZ: 0, fov: 50 },
    bloom: 1.2,
    pointScale: 3.3,
    alpha: 0.65,
    noiseAmp: 0.012,
    rotX: 0,
    spinY: 0,
    spinZ: 0.04,
    wave: 0,
  },

  /*
   * Baked Vendor models. Low noise so the logo / forklift / handshake silhouettes
   * hold — sparkle still comes from the vendors feel shader.
   */
  logo: {
    camera: { x: 0.35, y: 0.05, z: 4.2, lookX: 0.15, lookY: 0.02, lookZ: 0, fov: 36 },
    bloom: 1.75,
    pointScale: 5.2,
    alpha: 0.95,
    noiseAmp: 0.0008,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  forklift: {
    // Classic product 3/4: slightly elevated front-left, L-silhouette clear
    camera: { x: -2.15, y: 1.3, z: 3.45, lookX: 0.0, lookY: -0.12, lookZ: 0, fov: 36 },
    bloom: 1.25,
    pointScale: 4.5,
    alpha: 0.92,
    noiseAmp: 0.0008,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  handshake: {
    camera: { x: 0, y: 0.15, z: 3.9, lookX: 0, lookY: 0.02, lookZ: 0, fov: 38 },
    bloom: 1.4,
    pointScale: 3.8,
    alpha: 0.8,
    noiseAmp: 0.0012,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },

  /*
   * Experience scenes. Quiet motion — a walkthrough of craft, not a cosmos
   * or a pour. Cameras leave room in the centre for the factory-visit copy.
   * Finer pointScale so the grain feel reads as dust, not soft nebula blobs.
   */
  press: {
    camera: { x: 0, y: 0, z: 4.4, lookX: 0, lookY: 0, lookZ: 0, fov: 42 },
    bloom: 1.05,
    pointScale: 2.2,
    alpha: 0.55,
    noiseAmp: 0.005,
    rotX: 0,
    spinY: 0.04,
    spinZ: 0,
    wave: 0,
  },
  sheet: {
    camera: { x: 0, y: 1.1, z: 3.4, lookX: 0, lookY: 0.1, lookZ: 0, fov: 48 },
    bloom: 0.9,
    pointScale: 1.9,
    alpha: 0.5,
    noiseAmp: 0.005,
    rotX: -0.55,
    spinY: 0.03,
    spinZ: 0,
    wave: 0,
  },
  die: {
    camera: { x: 0, y: 0, z: 4.0, lookX: 0, lookY: 0, lookZ: 0, fov: 44 },
    bloom: 1.0,
    pointScale: 2.15,
    alpha: 0.55,
    noiseAmp: 0.005,
    rotX: 0,
    spinY: 0.05,
    spinZ: 0,
    wave: 0,
  },
  path: {
    camera: { x: 0, y: 0.2, z: 4.4, lookX: 0, lookY: 0.15, lookZ: 0, fov: 46 },
    bloom: 0.95,
    pointScale: 2.0,
    alpha: 0.52,
    noiseAmp: 0.007,
    rotX: -0.08,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  seal: {
    camera: { x: 0, y: 0, z: 3.4, lookX: 0, lookY: 0, lookZ: 0, fov: 48 },
    bloom: 1.0,
    pointScale: 2.05,
    alpha: 0.55,
    noiseAmp: 0.009,
    rotX: 0,
    spinY: 0,
    spinZ: 0.035,
    wave: 0,
  },

  /*
   * Baked Experience models. Static framing; Haas keeps its baked animation.
   * No spin so the warehouse / press silhouette stays designed.
   */
  warehouse: {
    // Pulled back elevated 3/4 — shed sits as a floor hero under the title
    camera: { x: 0.2, y: 1.05, z: 5.5, lookX: 0, lookY: -0.2, lookZ: 0, fov: 32 },
    bloom: 1.15,
    pointScale: 3.2,
    alpha: 0.8,
    noiseAmp: 0.001,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  haasPress: {
    // Full machine product shot — denser/brighter so the frame reads as steel
    camera: { x: 0.35, y: 0.75, z: 5.3, lookX: 0, lookY: 0.05, lookZ: 0, fov: 34 },
    bloom: 1.55,
    pointScale: 4.4,
    alpha: 0.95,
    noiseAmp: 0.0004,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
};

/*
 * gl_PointSize is in PHYSICAL pixels. Dividing a tuned scale by view depth keeps
 * dots around 1–3 CSS px; the clamp stops near-camera points from ballooning and
 * blowing the additive blend out to white. Bloom supplies the glow instead.
 */
const VERTEX_SHADER = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uScale;
  uniform float uDpr;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float ps = aSize * uScale * uDpr / max(-mv.z, 0.15);
    gl_PointSize = clamp(ps, 0.5, 5.0 * uDpr);
    gl_Position = projectionMatrix * mv;
  }
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ease with a flat hold at each end so shapes sit fully formed before morphing. */
function holdEase(u: number, hold: number): number {
  const h = hold;
  const x = Math.max(0, Math.min(1, (u - h) / Math.max(1e-6, 1 - 2 * h)));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

async function resolveShape(variant: SceneVariant, n: number, P: Palette): Promise<Built> {
  if (BAKED_VENDOR.has(variant)) {
    const baked = await loadVendorBaked(variant as VendorBakedId);
    return {
      positions: baked.positions,
      colors: baked.colors,
      sizes: baked.sizes,
      animFrames: baked.animFrames,
      animDuration: baked.animDuration,
    };
  }
  if (BAKED_EXPERIENCE.has(variant)) {
    const baked = await loadExperienceBaked(variant as ExperienceBakedId);
    return {
      positions: baked.positions,
      colors: baked.colors,
      sizes: baked.sizes,
      animFrames: baked.animFrames,
      animDuration: baked.animDuration,
    };
  }
  return BUILDERS[variant as ProceduralVariant](n, P);
}

/** Write an animated shape's positions for time t into `out`. */
function sampleAnimPositions(shape: Built, time: number, out: Float32Array) {
  const frames = shape.animFrames;
  if (!frames || frames.length === 0) {
    out.set(shape.positions);
    return;
  }
  const dur = shape.animDuration || 2.67;
  const u = ((time % dur) / dur) * frames.length;
  const i0 = Math.floor(u) % frames.length;
  const i1 = (i0 + 1) % frames.length;
  const f = u - Math.floor(u);
  const a = frames[i0];
  const b = frames[i1];
  for (let i = 0; i < out.length; i++) {
    out[i] = a[i] + (b[i] - a[i]) * f;
  }
}

interface Props {
  /** One variant renders a static scene; several morph across scroll. */
  variants: SceneVariant[];
  /** Colour identity for this page. */
  palette?: PaletteName;
  /** CSS selector for the scroll track that drives the morph. */
  scrollTrack?: string;
  className?: string;
}

export default function CareerParticles({
  variants,
  palette = 'careers',
  scrollTrack,
  className = '',
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || variants.length === 0) return;

    let cancelled = false;
    const cleanup: Array<() => void> = [];

    const init = async () => {
      const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js');
      if (cancelled) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const P = PALETTES[palette];
      const feel = FEELS[palette];
      const N = feel.count;
      const shapes = await Promise.all(variants.map((v) => resolveShape(v, N, P)));
      if (cancelled) return;
      const configs = variants.map((v) => CONFIG[v]);
      const multi = shapes.length > 1;
      // Scratch buffers for animated shapes (forklift) during the morph blend
      const animA = new Float32Array(N * 3);
      const animB = new Float32Array(N * 3);

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);
      host.appendChild(renderer.domElement);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      cleanup.push(() => {
        renderer.dispose();
        if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      });

      const scene = new THREE.Scene();
      const c0 = configs[0].camera;
      const camera = new THREE.PerspectiveCamera(c0.fov, 1, 0.1, 100);
      camera.position.set(c0.x, c0.y, c0.z);
      const lookTarget = new THREE.Vector3(c0.lookX, c0.lookY, c0.lookZ);
      camera.lookAt(lookTarget);

      // Live buffers — start as a copy of the first shape, then morph in place
      const positions = new Float32Array(shapes[0].positions);
      const colors = new Float32Array(shapes[0].colors);
      const sizes = new Float32Array(shapes[0].sizes);

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      cleanup.push(() => geometry.dispose());

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uScale: { value: configs[0].pointScale },
          uDpr: { value: dpr },
          uAlpha: { value: configs[0].alpha },
        },
        vertexShader: VERTEX_SHADER,
        fragmentShader: feel.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      cleanup.push(() => material.dispose());

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Bloom is what makes the particles read as bright rather than dim —
      // radius and threshold are per-feel so pages don't share one glow recipe.
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(host.clientWidth || 1, host.clientHeight || 1),
        configs[0].bloom * feel.bloomMul,
        feel.bloomRadius,
        feel.bloomThreshold,
      );
      composer.addPass(bloomPass);
      cleanup.push(() => composer.dispose());

      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        bloomPass.resolution.set(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(host);
      cleanup.push(() => ro.disconnect());

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '200px' });
      io.observe(host);
      cleanup.push(() => io.disconnect());

      // ── Scroll-driven morph state (mirrors the Expansions approach) ──
      const scrollState = { target: 0, display: 0 };

      if (multi && scrollTrack) {
        const bind = () => {
          if (cancelled) return;
          const track = document.querySelector(scrollTrack);
          if (!track) {
            requestAnimationFrame(bind);
            return;
          }
          const st = ScrollTrigger.create({
            trigger: track as HTMLElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.4,
            onUpdate: (self) => {
              scrollState.target = self.progress;
            },
          });
          cleanup.push(() => st.kill());
        };
        bind();
      }

      let frame = 0;
      let last = performance.now();
      let spinY = 0;
      let spinZ = 0;

      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible) {
          last = performance.now();
          return;
        }

        const now = performance.now();
        const delta = Math.min(0.05, (now - last) / 1000);
        last = now;
        const t = reduced ? 0 : now / 1000;
        const nt = t * feel.noiseSpeed;

        // Ease the displayed progress toward the scroll target for softer morphs
        scrollState.display +=
          (scrollState.target - scrollState.display) * Math.min(1, delta * feel.morphCatchup);

        let ai = 0;
        let bi = 0;
        let u = 0;

        if (multi) {
          const nShapes = shapes.length;
          /*
           * The track spans (nShapes - 1) scroll units: progress 0 sits on the
           * first section and 1 on the last, so shape i is fully formed at
           * p = i / (nShapes - 1) — keeping each shape aligned with its section.
           */
          const seg = scrollState.display * (nShapes - 1);
          ai = Math.max(0, Math.min(nShapes - 2, Math.floor(seg)));
          bi = ai + 1;
          u = holdEase(Math.max(0, Math.min(1, seg - ai)), feel.morphHold);
        }

        const A = shapes[ai];
        const B = shapes[bi];
        const ca = configs[ai];
        const cb = configs[bi];

        const noiseAmp = lerp(ca.noiseAmp, cb.noiseAmp, u) * feel.noiseScale;
        const waveAmt = lerp(ca.wave, cb.wave, u);

        const Apos = A.animFrames ? (sampleAnimPositions(A, t, animA), animA) : A.positions;
        const Bpos = B.animFrames ? (sampleAnimPositions(B, t, animB), animB) : B.positions;

        // Blend positions + colours + sizes, then add feel-specific motion
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;

          const bx = lerp(Apos[i3], Bpos[i3], u);
          const by = lerp(Apos[i3 + 1], Bpos[i3 + 1], u);
          const bz = lerp(Apos[i3 + 2], Bpos[i3 + 2], u);

          let nx = 0;
          let ny = 0;
          let nz = 0;

          if (waveAmt > 0.001) {
            ny +=
              waveAmt *
              (Math.sin(bx * 1.55 + t * 0.5) * 0.115 +
                Math.sin(bz * 2.15 - t * 0.38) * 0.085 +
                Math.sin((bx + bz) * 1.05 + t * 0.27) * 0.07);
          }

          if (feel.drift === 'nebula') {
            // Soft isotropic swirl — cosmic, no preferred axis
            nx = noise3D(bx * 0.9, by * 0.9, bz * 0.9 + nt) * noiseAmp;
            ny += noise3D(by * 0.9, bz * 0.9, bx * 0.9 + nt) * noiseAmp;
            nz = noise3D(bz * 0.9, bx * 0.9, by * 0.9 + nt) * noiseAmp;
          } else if (feel.drift === 'spark') {
            // Axial pour + upward flicker — sparks rising off a pour
            nx = noise3D(bx * 1.4, by * 0.5, nt * 1.2) * noiseAmp * 1.6;
            ny +=
              noise3D(by * 0.7, bz * 0.7, nt * 1.6) * noiseAmp * 0.45 +
              Math.sin(nt * 4.5 + i * 0.13) * noiseAmp * 0.55;
            nz = noise3D(bz * 1.1, bx * 0.6, nt) * noiseAmp * 0.35;
          } else {
            // Grain — slow settle, slight lateral drift like dust in workshop air
            nx = noise3D(bx * 0.55, bz * 0.55, nt * 0.6) * noiseAmp * 0.55;
            ny +=
              noise3D(by * 0.4, bx * 0.4, nt * 0.5) * noiseAmp * 0.35 -
              Math.sin(nt * 0.7 + bx * 1.2) * noiseAmp * 0.25;
            nz = noise3D(bz * 0.55, by * 0.55, nt * 0.6) * noiseAmp * 0.45;
          }

          positions[i3] = bx + nx;
          positions[i3 + 1] = by + ny;
          positions[i3 + 2] = bz + nz;

          let cr = lerp(A.colors[i3], B.colors[i3], u);
          let cg = lerp(A.colors[i3 + 1], B.colors[i3 + 1], u);
          let cbCol = lerp(A.colors[i3 + 2], B.colors[i3 + 2], u);

          if (feel.sparkle > 0) {
            const flicker =
              1 +
              feel.sparkle *
                Math.max(0, Math.sin(t * 11 + i * 0.37) * Math.sin(t * 7.3 + i * 0.19));
            cr *= flicker;
            cg *= flicker;
            cbCol *= flicker;
          }

          colors[i3] = cr;
          colors[i3 + 1] = cg;
          colors[i3 + 2] = cbCol;

          let sz = lerp(A.sizes[i], B.sizes[i], u);
          if (feel.twinkle > 0) {
            sz *= 1 + feel.twinkle * Math.sin(t * 2.8 + i * 0.17);
          }
          sizes[i] = sz;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aColor.needsUpdate = true;
        geometry.attributes.aSize.needsUpdate = true;

        // Blended rotation — accumulated so shifting rates never jump.
        // When the target rate is zero (logo / forklift / handshake), unwind any
        // leftover angle from a spinning neighbor (e.g. stack) so static models
        // settle back to their designed orientation.
        const rateY = lerp(ca.spinY, cb.spinY, u);
        const rateZ = lerp(ca.spinZ, cb.spinZ, u);
        if (Math.abs(rateY) < 1e-5) {
          spinY += (0 - spinY) * Math.min(1, delta * 5);
        } else {
          spinY += rateY * delta;
        }
        if (Math.abs(rateZ) < 1e-5) {
          spinZ += (0 - spinZ) * Math.min(1, delta * 5);
        } else {
          spinZ += rateZ * delta;
        }
        points.rotation.x = lerp(ca.rotX, cb.rotX, u);
        points.rotation.y = spinY;
        points.rotation.z = spinZ;

        // Blended camera
        camera.position.set(
          lerp(ca.camera.x, cb.camera.x, u),
          lerp(ca.camera.y, cb.camera.y, u),
          lerp(ca.camera.z, cb.camera.z, u),
        );
        lookTarget.set(
          lerp(ca.camera.lookX, cb.camera.lookX, u),
          lerp(ca.camera.lookY, cb.camera.lookY, u),
          lerp(ca.camera.lookZ, cb.camera.lookZ, u),
        );
        camera.lookAt(lookTarget);
        const fov = lerp(ca.camera.fov, cb.camera.fov, u);
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }

        material.uniforms.uScale.value = lerp(ca.pointScale, cb.pointScale, u);
        material.uniforms.uAlpha.value = lerp(ca.alpha, cb.alpha, u);
        bloomPass.strength = lerp(ca.bloom, cb.bloom, u) * feel.bloomMul;

        composer.render();
      };

      tick();
      cleanup.push(() => cancelAnimationFrame(frame));
    };

    init();

    return () => {
      cancelled = true;
      cleanup.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variants.join('|'), palette, scrollTrack]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
