'use client';

import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import SlideOutPanel from './ui/SlideOutPanel';

export default function Cart({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cartItems, subtotal, checkoutUrl } = useCart();

  return (
    <SlideOutPanel isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full flex-col overflow-y-scroll bg-cream shadow-xl rounded-l-2xl">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-medium text-neutral-dark">
              Shopping cart
            </h2>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative -m-2 p-2 text-neutral-dark/70 hover:text-neutral-dark"
                onClick={onClose}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close panel</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-8">
            <div className="flow-root">
              {/* Cart items will be rendered here */}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-dark/20 px-4 py-6 sm:px-6">
          <div className="flex justify-between text-base font-medium text-neutral-dark">
            <p>Subtotal</p>
            <p>${(subtotal || 0).toFixed(2)}</p>
          </div>
          <p className="mt-0.5 text-sm text-neutral-dark/70">
            Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-6">
            <Link
              href={checkoutUrl || '#'}
              className="flex items-center justify-center rounded-md border border-transparent bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-dark"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
}
