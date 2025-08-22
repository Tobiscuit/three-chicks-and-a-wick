'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function LoginSuccessToast() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    if (searchParams.get('login') === 'success') {
      showToast('Login successful!');
      // Optional: Clean up the URL without a page reload
      if (window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('login');
        window.history.replaceState({ path: url.href }, '', url.href);
      }
    }
  }, [searchParams, showToast]);

  return null; // This component doesn't render anything itself
}

