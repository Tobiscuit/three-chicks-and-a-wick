import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
  Star,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

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

const ProductCard = ({ product }: { product: (typeof products)[0] }) => (
  <div className="product-card group">
    <Link href="/product-details" className="block w-full overflow-hidden">
      <Image
        src={product.imageSrc}
        alt={product.name}
        width={400}
        height={400}
        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
      />
    </Link>
    <div className="p-4">
      <h3 className="text-lg font-bold text-[var(--neutral-dark)]">
        <Link href="/product-details">{product.name}</Link>
      </h3>
      <p className="mt-1 text-md font-medium text-[var(--neutral-dark)]/90">
        {product.price}
      </p>
      <div className="mt-2 flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
              fill="currentColor"
            />
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-500">
          ({product.reviewCount})
        </span>
      </div>
    </div>
  </div>
);

const FilterSort = () => (
  <div className="bg-[var(--white)] rounded-xl shadow-md p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4 flex-wrap">
      <span className="font-bold">Filter by:</span>
      <div className="relative">
        <select className="appearance-none rounded-full py-2 pl-4 pr-10 border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
          <option>Category</option>
          <option>Candles</option>
          <option>Crafts</option>
          <option>Kits</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-5 pr-2 text-gray-700" />
      </div>
      <div className="relative">
        <select className="appearance-none rounded-full py-2 pl-4 pr-10 border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
          <option>Price Range</option>
          <option>$0 - $15</option>
          <option>$15 - $25</option>
          <option>$25+</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-5 pr-2 text-gray-700" />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="font-bold">Sort by:</span>
      <div className="relative">
        <select className="appearance-none rounded-full py-2 pl-4 pr-10 border border-gray-300 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
          <option>Popularity</option>
          <option>New Arrivals</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 h-full w-5 pr-2 text-gray-700" />
      </div>
    </div>
  </div>
);

const Pagination = () => (
  <div className="flex items-center justify-center gap-4 mt-12">
    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 disabled:opacity-50" disabled>
      Previous
    </button>
    <div className="flex items-center gap-2">
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
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="mb-6">
          <nav className="text-sm font-medium text-[var(--neutral-dark)] opacity-70">
            <Link className="hover:text-[var(--primary)]" href="/">Home</Link>
            <span className="mx-2">/</span>
            <span>Candles &amp; Crafts</span>
          </nav>
        </div>
        <div className="text-center mb-8">
          <h2 className="text-5xl font-black text-[var(--neutral-dark)]">
            All Products
          </h2>
          <p className="mt-2 text-lg text-[var(--neutral-dark)] opacity-80">
            Find your next favorite scent or craft project!
          </p>
        </div>
        
        <FilterSort />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Pagination />
        
      </main>
      <Footer />
    </div>
  );
} 