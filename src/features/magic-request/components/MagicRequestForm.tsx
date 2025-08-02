// src/features/magic-request/components/MagicRequestForm.tsx
'use client';

import { useState } from 'react';
import { post } from 'aws-amplify/api';
import outputs from '@root/amplify_outputs.json';


export default function MagicRequestForm() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('Medium 8oz');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ candleName: string; description: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const restOperation = post({
        apiName: outputs.custom.magicRequestApiName,
        path: '/magic-request',
        options: {
          body: {
            prompt,
            size,
          },
        },
      });

      const { body } = await restOperation.response;
      const response = await body.json();
      setResult(response);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Your Magic Candle</h2>
      <p className="text-gray-600 mb-8 text-center">
        Describe a feeling, a memory, or a vibe. We&apos;ll translate your vision into a unique candle scent.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
            Your Inspiration
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'a quiet library on a rainy afternoon' or 'a vibrant sunset over a tropical beach'"
            required
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
            Candle Size
          </label>
          <select
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>Small 4oz</option>
            <option>Medium 8oz</option>
            <option>Large 16oz</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {loading ? 'Creating Magic...' : 'Generate My Candle'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8 p-6 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{result.candleName}</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            {result.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 