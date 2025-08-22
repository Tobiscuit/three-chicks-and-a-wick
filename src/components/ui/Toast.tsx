'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, show, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm shadow-lg animate-fade-in-up"
         style={{ background: '#FEF9E7', border: '1px solid #E5E7EB', color: '#343A40', borderRadius: 12 }}
         role="status"
         aria-live="polite">
      <div className="flex items-start gap-3 p-4">
        <span aria-hidden className="text-lg" style={{ color: '#00A19D' }}>🎉</span>
        <div className="flex-1">
          <div className="font-semibold" style={{ fontFamily: 'Nunito, sans-serif' }}>{message}</div>
        </div>
        <button onClick={onClose} className="ml-2 text-neutral-600" aria-label="Close">×</button>
      </div>
    </div>
  );
}

