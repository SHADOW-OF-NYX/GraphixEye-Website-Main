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

type Marker = {
  root: THREE.Group;
  sprite: THREE.Sprite;
  hit: THREE.Mesh;
  baseScale: number;
  surface: THREE.Vector3;
};

function makePinTexture(fill: string, label: string, active: boolean): THREE.CanvasTexture {
  const w = 256;
  const h = active ? 320 : 220;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(w / 2, h - (active ? 28 : 18), active ? 28 : 18, active ? 10 : 7, 0, 0, Math.PI * 2);
  ctx.fill();

  const cx = w / 2;
  const cy = active ? 118 : 88;
  const r = active ? 52 : 34;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r + (active ? 70 : 48));
  ctx.bezierCurveTo(cx + r + 18, cy + 36, cx + r + 8, cy - r * 0.2, cx, cy - r);
  ctx.bezierCurveTo(cx - r - 8, cy - r * 0.2, cx - r - 18, cy + 36, cx, cy + r + (active ? 70 : 48));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = active ? 6 : 4;
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy - 6, active ? 18 : 12, 0, Math.PI * 2);
  ctx.fillStyle = active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)';
  ctx.fill();

  if (active) {
    ctx.font = '600 28px "Segoe UI", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = label.length > 14 ? `${label.slice(0, 13)}…` : label;
    const metrics = ctx.measureText(text);
    const padX = 16;
    const tw = metrics.width + padX * 2;
    const th = 36;
    const tx = cx - tw / 2;
    const ty = h - 78;
    ctx.fillStyle = 'rgba(8,7,12,0.88)';
    ctx.beginPath();
    const rr = 10;
    ctx.moveTo(tx + rr, ty);
    ctx.arcTo(tx + tw, ty, tx + tw, ty + th, rr);
    ctx.arcTo(tx + tw, ty + th, tx, ty + th, rr);
    ctx.arcTo(tx, ty + th, tx, ty, rr);
    ctx.arcTo(tx, ty, tx + tw, ty, rr);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, cx, ty + th / 2 + 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

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
    const dustCount = mobile ? 700 : 1400;
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
      size: mobile ? 0.016 : 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
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

    const markers: Marker[] = [];
    const hitSpheres: THREE.Mesh[] = [];
    const pinPositions = new Float32Array(pins.length * 3);
    const textureCache = new Map<string, THREE.CanvasTexture>();
    let selectedIndex = -1;

    const getTexture = (pin: GlobePin) => {
      const key = `${pin.color}|${pin.label}|${pin.status}`;
      let tex = textureCache.get(key);
      if (!tex) {
        const fill = pin.status === 'active' ? pin.color : '#8a8794';
        tex = makePinTexture(fill, pin.label, pin.status === 'active');
        textureCache.set(key, tex);
      }
      return tex;
    };

    pins.forEach((pin, i) => {
      const [x, y, z] = latLonToVector3(pin.lat, pin.lon, PIN_RADIUS);
      pinPositions[i * 3] = x;
      pinPositions[i * 3 + 1] = y;
      pinPositions[i * 3 + 2] = z;

      const surface = new THREE.Vector3(x, y, z);
      const markerRoot = new THREE.Group();
      markerRoot.position.copy(surface);

      const tex = getTexture(pin);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        opacity: pin.status === 'active' ? 1 : 0.72,
      });
      const sprite = new THREE.Sprite(mat);
      const baseScale = pin.status === 'active' ? (pin.isHq ? 0.28 : 0.24) : 0.18;
      sprite.scale.set(baseScale * 0.8, baseScale, 1);
      // Tip of pin sits on the surface; sprite center is above
      sprite.center.set(0.5, 0);
      sprite.position.set(0, 0, 0);
      markerRoot.add(sprite);

      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(pin.status === 'active' ? 0.09 : 0.07, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false }),
      );
      hit.position.copy(surface);
      hit.userData.pinIndex = i;
      earthGroup.add(hit);
      hitSpheres.push(hit);

      earthGroup.add(markerRoot);
      markers.push({ root: markerRoot, sprite, hit, baseScale, surface: surface.clone() });
    });

    cleanup.push(() => {
      markers.forEach((m) => {
        (m.sprite.material as THREE.SpriteMaterial).dispose();
        m.hit.geometry.dispose();
        (m.hit.material as THREE.Material).dispose();
      });
      textureCache.forEach((t) => t.dispose());
    });

    const setMarkerSelected = (index: number) => {
      selectedIndex = index;
      markers.forEach((m, i) => {
        const active = pins[i].status === 'active';
        const selected = i === index;
        const scale = m.baseScale * (selected ? 1.35 : hovering === i ? 1.15 : 1);
        m.sprite.scale.set(scale * 0.8, scale, 1);
        (m.sprite.material as THREE.SpriteMaterial).opacity = selected
          ? 1
          : active
            ? 0.95
            : hovering === i
              ? 0.9
              : 0.65;
        m.sprite.renderOrder = selected ? 20 : active ? 10 : 1;
      });
    };

    let hovering = -1;

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
        earthGroup.updateMatrixWorld(true);

        const snapRay = new THREE.Raycaster();
        snapRay.far = GLOBE_RADIUS * 6;
        const dir = new THREE.Vector3();
        const worldOrigin = new THREE.Vector3();
        const worldDir = new THREE.Vector3();
        const localHit = new THREE.Vector3();
        const lift = 1.022;
        pins.forEach((pin, i) => {
          const [dx, dy, dz] = latLonToVector3(pin.lat, pin.lon, 1);
          dir.set(dx, dy, dz).normalize();
          worldOrigin.copy(dir).multiplyScalar(GLOBE_RADIUS * 3);
          earthGroup.localToWorld(worldOrigin);
          worldDir.copy(dir).negate().transformDirection(earthGroup.matrixWorld);
          snapRay.set(worldOrigin, worldDir);
          const hits = snapRay.intersectObject(model, true);
          if (hits.length > 0) {
            localHit.copy(hits[0].point);
            earthGroup.worldToLocal(localHit);
            localHit.multiplyScalar(lift);
            pinPositions[i * 3] = localHit.x;
            pinPositions[i * 3 + 1] = localHit.y;
            pinPositions[i * 3 + 2] = localHit.z;
            markers[i].surface.copy(localHit);
            markers[i].root.position.copy(localHit);
            markers[i].hit.position.copy(localHit);
          }
        });
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

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
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
      if (selectedIndex === index) return;

      killCamTweens();
      autoSpin = false;
      setMarkerSelected(index);
      if (fromUi && notifySelect) onSelectRef.current(pin);

      const local = markers[index].surface.clone();
      const pinDir = local.clone().normalize();
      const faceCam = new THREE.Quaternion().setFromUnitVectors(pinDir, new THREE.Vector3(0, 0, 1));
      const targetEuler = new THREE.Euler().setFromQuaternion(faceCam, 'YXZ');

      const narrow = isNarrowViewport(900);
      const slideX = narrow ? 0 : -1.35;
      const slideY = narrow ? 0.28 : 0;

      gsap.to(earthGroup.rotation, {
        x: targetEuler.x,
        y: targetEuler.y,
        z: targetEuler.z,
        duration: 1.1,
        ease: 'power3.inOut',
      });
      gsap.to(root.position, {
        x: slideX,
        y: slideY,
        duration: 1.05,
        ease: 'power3.inOut',
      });

      const zoomZ = narrow ? 2.55 : 2.35;
      gsap.to(camera.position, {
        x: narrow ? 0 : -0.15,
        y: 0.12,
        z: zoomZ,
        duration: 1.15,
        ease: 'power3.inOut',
      });
      gsap.to(lookAt, {
        x: 0,
        y: 0,
        z: GLOBE_RADIUS * 0.85,
        duration: 1.15,
        ease: 'power3.inOut',
      });
    };

    const clearFocus = (fromUi = true) => {
      if (selectedIndex < 0) return;
      killCamTweens();
      setMarkerSelected(-1);
      if (fromUi && notifySelect) onSelectRef.current(null);
      autoSpin = true;
      gsap.to(earthGroup.rotation, {
        x: 0,
        z: 0,
        duration: 0.9,
        ease: 'power3.inOut',
      });
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
        setMarkerSelected(selectedIndex);
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
      if (selectedIndex >= 0) return;
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
          if (selectedIndex < 0) autoSpin = true;
        }, 1800);
        return;
      }
      setPointerFromEvent(e);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(hitSpheres, false);
      if (!hits.length) return;
      const idx = hits[0].object.userData.pinIndex as number;
      if (selectedIndex === idx) clearFocus(true);
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
    const earthWorld = new THREE.Vector3();
    const markerWorld = new THREE.Vector3();
    const outward = new THREE.Vector3();
    const toCamera = new THREE.Vector3();
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      dust.rotation.y += dt * 0.02;
      if (autoSpin && selectedIndex < 0) {
        earthGroup.rotation.y += spinY * dt;
      }
      // Hide markers on the far side of the globe
      earthGroup.getWorldPosition(earthWorld);
      markers.forEach((m, i) => {
        m.root.getWorldPosition(markerWorld);
        outward.copy(markerWorld).sub(earthWorld).normalize();
        toCamera.copy(camera.position).sub(earthWorld).normalize();
        m.sprite.visible = outward.dot(toCamera) > 0.05 || selectedIndex === i;
      });
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

  useEffect(() => {
    apiRef.current?.focusById(selectedId);
  }, [selectedId]);

  return <div ref={hostRef} className={`markets-globe ${className}`} aria-hidden="true" />;
}
