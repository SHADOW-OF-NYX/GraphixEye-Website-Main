/**
 * Global markets GraphixEye serves — used for schema.org areaServed,
 * meta keywords, and on-page “where we work” copy.
 * Factory / NAP stays in Dammam; reach is worldwide.
 */
import raw from './geoMarkets.json';

export const GEO_COUNTRIES = raw.countries as string[];
export const GEO_US_STATES = raw.usStates as string[];
export const GEO_CANADA_PROVINCES = raw.canadaProvinces as string[];
export const GEO_AUSTRALIA_STATES = raw.australiaStates as string[];
export const GEO_UK_REGIONS = raw.ukRegions as string[];
export const GEO_INDIA_STATES = raw.indiaStates as string[];
export const GEO_UAE_EMIRATES = raw.uaeEmirates as string[];
export const GEO_GERMANY_STATES = raw.germanyStates as string[];
export const GEO_BRAZIL_STATES = raw.brazilStates as string[];
export const GEO_MEXICO_STATES = raw.mexicoStates as string[];
export const GEO_NIGERIA_STATES = raw.nigeriaStates as string[];
export const GEO_SOUTH_AFRICA_PROVINCES = raw.southAfricaProvinces as string[];
export const GEO_MAJOR_CITIES = raw.majorCities as string[];

/** Flat list of every region/state we tag for search. */
export const GEO_ALL_STATES_AND_REGIONS = [
  ...GEO_US_STATES,
  ...GEO_CANADA_PROVINCES,
  ...GEO_AUSTRALIA_STATES,
  ...GEO_UK_REGIONS,
  ...GEO_INDIA_STATES,
  ...GEO_UAE_EMIRATES,
  ...GEO_GERMANY_STATES,
  ...GEO_BRAZIL_STATES,
  ...GEO_MEXICO_STATES,
  ...GEO_NIGERIA_STATES,
  ...GEO_SOUTH_AFRICA_PROVINCES,
];

export type AreaServedEntry =
  | { '@type': 'Country'; name: string }
  | { '@type': 'AdministrativeArea'; name: string }
  | { '@type': 'City'; name: string };

/** Schema.org areaServed covering countries, major states/regions, and hub cities. */
export function buildAreaServed(): AreaServedEntry[] {
  const countries = GEO_COUNTRIES.map((name) => ({ '@type': 'Country' as const, name }));
  const areas = GEO_ALL_STATES_AND_REGIONS.map((name) => ({
    '@type': 'AdministrativeArea' as const,
    name,
  }));
  const cities = GEO_MAJOR_CITIES.map((name) => ({ '@type': 'City' as const, name }));
  return [...countries, ...areas, ...cities];
}

const SERVICE_SEEDS = [
  'global printing company',
  'international signage manufacturer',
  'worldwide packaging production',
  'corporate gifting global',
  'graphic design worldwide',
  'AR VR experiences international',
  'printing Chicago',
  'printing London',
  'printing Dubai',
  'signage United States',
  'signage United Kingdom',
  'packaging USA',
  'packaging UK',
  'printing company Saudi Arabia',
  'GraphixEye global',
];

/** Meta keywords: services + every country + states/regions + major cities. */
export function buildGlobalKeywords(extra: string[] = []): string {
  const parts = [
    ...SERVICE_SEEDS,
    ...extra,
    ...GEO_COUNTRIES.map((c) => `printing ${c}`),
    ...GEO_COUNTRIES.map((c) => `signage ${c}`),
    ...GEO_US_STATES.map((s) => `printing ${s}`),
    ...GEO_US_STATES.map((s) => `signage ${s}`),
    ...GEO_UK_REGIONS.map((r) => `printing ${r}`),
    ...GEO_CANADA_PROVINCES.map((p) => `printing ${p}`),
    ...GEO_AUSTRALIA_STATES.map((s) => `printing ${s}`),
    ...GEO_UAE_EMIRATES.map((e) => `printing ${e}`),
    ...GEO_MAJOR_CITIES.map((c) => `GraphixEye ${c}`),
    ...GEO_ALL_STATES_AND_REGIONS,
    ...GEO_COUNTRIES,
  ];
  // Deduplicate while preserving order
  return [...new Set(parts)].join(', ');
}

export const GLOBAL_KEYWORDS = buildGlobalKeywords();

/** Short on-page line for marketing surfaces. */
export const GLOBAL_REACH_LINE =
  'A global creative production firm — factory HQ in Dammam, teams and clients across the United States (including Chicago and nationwide), the United Kingdom, the GCC, Europe, Asia, Africa, and beyond.';
