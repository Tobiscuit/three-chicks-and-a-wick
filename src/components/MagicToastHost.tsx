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
          setVisible(true);
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

  if (!visible) return null;

  const onViewCart = () => {
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
                <button onClick={() => setShowPreview(true)} className="text-sm underline" style={{ color: '#343A40' }}>
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

      {showPreview && parsedPreview ? (
        <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title={title}>
          <div className="space-y-3" style={{ color: '#343A40' }}>
            {(parsedPreview.paragraphs || []).slice(0,2).map((p: string, i: number) => (
              <p key={i} className="text-sm leading-relaxed">{p}</p>
            ))}
            {Array.isArray(parsedPreview.materials) && parsedPreview.materials.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {parsedPreview.materials.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full" style={{ background: '#F25287' }} />
                    <span className="text-sm">{m}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </Modal>
      ) : null}
    </>
  );
}


