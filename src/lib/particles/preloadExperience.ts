import { preloadExperienceBaked } from './loadExperience';

/**
 * Warm Experience particle assets on nav hover / route intent.
 * Baked warehouse + Haas press + office bins only — GLBs are never fetched at runtime.
 */
export function preloadExperience(): Promise<unknown> {
  return preloadExperienceBaked();
}
