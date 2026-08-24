import React, { Suspense, lazy } from 'react';
import { importThreeScene } from '../../lib/particles/preloadExpansions';

const ThreeScene = lazy(importThreeScene);

/** Lazy-load WebGL on Expansions — chunk is preloaded from the landing page. */
export default function ThreeSceneLoader() {
  return (
    <Suspense fallback={null}>
      <ThreeScene />
    </Suspense>
  );
}
