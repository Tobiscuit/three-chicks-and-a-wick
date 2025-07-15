import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--neutral-dark)]/10 bg-[var(--neutral-light)] py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold">Three Girls and a Wick</h3>
            <p className="mt-2 text-sm text-[var(--neutral-dark)]/70">
              Handmade with love and a little bit of magic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold">Shop</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/product-listings"
                >
                  Candles
                </Link>
              </li>
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/product-listings"
                >
                  Crafts
                </Link>
              </li>
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/product-listings"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">About</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/about-us"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/contact-us"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                  href="/faq"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a
                className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                href="#"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                </svg>
              </a>
              <a
                className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                href="#"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.351C0 23.41.59 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z" />
                </svg>
              </a>
              <a
                className="text-[var(--neutral-dark)]/70 hover:text-[var(--primary)]"
                href="#"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.538 18.256c.923.462 1.846.692 2.769.692.923 0 1.846-.23 2.769-.692.462-.23.692-.692.692-1.154s-.23-.923-.692-1.154c-.923-.462-1.846-.692-2.769-.692s-1.846.23-2.769.692c-.462.23-.692.692-.692 1.154s.23.923.692 1.154zm-3.693-3.692c.692.462 1.615.692 2.538.692s1.846-.23 2.538-.692c.462-.23.692-.692.692-1.154s-.23-.923-.692-1.154c-.692-.462-1.615-.692-2.538-.692s-1.846.23-2.538.692c-.462.23-.692.692-.692 1.154s.23.923.692 1.154z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--neutral-dark)]/10 pt-8 text-center text-sm text-[var(--neutral-dark)]/70">
          <p>
            © 2024 Three Girls and a Wick. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 