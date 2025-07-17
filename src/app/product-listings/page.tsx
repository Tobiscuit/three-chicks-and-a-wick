import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Star } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

// Placeholder data for products
const products = [
  {
    id: 1,
    name: 'Lavender Bliss Candle',
    price: '$18.00',
    rating: 4.5,
    reviewCount: 8,
    imageSrc: '/images/placeholders/product-1.png',
    category: 'Candles',
  },
  {
    id: 2,
    name: 'Ocean Breeze Candle',
    price: '$22.00',
    rating: 5,
    reviewCount: 12,
    imageSrc: '/images/placeholders/product-2.png',
    category: 'Candles',
  },
  {
    id: 3,
    name: 'Vanilla Bean Candle',
    price: '$16.00',
    rating: 4,
    reviewCount: 5,
    imageSrc: '/images/placeholders/product-3.png',
    category: 'Candles',
  },
  {
    id: 4,
    name: 'Cozy Autumn Mug',
    price: '$25.00',
    rating: 5,
    reviewCount: 21,
    imageSrc: '/images/placeholders/product-1.png', // Replace with actual image
    category: 'Crafts',
  },
  {
    id: 5,
    name: 'Enchanted Forest Candle',
    price: '$24.99',
    rating: 4.8,
    reviewCount: 15,
    imageSrc: '/images/placeholders/product-2.png', // Replace with actual image
    category: 'Candles',
  },
  {
    id: 6,
    name: 'DIY Macrame Kit',
    price: '$30.00',
    rating: 4.7,
    reviewCount: 18,
    imageSrc: '/images/placeholders/product-3.png', // Replace with actual image
    category: 'Kits',
  },
  {
    id: 7,
    name: 'Rose Petal Soap Bar',
    price: '$12.00',
    rating: 4.9,
    reviewCount: 32,
    imageSrc: '/images/placeholders/product-1.png', // Replace with actual image
    category: 'Crafts',
  },
  {
    id: 8,
    name: 'Citrus Grove Candle',
    price: '$20.00',
    rating: 4.6,
    reviewCount: 9,
    imageSrc: '/images/placeholders/product-2.png', // Replace with actual image
    category: 'Candles',
  },
];

const DesktopFilterSort = () => (
  <div className="mb-8 hidden rounded-xl border border-gray-200/80 bg-[var(--white)] p-6 shadow-md md:flex md:flex-wrap md:items-center md:justify-between md:gap-6">
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-lg font-bold text-[var(--neutral-dark)]">Filter by:</span>
      <div className="relative">
        <select className="appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
          <option>Category</option>
          <option>Candles</option>
          <option>Crafts</option>
          <option>Kits</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
      </div>
      <div className="relative">
        <select className="appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
          <option>Price Range</option>
          <option>$0 - $15</option>
          <option>$15 - $25</option>
          <option>$25+</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-lg font-bold text-[var(--neutral-dark)]">Sort by:</span>
      <div className="relative">
        <select className="appearance-none rounded-lg border border-gray-300 bg-gray-50 py-3 pl-5 pr-12 text-base font-medium text-[var(--neutral-dark)] transition-colors hover:bg-gray-100 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
          <option>Popularity</option>
          <option>New Arrivals</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-6 pr-3 text-gray-700" />
      </div>
    </div>
  </div>
);

const Pagination = () => (
  <div className="mt-12 flex items-center justify-center gap-4">
    <button
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
      disabled
    >
      Previous
    </button>
    <div className="hidden items-center gap-2 sm:flex">
      {[1, 2, 3, '...', 8].map((page, index) => (
        <button
          key={index}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            page === 1
              ? 'bg-[var(--primary)] text-white'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
      Next
    </button>
  </div>
);


export default function ProductListings() {
  return (
    <div className="flex min-h-screen flex-col text-[var(--neutral-dark)]">
      <Header />
      <main className="container mx-auto flex-grow px-6 pt-6">
        <div className="mb-6">
          <nav className="text-sm font-medium text-[var(--neutral-dark)] opacity-70">
            <Link className="hover:text-[var(--primary)]" href="/">Home</Link>
            <span className="mx-2">/</span>
            <span>Candles &amp; Crafts</span>
          </nav>
        </div>
        <div className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-[var(--neutral-dark)]">
              All Products
            </h2>
            <p className="mt-2 text-lg text-[var(--neutral-dark)] opacity-80">
              Find your next favorite scent or craft project!
            </p>
          </div>

          {/* Desktop Filter Controls */}
          <DesktopFilterSort />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                href="/product-details"
                imageUrl={product.imageSrc}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>

          <Pagination />
        </div>
      </main>
      <Footer />
    </div>
  );
} 