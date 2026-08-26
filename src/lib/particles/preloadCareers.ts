let preloadPromise: Promise<unknown> | null = null;

/**
 * Warm the Careers particle chunk on nav hover so the veil never lifts on an
 * empty stage. Safe to call repeatedly; retries if it fails.
 */
export function preloadCareers(): Promise<unknown> {
  if (!preloadPromise) {
    preloadPromise = import('../../components/careers/CareerParticles').catch((err) => {
      preloadPromise = null;
      console.warn('[Careers] background preload failed', err);
    });
  }

  return preloadPromise;
}
