// src/components/Cart.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { X } from 'lucide-react';
import Image from 'next/image';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { cartItems, removeFromCart } = useCart();

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price.amount) * item.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md h-full bg-cream shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-neutral-dark/10">
          <h2 className="text-2xl font-bold text-neutral-dark">Your Cart</h2>
          <button onClick={onClose} className="text-neutral-dark hover:text-primary transition-colors">
            <X size={28} />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
            <h3 className="text-xl font-semibold text-neutral-dark mb-2">Your cart is empty!</h3>
            <p className="text-neutral-dark/80 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <button
                onClick={onClose}
                className="btn-primary"
            >
                Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow p-6 overflow-y-auto">
              <ul>
                {cartItems.map(item => (
                  <li key={item.product.id} className="flex items-center gap-4 mb-6">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-neutral-dark/10">
                        <Image
                            src={item.product.image.url}
                            alt={item.product.image.altText}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-neutral-dark">{item.product.title}</h3>
                      <p className="text-sm text-neutral-dark/80">${item.product.price.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Quantity controls will go here */}
                        <p className="font-bold">{item.quantity}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-dark/50 hover:text-red-500 transition-colors">
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 border-t border-neutral-dark/10">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-neutral-dark">Subtotal</p>
                    <p className="text-xl font-bold text-neutral-dark">${subtotal.toFixed(2)}</p>
                </div>
                <button className="w-full btn-primary">
                    Proceed to Checkout
                </button>
                 <button onClick={onClose} className="w-full text-center mt-4 text-sm text-neutral-dark hover:text-primary transition-colors">
                    or Continue Shopping
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 