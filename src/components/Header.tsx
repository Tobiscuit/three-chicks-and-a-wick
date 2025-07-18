"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

const shopDropdownLinks = [
  { href: '/product-listings', label: 'All Products' },
  { href: '/product-listings', label: 'Candles' },
  { href: '/product-listings', label: 'Crafts' },
  { href: '/product-listings', label: 'New Arrivals' },
];

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16" />
    </svg>
  );
}

function MobileNavPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity ${
        isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[var(--neutral-light)] shadow-2xl transition-transform duration-300 ease-out-back ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="flex flex-col items-center justify-center gap-8 p-12">
          <Link href="/product-listings" className="btn-primary" onClick={onClose}>
            Find Your Fun
          </Link>
          <Link
            href="/product-listings"
            className="text-3xl font-bold text-[var(--neutral-dark)] transition-colors hover:text-[var(--primary)]"
            onClick={onClose}
          >
            Shop
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              className="text-3xl font-bold text-[var(--neutral-dark)] transition-colors hover:text-[var(--primary)]"
              href={link.href}
              onClick={onClose}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function DesktopNav() {
  const [isShopOpen, setShopOpen] = useState(false);

  return (
    <nav className="hidden items-center gap-6 lg:flex">
      <div
        className="relative"
        onMouseEnter={() => setShopOpen(true)}
        onMouseLeave={() => setShopOpen(false)}
      >
        <button className="flex items-center gap-1 text-lg font-semibold text-[var(--neutral-dark)] transition-colors hover:text-[var(--primary)]">
          Shop
          <ChevronDownIcon
            className={`h-5 w-5 transition-transform ${
              isShopOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`absolute top-full z-10 mt-2 w-48 rounded-2xl bg-white p-2 shadow-xl transition-all ${
            isShopOpen
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          {shopDropdownLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="block rounded-lg px-4 py-2 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-[var(--neutral-light)] hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      {navLinks.map((link) => (
        <Link
          key={link.href + link.label}
          className="relative text-lg font-semibold text-[var(--neutral-dark)] transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-[var(--primary)] after:transition-all after:duration-300 hover:text-[var(--primary)] hover:after:w-full"
          href={link.href}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-b-black/5 bg-[var(--neutral-light)]/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-1">
          <Link
            className="flex items-center gap-2 text-2xl font-black tracking-tighter text-[var(--neutral-dark)]"
            href="/"
          >
            <Image
              src="/images/Correct-Name-2.svg"
              alt="Three Chicks and a Wick logo"
              width={128}
              height={35}
              className="h-auto w-32"
            />
            <span className="sr-only">Three Girls and a Wick</span>
          </Link>
          <div className="flex items-center gap-4">
            <DesktopNav />
            <Link
              href="/product-listings"
              className="btn-primary hidden lg:inline-flex"
            >
              Find Your Fun
            </Link>
            <div className="hidden h-8 w-px bg-black/10 lg:block" />
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white">
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </button>
              <button className="rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white">
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="sr-only">Shopping Cart</span>
              </button>
              <div className="lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="rounded-full bg-white p-3 shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon className="h-6 w-6 text-neutral-dark" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileNavPanel
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
} 