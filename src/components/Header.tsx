// src/components/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu as MenuIcon, X } from 'lucide-react';
import Cart from './Cart';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/product-listings', label: 'Shop' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

const MobileMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-dark/40 backdrop-blur-sm md:hidden"
      onClick={onClose}
    >
      <div
        className="fixed left-0 top-0 h-full w-4/5 max-w-sm bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-dark transition-colors hover:bg-neutral-dark/10"
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>
        <nav className="mt-8 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-bold text-neutral-dark transition-colors hover:text-primary"
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="py-4">
        <div className="container mx-auto flex items-center justify-between px-6">
          <div className="flex-1 md:hidden">
            <button
              className="rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>

          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/">
              <Image
                src="/images/VectorLogoV2-filled.svg" // Corrected Path
                alt="Three Chicks and a Wick Logo"
                width={100}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-lg font-bold text-neutral-dark md:flex flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1 flex justify-end items-center gap-2.5">
            <button className="hidden rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white md:block">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-xs text-white">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
} 