import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type SceneVariant = 'ring' | 'wave' | 'galaxy' | 'helix' | 'vortex';

const TAU = Math.PI * 2;

const C = {
  red: new THREE.Color('#ff3b30'),
  rose: new THREE.Color('#f43f5e'),
  magenta: new THREE.Color('#c026d3'),
  purple: new THREE.Color('#a855f7'),
  violet: new THREE.Color('#7c5cff'),
  blue: new THREE.Color('#2f6bff'),
  deep: new THREE.Color('#1d4ed8'),
  white: new THREE.Color('#ffffff'),
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

interface SceneDef {
  count: number;
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;
  camera: { x: number; y: number; z: number; lookY: number; lookZ?: number; fov: number };
  /** Multiplier feeding gl_PointSize — keeps dots in the 1–3 CSS px range */
  pointScale: number;
  /** Per-particle alpha; low values stop additive blending from clipping to white */
  alpha: number;
  /** GLSL applied to `vec3 p` in the vertex shader */
  displace: string;
  spin: (obj: THREE.Points, t: number) => void;
  groupRotX?: number;
}

/* ── Hero: glowing torus ring facing the viewer ── */
function buildRing(): SceneDef {
  const count = 26000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const R = 1.06;
  const r = 0.3;
  const BANDS = 46;
  const stops: Stop[] = [
    [0.0, C.deep],
    [0.22, C.blue],
    [0.45, C.violet],
    [0.62, C.magenta],
    [0.8, C.rose],
    [1.0, C.red],
  ];

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * TAU;
    // Quantise the minor angle into fine bands → the "wire" look in the reference
    const band = Math.floor(Math.random() * BANDS) / BANDS;
    const phi = band * TAU + (Math.random() - 0.5) * 0.045;

    const rr = R + r * Math.cos(phi);
    const x = rr * Math.cos(theta);
    const y = rr * Math.sin(theta);
    const z = r * Math.sin(phi) * 0.85;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Vertical gradient: blue at the bottom → red at the top
    const c = ramp(stops, (y / (R + r) + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.75 + Math.random() * 0.85;
    seeds[i] = Math.random();
  }

  return {
    count,
    positions,
    colors,
    sizes,
    seeds,
    camera: { x: 0, y: 0, z: 3.3, lookY: 0, fov: 46 },
    pointScale: 3.0,
    alpha: 0.5,
    displace: `
      float ang = atan(p.y, p.x);
      float w = sin(ang * 9.0 + uTime * 0.85) * 0.5
              + sin(ang * 17.0 - uTime * 0.55) * 0.32
              + sin(ang * 29.0 + uTime * 0.4) * 0.18;
      vec3 radial = normalize(vec3(p.x, p.y, 0.0001));
      p += radial * w * 0.075;
      p.z += sin(ang * 13.0 + uTime * 0.7 + aSeed * 2.0) * 0.035;
    `,
    spin: (o, t) => {
      o.rotation.z = t * 0.045;
    },
  };
}

/* ── Growth: particle wave terrain receding from the camera ── */
function buildWave(): SceneDef {
  const cols = 250;
  const rows = 140;
  const count = cols * rows;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const W = 8.0;
  const NEAR_Z = 0.5;
  const FAR_Z = -4.6;
  const stops: Stop[] = [
    [0.0, C.deep],
    [0.24, C.blue],
    [0.5, C.violet],
    [0.72, C.magenta],
    [1.0, C.red],
  ];

  let i = 0;
  for (let cx = 0; cx < cols; cx++) {
    for (let cz = 0; cz < rows; cz++) {
      const x = (cx / (cols - 1) - 0.5) * W + (Math.random() - 0.5) * 0.015;
      const z = NEAR_Z + (cz / (rows - 1)) * (FAR_Z - NEAR_Z) + (Math.random() - 0.5) * 0.015;

      positions[i * 3] = x;
      positions[i * 3 + 1] = -0.55;
      positions[i * 3 + 2] = z;

      const c = ramp(stops, cx / (cols - 1));
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.55 + Math.random() * 0.6;
      seeds[i] = Math.random();
      i++;
    }
  }

  return {
    count,
    positions,
    colors,
    sizes,
    seeds,
    camera: { x: 0, y: 0.34, z: 2.2, lookY: -0.5, lookZ: -1.4, fov: 55 },
    pointScale: 2.4,
    alpha: 0.45,
    displace: `
      float h = sin(p.x * 1.55 + uTime * 0.5) * 0.115
              + sin(p.z * 2.15 - uTime * 0.38) * 0.085
              + sin((p.x + p.z) * 1.05 + uTime * 0.27) * 0.07
              + sin(p.x * 3.4 - p.z * 2.0 + uTime * 0.6) * 0.035;
      p.y += h;
    `,
    spin: () => {},
  };
}

/* ── Teams: orbiting galaxy with a bright core ── */
function buildGalaxy(): SceneDef {
  const ringCount = 5;
  const perRing = 4600;
  const coreCount = 6000;
  const count = ringCount * perRing + coreCount;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const outerStops: Stop[] = [
    [0.0, C.white],
    [0.18, C.rose],
    [0.42, C.magenta],
    [0.68, C.violet],
    [1.0, C.blue],
  ];

  let i = 0;

  // Bright core
  for (let k = 0; k < coreCount; k++) {
    const rr = Math.pow(Math.random(), 2.4) * 0.34;
    const a = Math.random() * TAU;
    positions[i * 3] = Math.cos(a) * rr;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
    positions[i * 3 + 2] = Math.sin(a) * rr * 0.9;

    const c = ramp(outerStops, (rr / 0.34) * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.7 + Math.random() * 0.9;
    seeds[i] = Math.random();
    i++;
  }

  // Concentric elliptical rings
  for (let ring = 0; ring < ringCount; ring++) {
    const radius = 0.62 + ring * 0.29;
    for (let k = 0; k < perRing; k++) {
      const a = Math.random() * TAU;
      const jitter = (Math.random() - 0.5) * 0.05;
      const rr = radius + jitter;

      positions[i * 3] = Math.cos(a) * rr;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.035;
      positions[i * 3 + 2] = Math.sin(a) * rr * 0.9;

      const c = ramp(outerStops, 0.25 + (ring / (ringCount - 1)) * 0.75);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.5 + Math.random() * 0.6;
      seeds[i] = Math.random();
      i++;
    }
  }

  return {
    count,
    positions,
    colors,
    sizes,
    seeds,
    camera: { x: 0, y: 0.72, z: 3.0, lookY: 0, fov: 46 },
    pointScale: 2.6,
    alpha: 0.45,
    groupRotX: -0.5,
    displace: `
      float d = length(p.xz);
      p.y += sin(d * 5.0 - uTime * 0.7 + aSeed * 3.0) * 0.022;
    `,
    spin: (o, t) => {
      o.rotation.y = t * 0.07;
    },
  };
}

/* ── Stats: DNA double helix ── */
function buildHelix(): SceneDef {
  const strandPts = 11000;
  const rungPts = 5000;
  const count = strandPts * 2 + rungPts;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const H = 5.4;
  const radius = 0.46;
  const turns = 4.2;
  const stops: Stop[] = [
    [0.0, C.blue],
    [0.35, C.violet],
    [0.6, C.purple],
    [1.0, C.white],
  ];

  let i = 0;

  for (let strand = 0; strand < 2; strand++) {
    const offset = strand * Math.PI;
    for (let k = 0; k < strandPts; k++) {
      const u = k / strandPts;
      const a = u * turns * TAU + offset;
      const y = (u - 0.5) * H;

      positions[i * 3] = Math.cos(a) * radius + (Math.random() - 0.5) * 0.055;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.02;
      positions[i * 3 + 2] = Math.sin(a) * radius + (Math.random() - 0.5) * 0.055;

      const c = ramp(stops, 0.35 + Math.random() * 0.5);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 0.6 + Math.random() * 0.8;
      seeds[i] = Math.random();
      i++;
    }
  }

  // Rungs between the strands
  for (let k = 0; k < rungPts; k++) {
    const u = Math.random();
    const a = u * turns * TAU;
    const y = (u - 0.5) * H;
    const t = Math.random();
    const x = THREE.MathUtils.lerp(Math.cos(a), Math.cos(a + Math.PI), t) * radius;
    const z = THREE.MathUtils.lerp(Math.sin(a), Math.sin(a + Math.PI), t) * radius;

    positions[i * 3] = x + (Math.random() - 0.5) * 0.03;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.02;
    positions[i * 3 + 2] = z + (Math.random() - 0.5) * 0.03;

    const c = ramp(stops, 0.15 + Math.random() * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.45 + Math.random() * 0.5;
    seeds[i] = Math.random();
    i++;
  }

  return {
    count,
    positions,
    colors,
    sizes,
    seeds,
    camera: { x: 0, y: 0, z: 3.6, lookY: 0, fov: 46 },
    pointScale: 2.8,
    alpha: 0.5,
    displace: `
      p.x += sin(p.y * 2.0 + uTime * 0.5) * 0.018;
      p.z += cos(p.y * 2.0 + uTime * 0.5) * 0.018;
    `,
    spin: (o, t) => {
      o.rotation.y = t * 0.22;
    },
  };
}

/* ── CTA: vortex / event horizon ── */
function buildVortex(): SceneDef {
  const count = 22000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const stops: Stop[] = [
    [0.0, C.deep],
    [0.25, C.blue],
    [0.5, C.violet],
    [0.75, C.magenta],
    [1.0, C.red],
  ];

  const inner = 0.62;
  const outer = 3.3;

  for (let i = 0; i < count; i++) {
    const rr = inner + Math.pow(Math.random(), 0.62) * (outer - inner);
    const a = Math.random() * TAU;

    const x = Math.cos(a) * rr;
    const y = Math.sin(a) * rr * 0.82;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.35;

    // Horizontal gradient: blue on the left → red on the right
    const c = ramp(stops, (x / outer + 1) / 2);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Fade density near the event horizon
    const edge = Math.min(1, (rr - inner) / 0.5);
    sizes[i] = (0.5 + Math.random() * 0.8) * (0.45 + edge * 0.55);
    seeds[i] = Math.random();
  }

  return {
    count,
    positions,
    colors,
    sizes,
    seeds,
    camera: { x: 0, y: 0, z: 3.2, lookY: 0, fov: 50 },
    pointScale: 2.6,
    alpha: 0.5,
    displace: `
      float d = length(p.xy);
      float swirl = sin(d * 2.4 - uTime * 0.5 + aSeed * 6.28) * 0.03;
      p.xy += normalize(p.xy + 0.0001) * swirl;
    `,
    spin: (o, t) => {
      o.rotation.z = -t * 0.05;
    },
  };
}

const BUILDERS: Record<SceneVariant, () => SceneDef> = {
  ring: buildRing,
  wave: buildWave,
  galaxy: buildGalaxy,
  helix: buildHelix,
  vortex: buildVortex,
};

/*
 * gl_PointSize is in PHYSICAL pixels. Dividing a tuned scale by view depth keeps
 * dots at roughly 1–3 CSS px; the clamp stops near-camera points from ballooning
 * and blowing the additive blend out to solid white.
 */
const VERT = (displace: string) => `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aSeed;
  uniform float uTime;
  uniform float uScale;
  uniform float uDpr;
  varying vec3 vColor;

  void main() {
    vColor = aColor;
    vec3 p = position;
    ${displace}
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float ps = aSize * uScale * uDpr / max(-mv.z, 0.15);
    gl_PointSize = clamp(ps, 0.5, 5.0 * uDpr);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = `
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

interface Props {
  variant: SceneVariant;
  className?: string;
}

export default function CareerParticles({ variant, className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const def = BUILDERS[variant]();

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(def.camera.fov, 1, 0.1, 100);
    camera.position.set(def.camera.x, def.camera.y, def.camera.z);
    camera.lookAt(0, def.camera.lookY, def.camera.lookZ ?? 0);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(def.positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(def.colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(def.sizes, 1));
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(def.seeds, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: def.pointScale },
        uDpr: { value: dpr },
        uAlpha: { value: def.alpha },
      },
      vertexShader: VERT(def.displace),
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    if (def.groupRotX) group.rotation.x = def.groupRotX;
    group.add(points);
    scene.add(group);

    const resize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: '200px' },
    );
    io.observe(host);

    let frame = 0;
    const start = performance.now();

    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible) return;

      const t = reduced ? 0 : (performance.now() - start) / 1000;
      material.uniforms.uTime.value = t;
      def.spin(points, t);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, [variant]);

  return <div ref={hostRef} className={className} aria-hidden="true" />;
}
