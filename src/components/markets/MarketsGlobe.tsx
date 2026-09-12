import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import { buildGlobePins, latLonToVector3, type GlobePin } from '../../data/globePins';
import { isNarrowViewport, isSafariOrIOS } from '../../lib/device';

const EARTH_URL = '/models/earth.glb';
const GLOBE_RADIUS = 1.35;
const PIN_RADIUS = GLOBE_RADIUS * 1.04;

type Props = {
  onSelect: (pin: GlobePin | null) => void;
  selectedId: string | null;
  className?: string;
};

type GlobeApi = {
  focusById: (id: string | null) => void;
};

type Marker = {
  object: CSS2DObject;
  el: HTMLButtonElement;
  surface: THREE.Vector3;
};

function createPinElement(pin: GlobePin): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'markets-map-pin';
  btn.style.setProperty('--pin-color', pin.color);
  btn.setAttribute('aria-label', pin.label);
  btn.innerHTML = `
    <span class="markets-map-pin__icon" aria-hidden="true">
      <svg viewBox="0 0 24 36" width="22" height="33" fill="none">
        <path d="M12 0C5.925 0 1 4.925 1 11c0 8.25 11 25 11 25s11-16.75 11-25C23 4.925 18.075 0 12 0z" fill="currentColor"/>
        <circle cx="12" cy="11" r="4.25" fill="#fff"/>
      </svg>
    </span>
    <span class="markets-map-pin__label">${pin.label}</span>
  `;
  return btn;
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

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.className = 'markets-globe-labels';
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.inset = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    host.appendChild(labelRenderer.domElement);

    cleanup.push(() => {
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
      if (labelRenderer.domElement.parentNode === host) host.removeChild(labelRenderer.domElement);
    });

    const root = new THREE.Group();
    scene.add(root);
    const earthGroup = new THREE.Group();
    root.add(earthGroup);

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
    let selectedIndex = -1;
    let dragging = false;

    const setMarkerSelected = (index: number) => {
      selectedIndex = index;
      markers.forEach((m, i) => {
        m.el.classList.toggle('is-selected', i === index);
        m.el.classList.toggle('is-dimmed', index >= 0 && i !== index);
      });
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
      gsap.to(earthGroup.rotation, {
        x: targetEuler.x,
        y: targetEuler.y,
        z: targetEuler.z,
        duration: 1.1,
        ease: 'power3.inOut',
      });
      gsap.to(root.position, {
        x: narrow ? 0 : -1.35,
        y: narrow ? 0.28 : 0,
        duration: 1.05,
        ease: 'power3.inOut',
      });
      gsap.to(camera.position, {
        x: narrow ? 0 : -0.15,
        y: 0.12,
        z: narrow ? 2.55 : 2.35,
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
      gsap.to(earthGroup.rotation, { x: 0, z: 0, duration: 0.9, ease: 'power3.inOut' });
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

    let notifySelect = true;
    pins.forEach((pin, i) => {
      const [x, y, z] = latLonToVector3(pin.lat, pin.lon, PIN_RADIUS);
      const surface = new THREE.Vector3(x, y, z);
      const el = createPinElement(pin);
      el.style.pointerEvents = 'auto';
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dragging) return;
        if (selectedIndex === i) clearFocus(true);
        else focusPin(i, true);
      });
      el.addEventListener('pointerdown', (e) => e.stopPropagation());

      const object = new CSS2DObject(el);
      object.position.copy(surface);
      earthGroup.add(object);
      markers.push({ object, el, surface: surface.clone() });
    });

    cleanup.push(() => {
      markers.forEach((m) => {
        m.el.remove();
        earthGroup.remove(m.object);
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
        model.scale.setScalar((GLOBE_RADIUS * 2) / maxDim);
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
        pins.forEach((pin, i) => {
          const [dx, dy, dz] = latLonToVector3(pin.lat, pin.lon, 1);
          dir.set(dx, dy, dz).normalize();
          worldOrigin.copy(dir).multiplyScalar(GLOBE_RADIUS * 3);
          earthGroup.localToWorld(worldOrigin);
          worldDir.copy(dir).negate().transformDirection(earthGroup.matrixWorld);
          snapRay.set(worldOrigin, worldDir);
          const hits = snapRay.intersectObject(model, true);
          if (!hits.length) return;
          localHit.copy(hits[0].point);
          earthGroup.worldToLocal(localHit);
          // Sit just above the surface tip
          localHit.multiplyScalar(1.025);
          markers[i].surface.copy(localHit);
          markers[i].object.position.copy(localHit);
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

    const resize = () => {
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      renderer.setSize(w, h, false);
      labelRenderer.setSize(w, h);
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
    const spinY = 0.1;

    const killCamTweens = () => {
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(root.position);
      gsap.killTweensOf(lookAt);
      gsap.killTweensOf(earthGroup.rotation);
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

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dragDist += Math.abs(dx) + Math.abs(dy);
      lastX = e.clientX;
      lastY = e.clientY;
      if (selectedIndex >= 0) return;
      earthGroup.rotation.y += dx * 0.005;
      earthGroup.rotation.x = Math.max(-0.55, Math.min(0.55, earthGroup.rotation.x + dy * 0.004));
      autoSpin = false;
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasDrag = dragDist > 8;
      dragging = false;
      host.style.cursor = 'grab';
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
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);
    cleanup.push(() => {
      window.clearTimeout(resumeSpinTimer);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
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
      if (autoSpin && selectedIndex < 0) earthGroup.rotation.y += spinY * dt;

      earthGroup.getWorldPosition(earthWorld);
      markers.forEach((m, i) => {
        m.object.getWorldPosition(markerWorld);
        outward.copy(markerWorld).sub(earthWorld).normalize();
        toCamera.copy(camera.position).sub(earthWorld).normalize();
        const facing = outward.dot(toCamera) > 0.12 || selectedIndex === i;
        m.el.style.visibility = facing ? 'visible' : 'hidden';
        m.el.style.pointerEvents = facing ? 'auto' : 'none';
      });

      camera.lookAt(lookAt);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
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

  return <div ref={hostRef} className={`markets-globe ${className}`} />;
}
