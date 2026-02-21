'use client';

import { Suspense } from 'react';
import Welcome from './Welcome';

export default function WelcomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Welcome />
    </Suspense>
  );
}
