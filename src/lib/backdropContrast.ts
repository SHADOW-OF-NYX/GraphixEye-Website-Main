const PAGE_CREAM = { r: 252, g: 248, b: 241 };

let sampleCanvas: HTMLCanvasElement | null = null;
let sampleCtx: CanvasRenderingContext2D | null = null;

function getSampleCtx() {
  if (!sampleCtx) {
    sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1;
    sampleCanvas.height = 1;
    sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  }
  return sampleCtx;
}

function luminance(r: number, g: number, b: number) {
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function parseColor(input: string) {
  if (!input || input === 'transparent') return null;
  const comma = input.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
  );
  if (comma) {
    return { r: +comma[1], g: +comma[2], b: +comma[3], a: comma[4] === undefined ? 1 : +comma[4] };
  }
  const space = input.match(
    /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i,
  );
  if (space) {
    const raw = space[4];
    const a = raw === undefined ? 1 : raw.endsWith('%') ? parseFloat(raw) / 100 : +raw;
    return { r: +space[1], g: +space[2], b: +space[3], a };
  }
  return null;
}

function sampleMedia(el: HTMLImageElement | HTMLVideoElement, clientX: number, clientY: number) {
  const mediaW = el instanceof HTMLVideoElement ? el.videoWidth : el.naturalWidth;
  const mediaH = el instanceof HTMLVideoElement ? el.videoHeight : el.naturalHeight;
  if (!mediaW || !mediaH) return null;

  const rect = el.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return null;

  const scale = Math.max(rect.width / mediaW, rect.height / mediaH);
  const drawW = mediaW * scale;
  const drawH = mediaH * scale;
  const sx = (clientX - rect.left - (rect.width - drawW) / 2) / scale;
  const sy = (clientY - rect.top - (rect.height - drawH) / 2) / scale;
  if (sx < 0 || sy < 0 || sx >= mediaW || sy >= mediaH) return null;

  const ctx = getSampleCtx();
  if (!ctx) return null;
  try {
    ctx.clearRect(0, 0, 1, 1);
    ctx.drawImage(el, sx, sy, 1, 1, 0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return { r: d[0], g: d[1], b: d[2], a: 1 };
  } catch {
    return null;
  }
}

function stackAt(x: number, y: number, skip: HTMLElement) {
  const restored: { el: HTMLElement; pe: string }[] = [];
  const stack: Element[] = [];
  const prevSkip = skip.style.pointerEvents;
  skip.style.pointerEvents = 'none';

  try {
    while (stack.length < 20) {
      const el = document.elementFromPoint(x, y);
      if (!el || el === document.documentElement || stack.includes(el)) break;
      stack.push(el);
      if (!(el instanceof HTMLElement) || el === document.body) break;
      restored.push({ el, pe: el.style.pointerEvents });
      el.style.pointerEvents = 'none';
    }
  } finally {
    for (let i = restored.length - 1; i >= 0; i -= 1) {
      restored[i].el.style.pointerEvents = restored[i].pe;
    }
    skip.style.pointerEvents = prevSkip;
  }

  return stack;
}

function colorAt(x: number, y: number, skip: HTMLElement) {
  const layers: { r: number; g: number; b: number; a: number }[] = [];

  for (const el of stackAt(x, y, skip)) {
    if (!(el instanceof HTMLElement) || skip.contains(el)) continue;

    if (el instanceof HTMLVideoElement || el instanceof HTMLImageElement) {
      const px = sampleMedia(el, x, y);
      if (px) {
        layers.push(px);
        break;
      }
    }

    const style = getComputedStyle(el);
    const bg = parseColor(style.backgroundColor);
    const opacity = Number(style.opacity);
    if (!bg || bg.a * opacity <= 0.02) continue;

    layers.push({ r: bg.r, g: bg.g, b: bg.b, a: Math.min(1, bg.a * opacity) });
    if (bg.a * opacity >= 0.92) break;
  }

  let r = PAGE_CREAM.r;
  let g = PAGE_CREAM.g;
  let b = PAGE_CREAM.b;
  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i];
    r = layer.r * layer.a + r * (1 - layer.a);
    g = layer.g * layer.a + g * (1 - layer.a);
    b = layer.b * layer.a + b * (1 - layer.a);
  }

  return luminance(r, g, b);
}

/** Average relative luminance of the pixels sitting under the nav links. 0 = black, 1 = white. */
export function backdropLuma(nav: HTMLElement) {
  const rect = nav.getBoundingClientRect();
  const y = Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height * 0.55));
  const xs = [0.32, 0.44, 0.56, 0.68].map((t) => Math.min(window.innerWidth - 1, Math.max(0, window.innerWidth * t)));
  const samples = xs.map((x) => colorAt(x, y, nav));
  return samples.reduce((sum, value) => sum + value, 0) / samples.length;
}
