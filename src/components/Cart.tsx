// src/components/Cart.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { RemoveScroll } from 'react-remove-scroll';
import Link from 'next/link';

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

// Re-simplified CartItemType
type CartItemType = {
  lineId: string;
  quantity: number;
  attributes?: { key: string; value: string }[];
  product: {
    title: string;
    image: {
      url: string;
      altText: string;
    };
    price: {
      amount: string;
      currencyCode: string;
    };
  };
};

function formatCurrency(amount: number, currencyCode: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

function CartItem({ item, onRemove, onUpdateQuantity, isFirstItem }: { item: CartItemType, onRemove: () => void, onUpdateQuantity: (lineId: string, newQuantity: number) => void, isFirstItem: boolean }) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const controls = useAnimation();

  useEffect(() => {
    let mounted = true;
    const timeouts: number[] = [];
    if (isMobile && isFirstItem) {
      const hintAnimation = async () => {
        await new Promise<number>(resolve => {
          const t = window.setTimeout(() => resolve(t), 500);
          timeouts.push(t);
        });
        if (mounted) await controls.start({ x: -60, transition: { type: 'spring', stiffness: 300, damping: 25 } });
        await new Promise<number>(resolve => {
          const t = window.setTimeout(() => resolve(t), 1500);
          timeouts.push(t);
        });
        if (mounted) controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      };
      hintAnimation();
    }
    return () => {
      mounted = false;
      timeouts.forEach(t => window.clearTimeout(t));
    };
  }, [isMobile, isFirstItem, controls]);

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
            <div className="flex flex-col items-center gap-2 pr-4">
                <button onClick={() => onUpdateQuantity(item.lineId, item.quantity + 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors">
                    <Plus size={18} />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.lineId, item.quantity - 1)} className="p-2 rounded-full bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>
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
  const { cartItems, removeFromCart, updateQuantity, checkoutUrl } = useCart();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const listRef = useRef<HTMLDivElement | null>(null);
  const [spotlight, setSpotlight] = useState(false);
  const [spotlightLineId, setSpotlightLineId] = useState<string | null>(null);

  // React to READY broadcast and then spotlight when cartItems refreshes
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    let pendingJobId: string | null = null;
    try {
      bc = new BroadcastChannel('magic-job');
      bc.onmessage = (ev) => {
        if (ev?.data?.type === 'READY') {
          pendingJobId = ev?.data?.job?.jobId || (typeof window !== 'undefined' ? localStorage.getItem('last_magic_job_id') : null);
        }
      };
    } catch {}
    return () => { try { if (bc) bc.close(); } catch {} };
  }, []);

  useEffect(() => {
    // Whenever cartItems change, try to spotlight the line for the last job
    const jobId = typeof window !== 'undefined' ? localStorage.getItem('last_magic_job_id') : null;
    if (!jobId || !cartItems?.length) return;
    const match = cartItems.find(ci => (ci.attributes || []).some(a => a.key === '_creation_job_id' && a.value === jobId));
    if (!match) return;
    setSpotlightLineId(match.lineId);
    setSpotlight(true);
    try { listRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
    const t = setTimeout(() => { setSpotlight(false); setSpotlightLineId(null); }, 4000);
    return () => clearTimeout(t);
  }, [cartItems]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price.amount) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
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
              
              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-3">
                  <h3 className="text-xl font-bold text-neutral-dark mb-2">Your cart is empty!</h3>
                  <p className="text-neutral-dark/80 mb-6">Looks like you haven&apos;t added anything yet.</p>
                  <Link href="/product-listings" onClick={onClose} className="btn-primary">
                      Start Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div ref={listRef} className={`flex-grow py-4 px-3 overflow-y-auto ${spotlight ? 'ring-2 ring-pink-400 rounded-md' : ''}`}>
                    <ul>
                      <AnimatePresence>
                         {cartItems.map((item, index) => (
                           <div key={item.lineId} className={spotlightLineId === item.lineId ? 'ring-2 ring-pink-400 rounded-md' : ''}>
                           <CartItem 
                            key={item.lineId} 
                            item={item as CartItemType}
                            onRemove={() => removeFromCart(item.lineId)}
                            onUpdateQuantity={updateQuantity}
                            isFirstItem={index === 0 && cartItems.length > 0}
                          />
                           </div>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  <div className="py-4 px-3 border-t border-neutral-dark/10">
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
            </motion.div>
          </RemoveScroll>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
