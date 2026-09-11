import type { Market } from './markets';
import { markets } from './markets';

/** One clickable project hub on the globe. */
export type GlobePin = {
  id: string;
  label: string;
  marketSlug: string;
  lat: number;
  lon: number;
  /** Hex color for this market's particles */
  color: string;
  /** Factory HQ gets a brighter pulse */
  isHq?: boolean;
};

/** Distinct glow per market — warm brand accents, no purple default. */
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

const CITY_COORDS: Record<string, [number, number]> = {
  // USA
  Chicago: [41.8781, -87.6298],
  'New York': [40.7128, -74.006],
  'Los Angeles': [34.0522, -118.2437],
  Houston: [29.7604, -95.3698],
  Dallas: [32.7767, -96.797],
  Miami: [25.7617, -80.1918],
  Atlanta: [33.749, -84.388],
  Boston: [42.3601, -71.0589],
  Seattle: [47.6062, -122.3321],
  'San Francisco': [37.7749, -122.4194],
  // UK
  London: [51.5074, -0.1278],
  Manchester: [53.4808, -2.2426],
  Birmingham: [52.4862, -1.8904],
  Leeds: [53.8008, -1.5491],
  Glasgow: [55.8642, -4.2518],
  Liverpool: [53.4084, -2.9916],
  Edinburgh: [55.9533, -3.1883],
  Bristol: [51.4545, -2.5879],
  Cardiff: [51.4816, -3.1791],
  Belfast: [54.5973, -5.9301],
  // UAE
  Dubai: [25.2048, 55.2708],
  'Abu Dhabi': [24.4539, 54.3773],
  Sharjah: [25.3463, 55.4209],
  Ajman: [25.4052, 55.5136],
  'Ras Al Khaimah': [25.7895, 55.9432],
  Fujairah: [25.1288, 56.3265],
  'Umm Al Quwain': [25.5647, 55.5552],
  // KSA
  Dammam: [26.3927, 49.9777],
  Riyadh: [24.7136, 46.6753],
  Jeddah: [21.4858, 39.1925],
  Khobar: [26.2172, 50.1971],
  Jubail: [27.0046, 49.6602],
  Dhahran: [26.2361, 50.0393],
  Yanbu: [24.0895, 38.0637],
  Abha: [18.2164, 42.5053],
  // Europe
  Paris: [48.8566, 2.3522],
  Berlin: [52.52, 13.405],
  Amsterdam: [52.3676, 4.9041],
  Madrid: [40.4168, -3.7038],
  Milan: [45.4642, 9.19],
  Rome: [41.9028, 12.4964],
  Zurich: [47.3769, 8.5417],
  Stockholm: [59.3293, 18.0686],
  Vienna: [48.2082, 16.3738],
  Brussels: [50.8503, 4.3517],
  Frankfurt: [50.1109, 8.6821],
  Munich: [48.1351, 11.582],
  Dublin: [53.3498, -6.2603],
  Lisbon: [38.7223, -9.1393],
  Warsaw: [52.2297, 21.0122],
  // Asia
  Singapore: [1.3521, 103.8198],
  'Hong Kong': [22.3193, 114.1694],
  Tokyo: [35.6762, 139.6503],
  Seoul: [37.5665, 126.978],
  Shanghai: [31.2304, 121.4737],
  Beijing: [39.9042, 116.4074],
  Mumbai: [19.076, 72.8777],
  Delhi: [28.7041, 77.1025],
  Bangalore: [12.9716, 77.5946],
  Bangkok: [13.7563, 100.5018],
  'Kuala Lumpur': [3.139, 101.6869],
  Jakarta: [-6.2088, 106.8456],
  Manila: [14.5995, 120.9842],
  // Africa
  Nairobi: [-1.2921, 36.8219],
  Lagos: [6.5244, 3.3792],
  Johannesburg: [-26.2041, 28.0473],
  'Cape Town': [-33.9249, 18.4241],
  Cairo: [30.0444, 31.2357],
  Accra: [5.6037, -0.187],
  Casablanca: [33.5731, -7.5898],
  // Canada
  Toronto: [43.6532, -79.3832],
  Vancouver: [49.2827, -123.1207],
  Montreal: [45.5017, -73.5673],
  Calgary: [51.0447, -114.0719],
  Ottawa: [45.4215, -75.6972],
  Edmonton: [53.5461, -113.4938],
  // Australia
  Sydney: [-33.8688, 151.2093],
  Melbourne: [-37.8136, 144.9631],
  Brisbane: [-27.4698, 153.0251],
  Perth: [-31.9505, 115.8605],
  Adelaide: [-34.9285, 138.6007],
  Canberra: [-35.2809, 149.13],
};

/** All project hubs we can serve — one pin per city in markets data. */
export function buildGlobePins(): GlobePin[] {
  const pins: GlobePin[] = [];
  for (const market of markets) {
    const color = MARKET_COLORS[market.slug] ?? '#ff8f5c';
    for (const city of market.cities) {
      const coords = CITY_COORDS[city];
      if (!coords) continue;
      pins.push({
        id: `${market.slug}__${city.toLowerCase().replace(/\s+/g, '-')}`,
        label: city,
        marketSlug: market.slug,
        lat: coords[0],
        lon: coords[1],
        color,
        isHq: city === 'Dammam',
      });
    }
  }
  return pins;
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
