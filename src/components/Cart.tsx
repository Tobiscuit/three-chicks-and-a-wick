// src/components/Cart.tsx
'use client';

import { useCartStore, StandardItem, CustomCandleItem } from '@/context/cart-store';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RemoveScroll } from 'react-remove-scroll';
import Link from 'next/link';
import { amplifyApiClient } from '@/lib/client';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const cartVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 30 } },
  exit: { x: '100%', opacity: 0 },
};

const desktopCartVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
}

// NOTE: This is a placeholder. In a real app, you'd fetch this data.
const MOCK_PRODUCT_DETAILS: { [key: string]: { name: string; price: number; image: string } } = {
  '456789123': {
    name: 'The Classic Wick Trimmer',
    price: 24.0,
    image: '/images/wick-trimmer.jpg',
  },
};

function formatCurrency(amount: number, currencyCode: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

function CartItem({ item, onRemove, onUpdateQuantity, isFirstItem }: { item: StandardItem, onRemove: () => void, onUpdateQuantity: (variantId: string, newQuantity: number) => void, isFirstItem: boolean }) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const controls = useAnimation();
  const productDetails = MOCK_PRODUCT_DETAILS[item.variantId];

  useEffect(() => {
    if (isMobile && isFirstItem) {
      const hintAnimation = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await controls.start({ x: -60, transition: { type: 'spring', stiffness: 300, damping: 25 } });
        await new Promise(resolve => setTimeout(resolve, 1500));
        controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      };
      hintAnimation();
    }
  }, [isMobile, isFirstItem, controls]);
  
  if (!productDetails) {
    return (
      <li className="relative mb-4 overflow-hidden p-4 text-center">
        <p>Loading item...</p>
      </li>
    );
  }

  return (
    <li className="relative mb-4 overflow-hidden">
        <div className="absolute inset-y-0 right-0 flex items-center justify-center bg-destructive text-white w-20">
            <button onClick={onRemove} className="w-full h-full flex items-center justify-center">
                <Trash2 size={24} />
            </button>
        </div>
        <motion.div
            className="relative flex items-center gap-4 bg-cream"
            drag={isMobile ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.2, right: 0 }}
            onDragEnd={(event, info) => {
                if (info.offset.x < -80) {
                    onRemove();
                }
            }}
            animate={controls}
        >
            <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-dark/10 aspect-square">
                <Image
                    src={productDetails.image}
                    alt={productDetails.name}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-neutral-dark leading-tight">{productDetails.name}</h3>
                <p className="text-sm text-neutral-dark/80 mt-1">{formatCurrency(productDetails.price)}</p>
            </div>
            <div className="flex flex-col items-center gap-2 pr-4">
                <button onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors">
                    <Plus size={18} />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
                    <Minus size={18} />
                </button>
            </div>
            <div className="hidden md:block pr-2">
                <button onClick={onRemove} className="text-neutral-dark/50 hover:text-destructive transition-colors">
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    </li>
  );
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateItemQuantity, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => {
    if (item.type === 'STANDARD') {
      const details = MOCK_PRODUCT_DETAILS[item.variantId];
      return sum + (details ? details.price * item.quantity : 0);
    }
    // Add custom candle pricing logic here later
    return sum;
  }, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await amplifyApiClient.post({
        path: '/create-checkout',
        body: { items },
      });

      const { invoice_url } = await response.body.json();
      
      if (invoice_url) {
        window.location.href = invoice_url;
        clearCart();
      } else {
        console.error('Checkout URL not found in response');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-50 flex justify-end md:justify-center md:items-center"
          onClick={onClose}
        >
          <RemoveScroll>
            <motion.div
              variants={isDesktop ? desktopCartVariants : cartVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md h-full bg-cream shadow-xl flex flex-col md:h-auto md:max-h-[90vh] md:rounded-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-3 py-5 border-b border-neutral-dark/10">
                <h2 className="text-3xl font-extrabold text-neutral-dark">Your Cart</h2>
                <button onClick={onClose} className="text-neutral-dark hover:text-primary transition-colors">
                  <X size={28} />
                </button>
              </div>
              
              {items.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-3">
                  <h3 className="text-xl font-bold text-neutral-dark mb-2">Your cart is empty!</h3>
                  <p className="text-neutral-dark/80 mb-6">Looks like you haven&apos;t added anything yet.</p>
                  <Link href="/product-listings" onClick={onClose} className="btn-primary">
                      Start Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-grow py-4 px-3 overflow-y-auto">
                    <ul>
                      <AnimatePresence>
                        {items.map((item, index) => {
                          if (item.type === 'STANDARD') {
                            return (
                              <CartItem 
                                key={item.variantId} 
                                item={item}
                                onRemove={() => removeItem(item.variantId)}
                                onUpdateQuantity={updateItemQuantity}
                                isFirstItem={index === 0 && items.length > 0}
                              />
                            )
                          }
                          return null;
                        })}
                      </AnimatePresence>
                    </ul>
                  </div>

                  <div className="py-4 px-3 border-t border-neutral-dark/10">
                      <div className="flex justify-between items-center mb-4">
                          <p className="text-lg font-semibold text-neutral-dark">Subtotal</p>
                          <p className="text-xl font-bold text-neutral-dark">{formatCurrency(subtotal)}</p>
                      </div>
                      <button 
                        className="w-full btn-primary"
                        onClick={handleCheckout}
                        disabled={isCheckingOut || items.length === 0}
                      >
                        {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                      </button>
                       <button onClick={onClose} className="w-full text-center mt-4 text-sm text-neutral-dark hover:text-primary transition-colors">
                          or Continue Shopping
                      </button>
                  </div>
                </>
              )}
            </motion.div>
          </RemoveScroll>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
