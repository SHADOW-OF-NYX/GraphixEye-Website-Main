import React, { Suspense, lazy } from 'react';

const ThreeScene = lazy(() => import('./ThreeScene'));

/** Lazy-load WebGL only on the Expansions route. */
export default function ThreeSceneLoader() {
  return (
    <Suspense fallback={null}>
      <ThreeScene />
    </Suspense>
  );
}
