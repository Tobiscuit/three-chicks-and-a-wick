'use client';

import MagicJobWatcher from '@/components/MagicJobWatcher';
import MagicToastHost from '@/components/MagicToastHost';

export default function ClientProviders() {
  return (
    <>
      <MagicJobWatcher />
      <MagicToastHost />
    </>
  );
}


