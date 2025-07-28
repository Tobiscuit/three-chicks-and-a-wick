// src/components/HeaderClient.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu as MenuIcon, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Cart from './Cart';
import { RemoveScroll } from 'react-remove-scroll'; // Import the new component

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/product-listings', label: 'Shop' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

const MobileMenu = ({
  isOpen,
  onClose,
  isLoggedIn,
}: {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <RemoveScroll>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-dark/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-cream p-6 shadow-lg"
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
              <nav className="mt-16 flex flex-col items-center gap-8 text-center">
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
                 <div className="mt-8 border-t border-neutral-dark/10 pt-8 w-full flex flex-col items-center gap-8">
                  {isLoggedIn ? (
                    <>
                      <Link href="/account" className="text-2xl font-bold text-neutral-dark transition-colors hover:text-primary" onClick={onClose}>Account</Link>
                      <Link href="/api/auth/logout" className="text-2xl font-bold text-neutral-dark transition-colors hover:text-primary" onClick={onClose}>Logout</Link>
                    </>
                  ) : (
                    <Link href="/api/auth/login" className="text-2xl font-bold text-neutral-dark transition-colors hover:text-primary" onClick={onClose}>Login</Link>
                  )}
                </div>
              </nav>
            </motion.div>
          </motion.div>
        </RemoveScroll>
      )}
    </AnimatePresence>
  );
};

export default function HeaderClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false); // State for cart visibility
  const { cartItems } = useCart();

  // The old useEffect for scroll-locking is no longer needed here

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className={`py-4 transition-transform duration-300`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1 lg:hidden">
            <button
              className="rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start">
            <Link href="/">
              <Image
                src="/images/Correct-Name-2.svg"
                alt="Three Chicks and a Wick Logo"
                width={150}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <nav className="hidden items-center gap-8 text-lg font-bold text-neutral-dark lg:flex flex-1 justify-center">
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
             <Link href={isLoggedIn ? "/account" : "/api/auth/login"} className="hidden rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-gray-100 lg:block">
              <User className="h-5 w-5" />
              <span className="sr-only">{isLoggedIn ? "Account" : "Login"}</span>
            </Link>
            <button
              onClick={() => setCartOpen(true)} // Toggle cart state
              className="relative rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-gray-100"
            >
              <ShoppingCart className="h-6 w-6" />
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
        isLoggedIn={isLoggedIn}
      />
      <Cart isOpen={isCartOpen} onClose={() => setCartOpen(false)} /> {/* Render Cart here */}
    </>
  );
} 