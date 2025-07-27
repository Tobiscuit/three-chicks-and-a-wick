// src/components/Cart.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatCurrency(amount: number, currencyCode: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export default function Cart({ isOpen, onClose }: CartProps) {
  // Get the checkoutUrl directly from the cart context
  const { cartItems, removeFromCart, updateQuantity, checkoutUrl } = useCart();

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price.amount) * item.quantity;
  }, 0);

  // The new checkout handler is much simpler
  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-50 flex justify-end" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md h-full bg-cream shadow-xl flex flex-col" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-4 py-5 border-b border-neutral-dark/10">
          <h2 className="text-3xl font-extrabold text-neutral-dark">Your Cart</h2>
          <button onClick={onClose} className="text-neutral-dark hover:text-primary transition-colors">
            <X size={28} />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <h3 className="text-xl font-bold text-neutral-dark mb-2">Your cart is empty!</h3>
            <p className="text-neutral-dark/80 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <button onClick={onClose} className="btn-primary">
                Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-grow p-4 overflow-y-auto">
              <ul>
                {cartItems.map(item => (
                  <li key={item.lineId} className="flex items-center gap-4 mb-4">
                    <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-neutral-dark/10">
                        <Image
                            src={item.product.image.url}
                            alt={item.product.image.altText}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-neutral-dark leading-tight">{item.product.title}</h3>
                      <p className="text-sm text-neutral-dark/80 mt-1">{formatCurrency(parseFloat(item.product.price.amount), item.product.price.currencyCode)}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors">
                            <Plus size={18} />
                        </button>
                        <p className="font-bold w-8 text-center">{item.quantity}</p>
                        <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
                            <Minus size={18} />
                        </button>
                    </div>
                    <button onClick={() => removeFromCart(item.lineId)} className="text-neutral-dark/50 hover:text-destructive transition-colors self-start p-1">
                      <X size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 border-t border-neutral-dark/10">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold text-neutral-dark">Subtotal</p>
                    <p className="text-xl font-bold text-neutral-dark">{formatCurrency(subtotal, cartItems[0]?.product.price.currencyCode)}</p>
                </div>
                <button 
                  className="w-full btn-primary"
                  onClick={handleCheckout}
                  disabled={!checkoutUrl}
                >
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
