import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--neutral-light)]/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link className="flex items-center gap-3" href="/">
          <svg
            className="h-8 w-8 text-[var(--primary)]"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4C13.5 4 4.8 12.1 4 22.2C3.2 32.3 10.2 41.4 19.8 43.5c1.1.2 1.5-.5 1.5-1.1v-4c-4.5.9-5.4-1.9-5.4-1.9-1-2.5-2.4-3.2-2.4-3.2-1.9-1.3.1-1.3.1-1.3 2.1.1 3.2 2.1 3.2 2.1 1.9 3.2 4.9 2.3 6.1 1.8.2-1.4.7-2.3 1.3-2.8-4.6-.5-9.5-2.3-9.5-10.3 0-2.3.8-4.1 2.1-5.6-.2-.5-.9-2.6.2-5.5 0 0 1.7-.5 5.7 2.1 1.6-.4 3.4-.7 5.1-.7s3.5.2 5.1.7c4-2.7 5.7-2.1 5.7-2.1 1.1 2.9.4 5 .2 5.5 1.3 1.5 2.1 3.3 2.1 5.6 0 8.1-4.8 9.8-9.5 10.3.8.7 1.5 2 1.5 4v5.9c0 .6.4 1.3 1.5 1.1C37.8 41.4 44.8 32.3 44 22.2 43.2 12.1 34.5 4 24 4z"
              fill="currentColor"
            ></path>
          </svg>
          <h2 className="text-2xl font-black tracking-tighter text-[var(--neutral-dark)]">
            Three Girls and a Wick
          </h2>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            className="font-medium text-[var(--neutral-dark)] hover:text-[var(--primary)]"
            href="/product-listings"
          >
            Candles
          </Link>
          <Link
            className="font-medium text-[var(--neutral-dark)] hover:text-[var(--primary)]"
            href="/product-listings"
          >
            Crafts
          </Link>
          <Link
            className="font-medium text-[var(--neutral-dark)] hover:text-[var(--primary)]"
            href="/about-us"
          >
            About Us
          </Link>
          <Link
            className="font-medium text-[var(--neutral-dark)] hover:text-[var(--primary)]"
            href="/contact-us"
          >
            Contact
          </Link>
        </nav>
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
        </div>
      </div>
    </header>
  );
} 