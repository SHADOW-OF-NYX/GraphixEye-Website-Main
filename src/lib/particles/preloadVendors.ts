import { preloadVendorBaked } from './loadVendors';

let preloadPromise: Promise<unknown> | null = null;

/**
 * Warm the CareerParticles chunk + Vendor baked bins so the veil never lifts
 * onto an empty forklift/logo scene.
 */
export function preloadVendors(): Promise<unknown> {
  if (!preloadPromise) {
    preloadPromise = Promise.all([
      import('../../components/careers/CareerParticles'),
      preloadVendorBaked(),
    ]).catch((err) => {
      preloadPromise = null;
      console.warn('[Vendors] background preload failed', err);
    });
  }
  return preloadPromise;
}
