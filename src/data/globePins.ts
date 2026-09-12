import type { Market } from './markets';
import { markets } from './markets';

export type PinStatus = 'active' | 'coming-soon';

/** One clickable project hub on the globe. */
export type GlobePin = {
  id: string;
  label: string;
  marketSlug: string;
  lat: number;
  lon: number;
  /** Hex color for this market */
  color: string;
  status: PinStatus;
  /** Factory HQ gets a brighter pulse */
  isHq?: boolean;
};

/** Distinct accent per market — warm brand accents, no purple default. */
export const MARKET_COLORS: Record<string, string> = {
  'united-states': '#ff6b5a',
  'united-kingdom': '#3ecfbf',
  'united-arab-emirates': '#e8c15a',
  'saudi-arabia': '#ff8f5c',
  europe: '#6aa8d8',
  asia: '#e08a6a',
  africa: '#d4a03a',
  canada: '#7ec4d4',
  australia: '#c9a66b',
};

/**
 * Only hubs with live services — shown as location pins on the globe.
 * UK is represented by London (our base there).
 */
const GLOBE_HUBS: Array<{
  city: string;
  marketSlug: string;
  lat: number;
  lon: number;
  isHq?: boolean;
}> = [
  { city: 'Chicago', marketSlug: 'united-states', lat: 41.8781, lon: -87.6298 },
  { city: 'London', marketSlug: 'united-kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'Pune', marketSlug: 'asia', lat: 18.5204, lon: 73.8567 },
  { city: 'Chennai', marketSlug: 'asia', lat: 13.0827, lon: 80.2707 },
  // GCC
  { city: 'Dammam', marketSlug: 'saudi-arabia', lat: 26.3927, lon: 49.9777, isHq: true },
  { city: 'Riyadh', marketSlug: 'saudi-arabia', lat: 24.7136, lon: 46.6753 },
  { city: 'Jeddah', marketSlug: 'saudi-arabia', lat: 21.4858, lon: 39.1925 },
  { city: 'Dubai', marketSlug: 'united-arab-emirates', lat: 25.2048, lon: 55.2708 },
  { city: 'Abu Dhabi', marketSlug: 'united-arab-emirates', lat: 24.4539, lon: 54.3773 },
];

/** Active service hubs only — no coming-soon markers on the globe. */
export function buildGlobePins(): GlobePin[] {
  return GLOBE_HUBS.map((hub) => ({
    id: `${hub.marketSlug}__${hub.city.toLowerCase().replace(/\s+/g, '-')}`,
    label: hub.city,
    marketSlug: hub.marketSlug,
    lat: hub.lat,
    lon: hub.lon,
    color: MARKET_COLORS[hub.marketSlug] ?? '#ff8f5c',
    status: 'active' as const,
    isHq: hub.isHq,
  }));
}

export function marketForPin(pin: GlobePin): Market | undefined {
  return markets.find((m) => m.slug === pin.marketSlug);
}

/**
 * Convert geographic lat/lon to a Three.js vector on a sphere (Y-up).
 * Lon 0 = Greenwich; positive east.
 *
 * Offset 180° matches this Sketchfab Earth GLB after its FBX→glTF
 * axis conversion (north = +Y, same convention as Three.js SphereGeometry
 * + equirectangular maps). Confirmed against Australia/Africa mesh clusters.
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius: number,
  lonOffsetDeg = 180,
): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + lonOffsetDeg) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

/** Unit direction for a lat/lon on the calibrated globe. */
export function latLonDirection(lat: number, lon: number): [number, number, number] {
  return latLonToVector3(lat, lon, 1);
}
