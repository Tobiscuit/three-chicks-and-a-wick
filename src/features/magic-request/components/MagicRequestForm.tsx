'use client';

import { useState } from 'react';
import { graphqlConfig } from '@/lib/graphql-config';
import { useCart } from '@/context/CartContext';

type PreviewBlock = {
  type: 'heading' | 'paragraph' | string;
  text?: string;
};

type MagicPreview = {
  candle?: { name?: string } | null;
  preview?: { blocks?: PreviewBlock[] } | null;
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

export default function MagicRequestForm() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState(candleSizes[0].value);
  const [wick, setWick] = useState(wickOptions[0].value);
  const [jar, setJar] = useState(jarOptions[0].value);
  const [generating, setGenerating] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewDescription, setPreviewDescription] = useState<string | null>(null);
  const { cartId, setCart } = useCart();

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    const query = `
      query MagicRequestV2($prompt: String!, $size: String!, $wick: String!, $jar: String!) {
        magicRequestV2(prompt: $prompt, size: $size, wick: $wick, jar: $jar) {
          json
        }
      }`;

    try {
      const response = await fetch(graphqlConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': graphqlConfig.apiKey,
        },
        body: JSON.stringify({
          query,
          variables: { prompt, size, wick, jar },
        }),
      });

      const responseData = await response.json();
      if (responseData.errors) {
        throw new Error(responseData.errors.map((e: { message: string }) => e.message).join('\n'));
      }

      const result = responseData.data?.magicRequestV2;
      if (!result || !result.json) {
        throw new Error('No preview data returned.');
      }
      const parsed = JSON.parse(result.json) as MagicPreview;
      setPreviewName(parsed?.candle?.name ?? null);
      const paragraph = parsed?.preview?.blocks?.find((block) => block.type === 'paragraph');
      const heading = parsed?.preview?.blocks?.find((block) => block.type === 'heading');
      const html = `
        ${heading ? `<h2>${heading.text}</h2>` : ''}
        ${paragraph ? `<p>${paragraph.text}</p>` : ''}
      `;
      setPreviewDescription(html);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message); else setError('An unknown error occurred.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddToCart = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdding(true);
    setError(null);

    const isExistingCart = !!cartId;
    const mutation = isExistingCart
      ? `
      mutation addToCart($prompt: String!, $size: String!, $wick: String!, $jar: String!, $cartId: ID!) {
        addToCart(prompt: $prompt, size: $size, wick: $wick, jar: $jar, cartId: $cartId) {
          id
          totalQuantity
          cost { totalAmount { amount currencyCode } }
          lines { id quantity attributes { key value } merchandise { id title price { amount currencyCode } } }
        }
      }`
      : `
      mutation createCartWithCustomItem($prompt: String!, $size: String!, $wick: String!, $jar: String!) {
        createCartWithCustomItem(prompt: $prompt, size: $size, wick: $wick, jar: $jar) {
          id
          totalQuantity
          cost { totalAmount { amount currencyCode } }
          lines { id quantity attributes { key value } merchandise { id title price { amount currencyCode } } }
        }
      }`;

    const variables = isExistingCart
      ? { prompt, size, wick, jar, cartId }
      : { prompt, size, wick, jar };

    try {
      const response = await fetch(graphqlConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': graphqlConfig.apiKey,
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      const responseData = await response.json();

      if (responseData.errors) {
        throw new Error(responseData.errors.map((e: { message: string }) => e.message).join('\n'));
      }
      
      const dataKey = isExistingCart ? 'addToCart' : 'createCartWithCustomItem';
      const newCart = responseData.data[dataKey];
      if (newCart) {
        setCart(newCart);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        setPrompt('');
        // Keep preview so user still sees what was generated
      } else {
        throw new Error('Cart data was not returned from the server.');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto font-body">
      <Toast message="Your candle was added to the cart!" show={showToast} />
      <form onSubmit={handleAddToCart} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="space-y-2">
          <label
            className="block text-neutral-dark text-lg font-bold font-sans"
            htmlFor="prompt"
          >
            What kind of candle are you imagining?
          </label>
          <p className="text-sm text-neutral-dark/80">
            Describe the scent, mood, or memory you want to capture.
          </p>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-4 bg-cream rounded-lg border-2 border-subtle-border 
                       focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent 
                       transition-all duration-300 ease-in-out"
            placeholder="e.g., 'A cozy library with hints of old books, vanilla, and a crackling fireplace.'"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-neutral-dark text-lg font-bold font-sans">
            Choose Your Candle Size
          </label>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {candleSizes.map((candle) => (
              <button
                key={candle.value}
                type="button"
                onClick={() => setSize(candle.value)}
                className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu 
                           ${
                             size === candle.value
                               ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105'
                               : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'
                           }`}
              >
                <span className="font-bold font-sans block">{candle.name}</span>
                <span className="text-sm">
                  {candle.value.match(/\((.*)\)/)?.[1]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-neutral-dark text-lg font-bold font-sans">
            Choose Your Wick
          </label>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {wickOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setWick(option.value)}
                className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu 
                           ${
                             wick === option.value
                               ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105'
                               : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'
                           }`}
              >
                <span className="font-bold font-sans block">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-neutral-dark text-lg font-bold font-sans">
            Choose Your Jar
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {jarOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setJar(option.value)}
                className={`text-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 transform-gpu 
                           ${
                             jar === option.value
                               ? 'bg-secondary text-neutral-dark border-secondary shadow-lg scale-105'
                               : 'bg-cream text-neutral-dark border-subtle-border hover:border-accent hover:-translate-y-1'
                           }`}
              >
                <span className="font-bold font-sans block">{option.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !prompt}
            className="w-full sm:w-auto btn-secondary disabled:opacity-50 disabled:scale-100"
          >
            {generating ? 'Conjuring...' : 'Reveal My Candle'}
          </button>
          {previewName && previewDescription && (
            <button
              type="submit"
              disabled={adding}
              className="w-full sm:w-auto btn-primary disabled:opacity-50 disabled:scale-100"
            >
              {adding ? 'Adding to Cart...' : 'Add My Candle to Cart'}
            </button>
          )}
        </div>
      </form>

      {previewName && previewDescription && (
        <div className="mt-6 bg-cream border-2 border-subtle-border rounded-lg p-5 space-y-2">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: previewDescription }} />
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
