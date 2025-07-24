'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useCart, CartProduct } from '@/context/CartContext';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    href: string;
    imageUrl: string;
    name: string;
    price: string;
    id: string; // Product ID
    variantId: string; // Variant ID
  };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productToAdd: CartProduct = {
      id: product.id,
      variantId: product.variantId,
      title: product.name,
      price: {
        amount: product.price.replace('$', ''), // Assuming price is in format "$XX.XX"
        currencyCode: 'USD', // Assuming USD
      },
      image: {
        url: product.imageUrl,
        altText: product.name,
      },
    };
    addToCart(productToAdd);
    onClose(); // Close modal after adding to cart
  };

  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-end">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-l-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-screen">
                <div className="flex justify-between items-center">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Quick View
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </button>
                </div>
                <div className="mt-8">
                  <div className="aspect-square relative w-full overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                  <div className="mt-6">
                    <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                    <p className="text-2xl mt-2 text-gray-900">{product.price}</p>
                    <p className="mt-4 text-gray-500">
                      This is a placeholder description. Full product details are available on the product page.
                    </p>
                    <div className="mt-10">
                      <button type="button" className="btn-primary w-full" onClick={handleAddToCart}>
                        Add to cart
                      </button>
                      <p className="mt-6 text-center">
                        <Link href={product.href} className="text-sm font-medium text-primary hover:text-primary/80" onClick={onClose}>
                          View full details
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 