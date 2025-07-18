"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navLinks = [
  { href: '/product-listings', label: 'Candles' },
  { href: '/product-listings', label: 'Crafts' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

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

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-white p-3 shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
        aria-label="Open navigation menu"
      >
        <MenuIcon className="h-6 w-6 text-neutral-dark" />
      </button>

      <div
        className={`fixed inset-0 z-50 transform bg-black/30 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute bottom-0 left-0 right-0 rounded-t-3xl bg-[var(--neutral-light)] shadow-2xl transition-transform duration-500 ease-in-out ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col items-center justify-center gap-8 p-12">
            {navLinks.map((link) => (
              <Link
                key={link.href + link.label}
                className="text-3xl font-bold text-[var(--neutral-dark)] transition-colors hover:text-[var(--primary)]"
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-6 lg:flex">
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
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-black/5 bg-[var(--neutral-light)]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          className="flex items-center gap-2 text-2xl font-black tracking-tighter text-[var(--neutral-dark)]"
          href="/"
        >
          <Image
            src="/images/3C&AW.svg"
            alt="Three Girls and a Wick logo"
            width={48}
            height={48}
            className="h-12 w-12"
          />
          <span className="hidden sm:inline">Three Girls and a Wick</span>
        </Link>
        <div className="flex items-center gap-4">
          <DesktopNav />
          <div className="hidden h-8 w-px bg-black/10 lg:block" />
          <div className="flex items-center gap-2">
            <button className="hidden rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white sm:block">
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
            <button className="rounded-full bg-white p-2.5 text-neutral-dark shadow-md transition-colors hover:bg-primary-dark hover:text-white">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="sr-only">Shopping Cart</span>
            </button>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
} 