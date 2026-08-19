const DARK_HOST = '[data-nav-tone="dark"], .glow-wash';
const LIGHT_HOST = '[data-nav-tone="light"]';

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

function luminance(r: number, g: number, b: number) {
  const toLin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function toneFromElement(el: Element | null) {
  if (!el || !(el instanceof Element)) return false;

  if (el.closest(DARK_HOST)) return true;
  if (el.closest(LIGHT_HOST)) return false;

  if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) return true;

  let node: HTMLElement | null = el instanceof HTMLElement ? el : el.parentElement;
  while (node && node !== document.body) {
    const style = getComputedStyle(node);
    const bg = parseColor(style.backgroundColor);
    const opacity = Number(style.opacity);
    if (bg && bg.a * opacity > 0.45) {
      return luminance(bg.r, bg.g, bg.b) < 0.45;
    }
    if (style.backgroundImage !== 'none' && node.classList.contains('glow-wash')) return true;
    node = node.parentElement;
  }

  return false;
}

function hitBehindNav(x: number, y: number, nav: HTMLElement) {
  const prev = nav.style.pointerEvents;
  nav.style.pointerEvents = 'none';
  const stack = document.elementsFromPoint(x, y).filter((el) => el !== nav && !nav.contains(el));
  nav.style.pointerEvents = prev;

  const preferred = stack.find(
    (el) =>
      el instanceof HTMLVideoElement ||
      el instanceof HTMLImageElement ||
      (el instanceof Element && el.closest(DARK_HOST)),
  );
  return preferred ?? stack[0] ?? null;
}

/** True when the pixels under the nav links sit on a dark photo, video, or wash. */
export function isDarkBackdrop(nav: HTMLElement) {
  const rect = nav.getBoundingClientRect();
  const y = Math.min(window.innerHeight - 1, Math.max(0, rect.top + rect.height * 0.62));
  const xs = [0.08, 0.36, 0.5, 0.64].map((t) =>
    Math.min(window.innerWidth - 1, Math.max(0, window.innerWidth * t)),
  );

  const darkVotes = xs.filter((x) => toneFromElement(hitBehindNav(x, y, nav))).length;
  return darkVotes * 2 >= xs.length;
}
