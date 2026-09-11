import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import {
  buildGlobePins,
  latLonToVector3,
  type GlobePin,
} from '../../data/globePins';
import { isNarrowViewport, isSafariOrIOS } from '../../lib/device';

const EARTH_URL = '/models/earth.glb';
const GLOBE_RADIUS = 1.35;
const PIN_RADIUS = GLOBE_RADIUS * 1.035;

type Props = {
  onSelect: (pin: GlobePin | null) => void;
  selectedId: string | null;
  className?: string;
};

type GlobeApi = {
  focusById: (id: string | null) => void;
};

export default function MarketsGlobe({ onSelect, selectedId, className = '' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const apiRef = useRef<GlobeApi | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    const cleanup: Array<() => void> = [];
    const pins = buildGlobePins();
    const mobile = isNarrowViewport(900) || isSafariOrIOS();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05040a, 0.045);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
    camera.position.set(0, 0.15, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? 'default' : 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'none';
    host.appendChild(renderer.domElement);
    cleanup.push(() => {
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    });

    const root = new THREE.Group();
    scene.add(root);

    const earthGroup = new THREE.Group();
    root.add(earthGroup);

    // Soft ambient dust around the globe
    const dustCount = mobile ? 900 : 1800;
    const dustPos = new Float32Array(dustCount * 3);
    const dustCol = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = GLOBE_RADIUS * (1.15 + Math.random() * 1.8);
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      dustPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dustPos[i * 3 + 1] = r * Math.cos(phi);
      dustPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const warm = 0.55 + Math.random() * 0.45;
      dustCol[i * 3] = warm;
      dustCol[i * 3 + 1] = warm * 0.72;
      dustCol[i * 3 + 2] = warm * 0.45;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3));
    const dustMat = new THREE.PointsMaterial({
      size: mobile ? 0.018 : 0.022,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    root.add(dust);
    cleanup.push(() => {
      dustGeo.dispose();
      dustMat.dispose();
    });

    const amb = new THREE.AmbientLight(0xfff0e0, 0.55);
    scene.add(amb);
    const key = new THREE.DirectionalLight(0xffe8d0, 1.35);
    key.position.set(4, 2.5, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88aacc, 0.45);
    rim.position.set(-3, -1, -4);
    scene.add(rim);

    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.06, 48, 48);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0xff9a6a,
      transparent: true,
      opacity: 0.07,
      side: THREE.BackSide,
      depthWrite: false,
    });
    earthGroup.add(new THREE.Mesh(atmoGeo, atmoMat));
    cleanup.push(() => {
      atmoGeo.dispose();
      atmoMat.dispose();
    });

    const pinPositions = new Float32Array(pins.length * 3);
    const pinColors = new Float32Array(pins.length * 3);
    const pinSizes = new Float32Array(pins.length);
    const pinIndices = new Float32Array(pins.length);
    const hitSpheres: THREE.Mesh[] = [];
    const tmpColor = new THREE.Color();

    pins.forEach((pin, i) => {
      const [x, y, z] = latLonToVector3(pin.lat, pin.lon, PIN_RADIUS);
      pinPositions[i * 3] = x;
      pinPositions[i * 3 + 1] = y;
      pinPositions[i * 3 + 2] = z;
      tmpColor.set(pin.color);
      pinColors[i * 3] = tmpColor.r;
      pinColors[i * 3 + 1] = tmpColor.g;
      pinColors[i * 3 + 2] = tmpColor.b;
      pinSizes[i] = pin.isHq ? 1.55 : 1;
      pinIndices[i] = i;

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hit.position.set(x, y, z);
      hit.userData.pinIndex = i;
      earthGroup.add(hit);
      hitSpheres.push(hit);
    });

    const pinGeo = new THREE.BufferGeometry();
    pinGeo.setAttribute('position', new THREE.BufferAttribute(pinPositions, 3));
    pinGeo.setAttribute('color', new THREE.BufferAttribute(pinColors, 3));
    pinGeo.setAttribute('aSize', new THREE.BufferAttribute(pinSizes, 1));
    pinGeo.setAttribute('aIndex', new THREE.BufferAttribute(pinIndices, 1));

    const pinMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: renderer.getPixelRatio() },
        uSelected: { value: -1 },
      },
      vertexShader: /* glsl */ `
        attribute float aSize;
        attribute float aIndex;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vPulse;
        uniform float uTime;
        uniform float uDpr;
        uniform float uSelected;
        void main() {
          vColor = color;
          float pulse = 0.85 + 0.15 * sin(uTime * 2.4 + aIndex * 0.7);
          if (abs(aIndex - uSelected) < 0.5) pulse = 1.35 + 0.25 * sin(uTime * 5.0);
          vPulse = pulse;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(aSize * pulse * 14.0 * uDpr / max(-mv.z, 0.5), 4.0, 48.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vPulse;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.08, d);
          float halo = smoothstep(0.5, 0.2, d) * 0.45;
          float a = (core + halo) * 0.95;
          gl_FragColor = vec4(vColor * (0.85 + 0.35 * vPulse), a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const pinPoints = new THREE.Points(pinGeo, pinMat);
    earthGroup.add(pinPoints);
    cleanup.push(() => {
      pinGeo.dispose();
      pinMat.dispose();
      hitSpheres.forEach((h) => {
        h.geometry.dispose();
        (h.material as THREE.Material).dispose();
      });
    });

    const loader = new GLTFLoader();
    loader.load(
      EARTH_URL,
      (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        model.position.sub(center);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = (GLOBE_RADIUS * 2) / maxDim;
        model.scale.setScalar(scale);
        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = false;
          mesh.receiveShadow = false;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            const mat = m as THREE.MeshStandardMaterial;
            if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
            mat.metalness = Math.min(mat.metalness ?? 0.1, 0.25);
            mat.roughness = Math.max(mat.roughness ?? 0.7, 0.55);
          });
        });
        earthGroup.add(model);
      },
      undefined,
      () => {
        if (cancelled) return;
        const geo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x1a3040,
          roughness: 0.85,
          metalness: 0.05,
          emissive: 0x0a1520,
          emissiveIntensity: 0.2,
        });
        earthGroup.add(new THREE.Mesh(geo, mat));
        cleanup.push(() => {
          geo.dispose();
          mat.dispose();
        });
      },
    );

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hovering = -1;

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      pinMat.uniforms.uDpr.value = renderer.getPixelRatio();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    cleanup.push(() => ro.disconnect());

    const camHome = new THREE.Vector3(0, 0.15, 4.2);
    const lookAt = new THREE.Vector3(0, 0, 0);
    let autoSpin = true;
    const spinY = 0.12;
    let notifySelect = true;

    const killCamTweens = () => {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(root.position);
      gsap.killTweensOf(lookAt);
      gsap.killTweensOf(earthGroup.rotation);
    };

    const focusPin = (index: number, fromUi = true) => {
      const pin = pins[index];
      if (!pin) return;
      if (pinMat.uniforms.uSelected.value === index) return;

      killCamTweens();
      autoSpin = false;
      pinMat.uniforms.uSelected.value = index;
      if (fromUi && notifySelect) onSelectRef.current(pin);

      const local = new THREE.Vector3(
        pinPositions[index * 3],
        pinPositions[index * 3 + 1],
        pinPositions[index * 3 + 2],
      );

      // Face the pin toward the camera (+Z), with a soft latitude tilt
      const targetRotY = Math.atan2(local.x, local.z);
      const targetRotX = THREE.MathUtils.clamp(-Math.asin(THREE.MathUtils.clamp(local.y / PIN_RADIUS, -1, 1)) * 0.55, -0.55, 0.55);

      const narrow = isNarrowViewport(900);
      const slideX = narrow ? 0 : -1.35;
      const slideY = narrow ? 0.28 : 0;

      gsap.to(earthGroup.rotation, {
        x: targetRotX,
        y: targetRotY,
        duration: 1.1,
        ease: 'power3.inOut',
      });
      gsap.to(root.position, {
        x: slideX,
        y: slideY,
        duration: 1.05,
        ease: 'power3.inOut',
      });

      // After facing front, pin sits near (0, local.y', +r) — zoom in on that front point
      const lookY = local.y * 0.65;
      const zoomZ = narrow ? 2.55 : 2.35;
      gsap.to(camera.position, {
        x: narrow ? 0 : -0.15,
        y: lookY * 0.35 + 0.08,
        z: zoomZ,
        duration: 1.15,
        ease: 'power3.inOut',
      });
      gsap.to(lookAt, {
        x: 0,
        y: lookY,
        z: GLOBE_RADIUS * 0.55,
        duration: 1.15,
        ease: 'power3.inOut',
      });
    };

    const clearFocus = (fromUi = true) => {
      if (pinMat.uniforms.uSelected.value < 0) return;
      killCamTweens();
      pinMat.uniforms.uSelected.value = -1;
      if (fromUi && notifySelect) onSelectRef.current(null);
      autoSpin = true;
      gsap.to(root.position, { x: 0, y: 0, duration: 0.9, ease: 'power3.inOut' });
      gsap.to(camera.position, {
        x: camHome.x,
        y: camHome.y,
        z: camHome.z,
        duration: 1,
        ease: 'power3.inOut',
      });
      gsap.to(lookAt, { x: 0, y: 0, z: 0, duration: 1, ease: 'power3.inOut' });
    };

    apiRef.current = {
      focusById: (id) => {
        notifySelect = false;
        try {
          if (!id) {
            clearFocus(false);
            return;
          }
          const idx = pins.findIndex((p) => p.id === id);
          if (idx >= 0) focusPin(idx, false);
        } finally {
          notifySelect = true;
        }
      },
    };
    cleanup.push(() => {
      apiRef.current = null;
    });

    const setPointerFromEvent = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (dragging) return;
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitSpheres, false);
      const next = hits.length ? (hits[0].object.userData.pinIndex as number) : -1;
      if (next !== hovering) {
        hovering = next;
        host.style.cursor = next >= 0 ? 'pointer' : 'grab';
      }
    };

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let dragDist = 0;
    let resumeSpinTimer = 0;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragDist = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      host.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(e.pointerId);
    };

    const onPointerDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragDist += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (pinMat.uniforms.uSelected.value >= 0) return;
      earthGroup.rotation.y += dx * 0.005;
      earthGroup.rotation.x = Math.max(-0.6, Math.min(0.6, earthGroup.rotation.x + dy * 0.004));
      autoSpin = false;
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasDrag = dragDist > 8;
      dragging = false;
      host.style.cursor = hovering >= 0 ? 'pointer' : 'grab';
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      if (wasDrag) {
        window.clearTimeout(resumeSpinTimer);
        resumeSpinTimer = window.setTimeout(() => {
          if (pinMat.uniforms.uSelected.value < 0) autoSpin = true;
        }, 1800);
        return;
      }
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitSpheres, false);
      if (!hits.length) return;
      const idx = hits[0].object.userData.pinIndex as number;
      if (pinMat.uniforms.uSelected.value === idx) clearFocus(true);
      else focusPin(idx, true);
    };

    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerDrag);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    cleanup.push(() => {
      window.clearTimeout(resumeSpinTimer);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerDrag);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
    });

    let frame = 0;
    let last = performance.now();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      pinMat.uniforms.uTime.value = now / 1000;
      dust.rotation.y += dt * 0.02;
      if (autoSpin && pinMat.uniforms.uSelected.value < 0) {
        earthGroup.rotation.y += spinY * dt;
      }
      camera.lookAt(lookAt);
      renderer.render(scene, camera);
    };
    tick();
    cleanup.push(() => cancelAnimationFrame(frame));

    return () => {
      cancelled = true;
      killCamTweens();
      cleanup.forEach((fn) => fn());
    };
  }, []);

  // Panel close / external selection sync
  useEffect(() => {
    apiRef.current?.focusById(selectedId);
  }, [selectedId]);

  return <div ref={hostRef} className={`markets-globe ${className}`} aria-hidden="true" />;
}
