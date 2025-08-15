'use client';

import { useEffect } from 'react';
import { graphqlConfig } from '@/lib/graphql-config';

export default function MagicJobWatcher() {
  useEffect(() => {
    let timer: any;
    const query = `query Q($id:ID!){ getMagicRequestStatus(jobId:$id){ status aiJson cartId variantId jobError errorMessage } }`;

    const startPolling = (jid: string | null) => {
      if (!jid) return;
      if (timer) { try { clearTimeout(timer); } catch {} }
      const poll = async () => {
        try { console.log(`[MagicJobWatcher] Polling for jobId: ${jid}...`); } catch {}
        try {
          const res = await fetch(graphqlConfig.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': graphqlConfig.apiKey },
            body: JSON.stringify({ query, variables: { id: jid } })
          });
          const data = await res.json();
          const job = data?.data?.getMagicRequestStatus;
          try { if (job?.status) console.log('[MagicJobWatcher] Poll result status =', job.status); } catch {}
          if (job?.status === 'READY') {
            try { if (job.cartId) localStorage.setItem('shopify_cart_id', job.cartId); } catch {}
            try { localStorage.setItem('shopify_cart_refetch', String(Date.now())); } catch {}
            try { localStorage.removeItem('magic_job_id'); } catch {}
            try {
              new BroadcastChannel('magic-job').postMessage({ type: 'READY', job: { ...job, jobId: jid } });
            } catch {}
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
    };

    try {
      // Start immediately if a jobId was already present
      const initial = typeof window !== 'undefined' ? localStorage.getItem('magic_job_id') : null;
      if (initial) startPolling(initial);

      // Listen for explicit start events to wake the watcher
      const onStart = (e: CustomEvent<{ jobId?: string }>) => {
        try {
          const jid = (e && e.detail && e.detail.jobId) || (typeof window !== 'undefined' ? localStorage.getItem('magic_job_id') : null);
          console.log('[MagicJobWatcher] Received start-magic-job event', { jobId: jid });
          startPolling(jid);
        } catch {}
      };
      window.addEventListener('start-magic-job', onStart as EventListener);
      return () => {
        try { if (timer) clearTimeout(timer); } catch {}
        try { window.removeEventListener('start-magic-job', onStart as EventListener); } catch {}
      };
    } catch {}
  }, []);
  return null;
}


