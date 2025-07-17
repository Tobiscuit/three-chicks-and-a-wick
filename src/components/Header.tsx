"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/product-listings', label: 'Candles' },
  { href: '/product-listings', label: 'Crafts' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-white p-3 shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
      >
        <Menu className="h-6 w-6 text-neutral-dark" />
        <span className="sr-only">Open menu</span>
      </button>

      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        ></div>
        <div className="absolute bottom-0 left-0 right-0 h-[65vh] rounded-t-3xl bg-white shadow-lg">
          <div className="relative flex h-full flex-col">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 rounded-full bg-white p-2 shadow-md transition-transform hover:scale-110"
            >
              <X className="size-6 text-[var(--neutral-dark)]" />
              <span className="sr-only">Close menu</span>
            </button>
            <nav className="flex h-full flex-col items-center justify-evenly gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href + link.label}
                  className="text-2xl font-semibold text-[var(--neutral-dark)] hover:text-[var(--primary)]"
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
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navLinks.map(link => (
        <Link
          key={link.href + link.label}
          className="font-medium text-[var(--neutral-dark)] hover:text-[var(--primary)]"
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
    <header className="sticky top-0 z-50 bg-[var(--neutral-light)]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <Image
            src="/images/3C&AW.svg"
            alt="Three Chicks and a Wick logo"
            width={100}
            height={100}
            className="h-16 w-16"
          />
          <h2 className="text-xl font-black tracking-tighter text-[var(--neutral-dark)] lg:text-2xl">
            Three Chicks and a Wick
          </h2>
        </Link>
        <div className="flex items-center gap-8">
            <DesktopNav />
            <div className="flex items-center gap-4">
            <Link
                className="btn-primary hidden sm:inline-block"
                href="/product-listings"
            >
                Shop Now
            </Link>
            <button className="rounded-full bg-[var(--white)] p-3 text-[var(--neutral-dark)] shadow-md transition-colors hover:bg-[var(--primary)] hover:text-white">
                <svg
                fill="currentColor"
                height="24"
                viewBox="0 0 256 256"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
                >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                </svg>
            </button>
            <MobileNav />
            </div>
        </div>
      </div>
    </header>
  );
} 