'use client';

import { useEffect, useState } from 'react';
import { graphqlConfig } from '@/lib/graphql-config';
// import { useCart } from '@/context/CartContext';
// Legacy HTML preview removed; we render from JSON blocks only

type PreviewBlock = {
  type: 'heading' | 'paragraph' | 'bulletList' | string;
  level?: 1 | 2 | 3 | 4;
  text?: string;
  items?: string[];
};

type MagicPreview = {
  version?: string;
  candle?: { name?: string; size?: string } | null;
  html?: string | null;
  preview?: { blocks?: PreviewBlock[] } | null;
  design?: {
    tokens?: {
      backgroundHex?: string;
      headingHex?: string;
      bodyHex?: string;
      accentHex?: string;
    };
    classes?: {
      container?: string;
      heading?: string;
      paragraph?: string;
      list?: string;
    };
  } | null;
  animation?: { entrance?: 'fadeInUp' | 'fadeIn' | 'slideUp'; durationMs?: number } | null;
};

const Toast = ({ message, show }: { message: string; show: boolean }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg animate-bounce">
      {message}
    </div>
  );
};

const candleSizes = [
  { name: 'The Spark', value: 'The Spark (8oz)' },
  { name: 'The Flame', value: 'The Flame (12oz)' },
  { name: 'The Glow', value: 'The Glow (16oz)' },
];

const wickOptions = [
  { name: 'Cotton', value: 'Cotton' },
  { name: 'Hemp', value: 'Hemp' },
  { name: 'Wood', value: 'Wood' },
];

const jarOptions = [
  { name: 'Standard Tin', value: 'Standard Tin' },
  { name: 'Amber Glass', value: 'Amber Glass' },
  { name: 'Frosted Glass', value: 'Frosted Glass' },
  { name: 'Ceramic', value: 'Ceramic' },
];

const waxOptions = [
  { name: 'Soy', value: 'Soy' },
  { name: 'Beeswax', value: 'Beeswax' },
  { name: 'Coconut Soy', value: 'Coconut Soy' },
];

export default function MagicRequestForm() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState(candleSizes[0].value);
  const [wick, setWick] = useState(wickOptions[0].value);
  const [jar, setJar] = useState(jarOptions[0].value);
  const [wax, setWax] = useState(waxOptions[0].value);
  const [generating, setGenerating] = useState(false);
  // Legacy synchronous add-to-cart state removed as we commit to async flow
  // Removed legacy adding state; keep minimal locals only
  const [error, setError] = useState<string | null>(null);
  const [showToast] = useState(false);
  const [previewData, setPreviewData] = useState<MagicPreview | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
	const [cartId] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null);

  useEffect(() => {
    // TEMP DIAGNOSTIC: log all broadcast events for verification
    let diag: BroadcastChannel | null = null;
    try {
      diag = new BroadcastChannel('magic-job');
      const handle = (ev: MessageEvent) => {
        try { console.log('[MagicRequestForm] Received broadcast event:', ev?.data); } catch {}
      };
      diag.addEventListener('message', handle as EventListener);
      return () => { try { diag && diag.removeEventListener('message', handle as EventListener); diag?.close(); } catch {} };
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // Listen for global READY event from MagicJobWatcher
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('magic-job');
      bc.onmessage = (ev) => {
        const data = ev?.data;
        if (data?.type === 'READY' && data?.job) {
          // Always unstick generating
          setGenerating(false);
          // Parse aiJson robustly: it may be a string or an object
          try {
            const raw = data.job.aiJson;
            const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
            if (parsed) setPreviewData(parsed);
          } catch { /* ignore */ }
        }
      };
    } catch { /* no-op */ }
    return () => { try { if (bc) bc.close(); } catch {} };
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    // Start async preview job (hybrid async)
    const startMutation = `
      mutation StartMagicRequest($prompt: String!, $size: String!, $wick: String!, $jar: String!, $wax: String!, $cartId: ID) {
        startMagicRequest(prompt: $prompt, size: $size, wick: $wick, jar: $jar, wax: $wax, cartId: $cartId) {
          jobId
          status
        }
      }`;

    try {
      const response = await fetch(graphqlConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': graphqlConfig.apiKey,
        },
        body: JSON.stringify({ query: startMutation, variables: { prompt, size, wick, jar, wax, cartId } }),
      });

      const responseData = await response.json();
      if (responseData.errors) {
        throw new Error(responseData.errors.map((e: { message: string }) => e.message).join('\n'));
      }

      const started = responseData.data?.startMagicRequest;
      if (!started?.jobId) throw new Error('Failed to start preview job.');
      setJobId(started.jobId);
      try {
        localStorage.setItem('magic_job_id', started.jobId);
        localStorage.setItem('last_magic_job_id', started.jobId);
      } catch {}
      try {
        // Explicitly wake the watcher to begin polling immediately
        window.dispatchEvent(new CustomEvent('start-magic-job', { detail: { jobId: started.jobId } }));
      } catch {}
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message); else setError('An unknown error occurred.');
    } finally {
      // generating will be cleared when the watcher fires READY
    }
  };

  // Legacy synchronous add-to-cart handler removed

  return (
    <div className="w-full mx-auto font-body max-w-4xl">
      <Toast message="Your candle was added to the cart!" show={showToast} />
      <form className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: options */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-neutral-dark text-lg font-bold font-sans">Choose Your Wax</label>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {waxOptions.map((option) => (
                  <button key={option.value} type="button" onClick={() => setWax(option.value)}
                    className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu ${wax === option.value ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105' : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'}`}>
                    <span className="font-bold font-sans block">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-neutral-dark text-lg font-bold font-sans">Choose Your Candle Size</label>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {candleSizes.map((candle) => (
                  <button key={candle.value} type="button" onClick={() => setSize(candle.value)}
                    className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu ${size === candle.value ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105' : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'}`}>
                    <span className="font-bold font-sans block">{candle.name}</span>
                    <span className="text-sm">{candle.value.match(/\((.*)\)/)?.[1]}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-neutral-dark text-lg font-bold font-sans">Choose Your Wick</label>
              <div className="grid grid-cols-3 gap-4 pt-2">
                {wickOptions.map((option) => (
                  <button key={option.value} type="button" onClick={() => setWick(option.value)}
                    className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu ${wick === option.value ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105' : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'}`}>
                    <span className="font-bold font-sans block">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-neutral-dark text-lg font-bold font-sans">Choose Your Jar</label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 pt-2">
                {jarOptions.map((option) => (
                  <button key={option.value} type="button" onClick={() => setJar(option.value)}
                    className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu ${jar === option.value ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105' : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'}`}>
                    <span className="font-bold font-sans block">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: prompt and actions */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-neutral-dark text-lg font-bold font-sans" htmlFor="prompt">What kind of candle are you imagining?</label>
              <p className="text-sm text-neutral-dark/80">Describe the scent, mood, or memory you want to capture.</p>
              <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-48 p-4 bg-cream rounded-lg border-2 border-subtle-border focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-300 ease-in-out"
                placeholder="e.g., 'A cozy library with hints of old books, vanilla, and a crackling fireplace.'" required />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="button" onClick={handleGenerate} disabled={generating || !prompt} className="w-full sm:w-auto btn-secondary disabled:opacity-50 disabled:scale-100">
                {generating ? 'Conjuring...' : 'Reveal My Candle'}
              </button>
              {/* Add-to-cart button removed; async flow auto-adds in backend */}
            </div>
          </div>
        </div>
      </form>

      {/* Output below */}
      {previewData && (
        <div className="mt-8 md:mt-10 max-w-3xl mx-auto">
          <PreviewBlocks preview={previewData} />
        </div>
      )}
      {error && (
        <div
          className="bg-destructive/10 border-2 border-destructive text-destructive/80 px-4 py-3 rounded-lg relative mt-6"
          role="alert"
        >
          <strong className="font-bold font-sans">Oh no, something went wrong!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
    </div>
  );
}

function PreviewBlocks({ preview }: { preview: MagicPreview }) {
  const bg = preview.design?.tokens?.backgroundHex || '#FFF7ED';
  const headingColor = preview.design?.tokens?.headingHex || '#1F2937';
  const bodyColor = preview.design?.tokens?.bodyHex || '#374151';
  const accent = preview.design?.tokens?.accentHex || '#F472B6';
  const containerClasses = preview.design?.classes?.container || 'rounded-xl p-5';
  const headingClasses = preview.design?.classes?.heading || 'font-headings text-2xl sm:text-3xl';
  const paragraphClasses = preview.design?.classes?.paragraph || 'font-body text-base sm:text-lg';
  const listClasses = preview.design?.classes?.list || 'list-none space-y-2';

  return (
    <div className="mt-6 rounded-2xl border-2 border-cream bg-cream p-3 sm:p-4">
      <div
        className={`rounded-xl shadow-sm ${containerClasses}`}
        style={{ backgroundColor: bg, color: bodyColor }}
      >
        <div className="space-y-3">
          {(preview.preview?.blocks || []).map((block, idx) => {
          if (block.type === 'heading') {
            const Tag = (block.level && block.level >= 1 && block.level <= 4 ? (`h${block.level}` as const) : 'h2');
            return (
              <Tag key={idx} className={headingClasses} style={{ color: headingColor }}>
                {block.text}
              </Tag>
            );
          }
          if (block.type === 'paragraph') {
            return (
              <p key={idx} className={paragraphClasses}>
                {block.text}
              </p>
            );
          }
          if (block.type === 'bulletList') {
            return (
              <ul key={idx} className={listClasses}>
                {(block.items || []).map((it, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span
                      className="mt-2 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                    <span className={paragraphClasses}>{it}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return null;
          })}
          <div className="h-1 rounded-full" style={{ backgroundColor: accent, opacity: 0.3 }} />
        </div>
      </div>
    </div>
  );
}
