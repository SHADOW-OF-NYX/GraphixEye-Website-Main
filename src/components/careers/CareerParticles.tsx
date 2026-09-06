import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createNoise3D } from 'simplex-noise';

gsap.registerPlugin(ScrollTrigger);

export type SceneVariant =
  // Careers
  | 'ring'
  | 'wave'
  | 'galaxy'
  | 'helix'
  | 'vortex'
  // Vendors
  | 'lattice'
  | 'lanes'
  | 'orbit'
  | 'stack'
  | 'converge';

const TAU = Math.PI * 2;
const N = 26_000;
const noise3D = createNoise3D();

/** Fraction of each morph segment held fully formed before easing to the next shape. */
const MORPH_HOLD = 0.24;

/*
 * Two identities share this renderer. A palette is an ordered ramp, darkest
 * first, so every builder indexes the same seven positions and a page can swap
 * its whole colour identity with one prop. Values keep their authored
 * brightness — additive blending plus bloom on a dark ground is what turns
 * them into glow, so darkening them here would only dim the effect.
 */
export type PaletteName = 'careers' | 'vendors';

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
}

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

const BUILDERS: Record<SceneVariant, (n: number, P: Palette) => Built> = {
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
   * Vendor scenes. Slower spins and tighter noise than the Careers set — the
   * supply language should feel measured and structural rather than cosmic.
   */
  lattice: {
    /*
     * Distance is set by the nearest corner, not the centre. The outer shell's
     * front face sits ~2.1 units closer than the origin once rotated, and at
     * this fov that face is what breaks the frame first.
     */
    camera: { x: 0, y: 0, z: 6.8, lookX: 0, lookY: 0, lookZ: 0, fov: 42 },
    bloom: 1.3,
    pointScale: 3.2,
    alpha: 0.62,
    noiseAmp: 0.005,
    rotX: -0.2,
    spinY: 0.05,
    spinZ: 0,
    wave: 0,
  },
  lanes: {
    camera: { x: 0, y: 0.3, z: 2.1, lookX: 0, lookY: -0.42, lookZ: -1.6, fov: 58 },
    bloom: 1.05,
    pointScale: 2.5,
    alpha: 0.55,
    noiseAmp: 0.004,
    rotX: 0,
    spinY: 0,
    spinZ: 0,
    wave: 0,
  },
  orbit: {
    camera: { x: 0, y: 0.9, z: 3.3, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.25,
    pointScale: 2.7,
    alpha: 0.55,
    noiseAmp: 0.008,
    rotX: -0.42,
    spinY: 0.06,
    spinZ: 0,
    wave: 0,
  },
  stack: {
    // Frames a 3.2-tall column with margin once the near face is accounted for
    camera: { x: 0, y: 0, z: 5.2, lookX: 0, lookY: 0, lookZ: 0, fov: 46 },
    bloom: 1.2,
    pointScale: 3.0,
    alpha: 0.6,
    noiseAmp: 0.006,
    rotX: 0,
    spinY: 0.14,
    spinZ: 0,
    wave: 0,
  },
  converge: {
    camera: { x: 0, y: 0, z: 3.1, lookX: 0, lookY: 0, lookZ: 0, fov: 50 },
    bloom: 1.15,
    pointScale: 2.6,
    alpha: 0.6,
    noiseAmp: 0.01,
    rotX: 0,
    spinY: 0,
    spinZ: 0.04,
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

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uAlpha;
  varying vec3 vColor;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * uAlpha);
  }
`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ease with a flat hold at each end so shapes sit fully formed before morphing. */
function holdEase(u: number): number {
  const h = MORPH_HOLD;
  const x = Math.max(0, Math.min(1, (u - h) / Math.max(1e-6, 1 - 2 * h)));
  return x * x * x * (x * (x * 6 - 15) + 10);
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
      const shapes = variants.map((v) => BUILDERS[v](N, P));
      const configs = variants.map((v) => CONFIG[v]);
      const multi = shapes.length > 1;

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
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      cleanup.push(() => material.dispose());

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // Bloom is what makes the particles read as bright rather than dim
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(host.clientWidth || 1, host.clientHeight || 1),
        configs[0].bloom,
        0.62,
        0.05,
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

        // Ease the displayed progress toward the scroll target for softer morphs
        scrollState.display += (scrollState.target - scrollState.display) * Math.min(1, delta * 3.2);

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
          u = holdEase(Math.max(0, Math.min(1, seg - ai)));
        }

        const A = shapes[ai];
        const B = shapes[bi];
        const ca = configs[ai];
        const cb = configs[bi];

        const noiseAmp = lerp(ca.noiseAmp, cb.noiseAmp, u);
        const waveAmt = lerp(ca.wave, cb.wave, u);

        // Blend positions + colours + sizes, then add motion
        for (let i = 0; i < N; i++) {
          const i3 = i * 3;

          const bx = lerp(A.positions[i3], B.positions[i3], u);
          const by = lerp(A.positions[i3 + 1], B.positions[i3 + 1], u);
          const bz = lerp(A.positions[i3 + 2], B.positions[i3 + 2], u);

          let ny = 0;
          if (waveAmt > 0.001) {
            ny =
              waveAmt *
              (Math.sin(bx * 1.55 + t * 0.5) * 0.115 +
                Math.sin(bz * 2.15 - t * 0.38) * 0.085 +
                Math.sin((bx + bz) * 1.05 + t * 0.27) * 0.07);
          }

          positions[i3] = bx + noise3D(bx * 0.9, by * 0.9, bz * 0.9 + t * 0.25) * noiseAmp;
          positions[i3 + 1] = by + ny + noise3D(by * 0.9, bz * 0.9, bx * 0.9 + t * 0.25) * noiseAmp;
          positions[i3 + 2] = bz + noise3D(bz * 0.9, bx * 0.9, by * 0.9 + t * 0.25) * noiseAmp;

          colors[i3] = lerp(A.colors[i3], B.colors[i3], u);
          colors[i3 + 1] = lerp(A.colors[i3 + 1], B.colors[i3 + 1], u);
          colors[i3 + 2] = lerp(A.colors[i3 + 2], B.colors[i3 + 2], u);

          sizes[i] = lerp(A.sizes[i], B.sizes[i], u);
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.aColor.needsUpdate = true;
        geometry.attributes.aSize.needsUpdate = true;

        // Blended rotation — accumulated so shifting rates never jump
        spinY += lerp(ca.spinY, cb.spinY, u) * delta;
        spinZ += lerp(ca.spinZ, cb.spinZ, u) * delta;
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
        bloomPass.strength = lerp(ca.bloom, cb.bloom, u);

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
