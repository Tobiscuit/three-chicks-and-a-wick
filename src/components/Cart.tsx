'use client';

import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import SlideOutPanel from '@/components/ui/SlideOutPanel';

function QuantitySelector({ item, updateQuantity, isCartLoading }: {
    item: CartItem;
    updateQuantity: (lineId: string, quantity: number) => void;
    isCartLoading: boolean;
}) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-neutral-dark/20 p-1">
            <button
                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-neutral-dark/10 transition-colors disabled:opacity-50"
                disabled={item.quantity <= 1 || isCartLoading}
            >
                <Minus size={16} />
            </button>
            <p className="font-bold w-6 text-center text-md">{item.quantity}</p>
            <button
                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-neutral-dark/10 transition-colors disabled:opacity-50"
                disabled={isCartLoading}
            >
                <Plus size={16} />
            </button>
        </div>
    );
}

export default function Cart({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const { cartItems, checkoutUrl, removeFromCart, updateQuantity, isCartLoading, proceedToCheckout } = useCart();

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parseFloat(item.product.price.amount) * item.quantity;
  }, 0);

  return (
    <SlideOutPanel isOpen={open} onClose={() => setOpen(false)} title="Shopping Cart">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mt-8">
            <div className="flow-root">
              {cartItems.length > 0 ? (
                <ul role="list" className="-my-6 divide-y divide-neutral-dark/20">
                  {cartItems.map((item) => (
                    <li key={item.lineId} className="flex py-6">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-dark/20 relative">
                        <Image
                          src={item.product.image.url}
                          alt={item.product.image.altText || item.product.title}
                          fill
                          sizes="96px"
                          className="h-full w-full object-cover object-center"
                          priority
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-neutral-dark">
                            <h3>
                              <Link href={`/products/${item.product.handle}`}>{item.product.title}</Link>
                            </h3>
                            <p className="ml-4">${parseFloat(item.product.price.amount).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm mt-4">
                          <QuantitySelector item={item} updateQuantity={(lineId, quantity) => updateQuantity(lineId, quantity)} isCartLoading={isCartLoading} />
                          <div className="flex">
                            <button 
                              onClick={() => removeFromCart(item.lineId)} 
                              type="button" 
                              className="font-medium text-neutral-dark/50 hover:text-primary-dark disabled:opacity-50"
                              disabled={isCartLoading}
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg font-medium text-neutral-dark">Your cart is empty</p>
                  <Link href="/product-listings" className="btn-primary mt-4" onClick={() => setOpen(false)}>
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-neutral-dark/20 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-neutral-dark">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-neutral-dark/60">Shipping and taxes calculated at checkout.</p>
            <div className="mt-6">
              <button onClick={proceedToCheckout} className="btn-primary" disabled={isCartLoading}>
                {isCartLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </SlideOutPanel>
  );
}
