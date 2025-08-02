'use client';

import MagicRequestForm from '@/features/magic-request/components/MagicRequestForm';

export default function MagicRequestPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Create Your Magic Candle
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Unleash your creativity and design a candle that&apos;s uniquely yours. Describe a feeling, a memory, or a vibe, and let our AI-powered chandler craft a scent experience just for you.
          </p>
        </div>
        <MagicRequestForm />
      </div>
    </div>
  );
} 