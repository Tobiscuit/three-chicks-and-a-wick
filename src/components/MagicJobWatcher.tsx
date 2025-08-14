'use client';

import { useEffect } from 'react';
import { graphqlConfig } from '@/lib/graphql-config';

export default function MagicJobWatcher() {
  useEffect(() => {
    let timer: any;
    try {
      const jobId = typeof window !== 'undefined' ? localStorage.getItem('magic_job_id') : null;
      if (!jobId) return;
      const query = `query Q($id:ID!){ getMagicRequestStatus(jobId:$id){ status aiJson cartId variantId jobError errorMessage } }`;
      const poll = async () => {
        try {
          const res = await fetch(graphqlConfig.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': graphqlConfig.apiKey },
            body: JSON.stringify({ query, variables: { id: jobId } })
          });
          const data = await res.json();
          const job = data?.data?.getMagicRequestStatus;
          if (job?.status === 'READY') {
            try { if (job.cartId) localStorage.setItem('shopify_cart_id', job.cartId); } catch {}
            try { localStorage.removeItem('magic_job_id'); } catch {}
            try { new BroadcastChannel('magic-job').postMessage({ type: 'READY', job }); } catch {}
            return;
          }
          if (job?.status === 'ERROR') {
            try { localStorage.removeItem('magic_job_id'); } catch {}
            return;
          }
        } catch {}
        timer = setTimeout(poll, 2000);
      };
      poll();
      return () => { if (timer) clearTimeout(timer); };
    } catch {}
  }, []);
  return null;
}


