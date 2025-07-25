'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart, CartItem } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

function QuantitySelector({ item, updateQuantity, isCartLoading }: {
    item: CartItem;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    isCartLoading: boolean;
}) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
            <button
                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={item.quantity <= 1 || isCartLoading}
            >
                <Minus size={16} />
            </button>
            <p className="font-bold w-6 text-center text-md">{item.quantity}</p>
            <button
                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                disabled={isCartLoading}
            >
                <Plus size={16} />
            </button>
        </div>
    );
}

export default function Cart({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const { cartItems, checkoutUrl, removeFromCart, updateQuantity, isCartLoading } = useCart();

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + parseFloat(item.product.price.amount) * item.quantity;
  }, 0);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-4 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-cream shadow-xl rounded-2xl">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-bold text-neutral-dark">
                          Shopping Cart
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="-m-2 p-2 text-neutral-dark hover:text-neutral-dark/70"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {cartItems.length > 0 ? (
                            <ul role="list" className="-my-6 divide-y divide-gray-200">
                              {cartItems.map((item) => (
                                <li key={item.lineId} className="flex py-6">
                                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
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
                                      <QuantitySelector item={item} updateQuantity={updateQuantity} isCartLoading={isCartLoading} />
                                      <div className="flex">
                                        <button 
                                          onClick={() => removeFromCart(item.lineId)} 
                                          type="button" 
                                          className="font-medium text-gray-500 hover:text-primary-dark disabled:opacity-50"
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
                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-neutral-dark">
                          <p>Subtotal</p>
                          <p>${subtotal.toFixed(2)}</p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                          <a href={checkoutUrl || '#'} className="btn-primary">
                            Checkout
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 