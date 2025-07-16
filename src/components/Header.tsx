import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from './ui/button';

const navLinks = [
  { href: '/product-listings', label: 'Candles' },
  { href: '/product-listings', label: 'Crafts' },
  { href: '/about-us', label: 'About Us' },
  { href: '/contact-us', label: 'Contact' },
];

function MobileNav() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="mt-8 flex flex-col gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href + link.label}
                className="text-2xl font-semibold text-[var(--neutral-dark)] hover:text-[var(--primary)]"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-8 md:flex">
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
          <h2 className="text-xl font-black tracking-tighter text-[var(--neutral-dark)] md:text-2xl">
            Three Chicks and a Wick
          </h2>
        </Link>
        <div className="flex items-center gap-2">
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