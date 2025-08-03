// src/features/magic-request/components/MagicRequestForm.tsx
'use client';

import { useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export default function MagicRequestForm() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, errors } = await client.queries.magicRequest({
        prompt,
      });

      if (errors) {
        throw new Error(errors.map((e: { message: string }) => e.message).join('\n'));
      }
      
      if (data) {
        // The simplified function returns a stringified JSON string, so we parse it.
        const parsedData = JSON.parse(data);
        setResult(parsedData);
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="prompt"
          >
            Enter a message
          </label>
          <input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Hello world"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">An Error Occurred</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
      {result && (
        <div className="mt-6 p-4 border rounded shadow-lg">
          <h3 className="text-xl font-bold mb-2">Response from Backend:</h3>
          <p className="font-mono bg-gray-100 p-2 rounded">{result}</p>
        </div>
      )}
    </div>
  );
} 