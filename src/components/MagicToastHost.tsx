'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Modal from '@/components/ui/Modal';

type ReadyJob = {
  jobId?: string;
  aiJson?: string;
  cartId?: string;
  variantId?: string;
};

export default function MagicToastHost() {
  const { cartItems, removeFromCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [job, setJob] = useState<ReadyJob | null>(null);
  const [lineId, setLineId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const parsedPreview = useMemo(() => {
    try {
      return job?.aiJson ? JSON.parse(job.aiJson) : null;
    } catch { return null; }
  }, [job]);

  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('magic-job');
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'READY') {
          const payload = ev.data.job || {};
          setJob({
            jobId: payload.jobId,
            aiJson: payload.aiJson || null,
            cartId: payload.cartId,
            variantId: payload.variantId,
          });
          try {
            if (payload?.jobId && payload?.aiJson) {
              localStorage.setItem(`creation_preview_${payload.jobId}`, typeof payload.aiJson === 'string' ? payload.aiJson : JSON.stringify(payload.aiJson));
            }
          } catch { /* ignore */ }
          setVisible(true);
        }
        if (ev?.data?.type === 'OPEN_CART') {
          setVisible(false);
        }
        if (ev?.data?.type === 'OPEN_PREVIEW') {
          const jid = ev?.data?.jobId as string | undefined;
          if (!jid) return;
          try { new BroadcastChannel('magic-job').postMessage({ type: 'CLOSE_CART' }); } catch {}
          setVisible(false);
          try {
            const raw = localStorage.getItem(`creation_preview_${jid}`);
            if (raw) {
              setJob({ jobId: jid, aiJson: raw, cartId: undefined, variantId: undefined });
              setShowPreview(true);
            }
          } catch { /* ignore */ }
        }
      };
    } catch { /* ignore */ }
    return () => { try { if (bc) bc.close(); } catch {} };
  }, []);

  useEffect(() => {
    if (!job?.jobId || !cartItems?.length) return;
    const found = cartItems.find(ci => (ci.attributes || []).some(a => a.key === '_creation_job_id' && a.value === job.jobId));
    setLineId(found ? found.lineId : null);
  }, [job, cartItems]);

  if (!visible && !showPreview) return null;

  const onViewCart = () => {
    setVisible(false);
    try { new BroadcastChannel('magic-job').postMessage({ type: 'OPEN_CART' }); } catch {}
  };

  const onUndo = async () => {
    if (!lineId) return;
    try { await removeFromCart(lineId); } catch {}
    setVisible(false);
  };

  const title = (parsedPreview?.candleName as string) || 'Your Creation';
  const body = 'It has been added to your bag.';

  return (
    <>
      {visible && (
        <div
          className="fixed bottom-5 right-5 z-[100] max-w-sm shadow-lg"
          style={{ background: '#FEF9E7', border: '1px solid #E5E7EB', color: '#343A40', borderRadius: 12 }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 p-4">
            <span aria-hidden className="text-lg" style={{ color: '#00A19D' }}>✨</span>
            <div className="flex-1">
              <div className="font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>{`Your '${title}' is ready!`}</div>
              <div className="mt-1 text-sm" style={{ fontFamily: 'Poppins, system-ui, sans-serif' }}>{body}</div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={onViewCart}
                  className="px-3 py-1.5 rounded-md text-white text-sm"
                  style={{ background: '#F25287' }}
                >
                  View Cart
                </button>
                {parsedPreview ? (
                  <button onClick={() => { setVisible(false); setShowPreview(true); try { new BroadcastChannel('magic-job').postMessage({ type: 'CLOSE_CART' }); } catch {} }} className="text-sm underline" style={{ color: '#343A40' }}>
                    View Preview
                  </button>
                ) : null}
                {lineId ? (
                  <button onClick={onUndo} className="text-sm underline" style={{ color: '#343A40' }}>
                    Undo
                  </button>
                ) : null}
              </div>
            </div>
            <button onClick={() => setVisible(false)} className="ml-2 text-neutral-600" aria-label="Close">×</button>
          </div>
        </div>
      )}

      {showPreview && parsedPreview ? (
        <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title={title}>
          <div className="w-[90vw] max-w-lg rounded-xl border border-subtle-border bg-cream p-5 sm:p-6 text-neutral-dark">
            <div className="space-y-3">
              {(parsedPreview.paragraphs || []).slice(0, 2).map((p: string, i: number) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed">{p}</p>
              ))}
              {Array.isArray(parsedPreview.materials) && parsedPreview.materials.length > 0 ? (
                <div>
                  <div className="mb-2 text-sm font-semibold">Ingredients</div>
                  <ul className="space-y-1.5">
                    {parsedPreview.materials.map((m: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 inline-block h-2 w-2 flex-shrink-0 rounded-full" style={{ background: '#F25287' }} />
                        <span className="text-sm sm:text-base">{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="text-sm font-semibold text-neutral-dark underline underline-offset-2 hover:text-primary"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { setShowPreview(false); try { new BroadcastChannel('magic-job').postMessage({ type: 'OPEN_CART' }); } catch {} }}
                className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02]"
              >
                View in Cart
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}


