import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const featuredProducts = [
  {
    href: '/product-details',
    imageUrl: '/images/placeholders/product-1.png',
    name: 'Lavender Bliss Candle',
    price: '$18.00',
  },
  {
    href: '/product-details',
    imageUrl: '/images/placeholders/product-2.png',
    name: 'Ocean Breeze Candle',
    price: '$18.00',
  },
  {
    href: '/product-details',
    imageUrl: '/images/placeholders/product-3.png',
    name: 'Vanilla Bean Candle',
    price: '$18.00',
  },
];

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow">
        <section className="relative py-20 sm:py-32">
          <div className="container mx-auto grid grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
            <div className="z-10 text-center lg:text-left">
              <h1 className="text-5xl font-black leading-tight tracking-tighter md:text-7xl">
                Spark Some Joy
              </h1>
              <p className="mt-6 max-w-lg text-lg text-[var(--neutral-dark)]/80 lg:mx-0">
                Discover our unique collection of handmade candles and crafts,
                designed to brighten your day and add a touch of whimsy to your
                home.
              </p>
              <Link
                className="btn-primary mt-8 inline-block"
                href="/product-listings"
              >
                Explore Our Collection
              </Link>
            </div>
            <div className="relative h-96">
              <div
                className="absolute left-0 top-0 h-full w-full rounded-3xl bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaA6uZZe4HAGz8dOly6GoT4VXFlbpLgRWgT5OK675nTzSRQGw_OMc69UYKOTq0G5ym52lkqMzzoOx6w5uYPMME3qMGbgFhRQS-BkGXTKsVv29U_HvedMXh6Ov-4BEaNjdq59P3xLtm7JnlOwPVY3XZRf-D6r1pMddvW3Ua3jExeNoHK_07Ka7GutgKov0-_uKA6F97CDtvM3a6s5kllCgh9bqBIo3aEnZVnGPKGS3hOBGxLchy04qOBKKxUN9dYSbmexQKSN-aEw')",
                }}
              ></div>
            </div>
          </div>
        </section>
        <section className="py-20 sm:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Explore the Creations
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                Find your new favorite scent or a unique piece to complete your
                space.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-[var(--white)] p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="rounded-full bg-[var(--primary)]/20 p-4 text-[var(--primary)]">
                  <svg
                    fill="currentColor"
                    height="40"
                    viewBox="0 0 256 256"
                    width="40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M173.79,51.48a221.25,221.25,0,0,0-41.67-34.34,8,8,0,0,0-8.24,0A221.25,221.25,0,0,0,82.21,51.48C54.59,80.48,40,112.47,40,144a88,88,0,0,0,176,0C216,112.47,201.41,80.48,173.79,51.48ZM96,184c0-27.67,22.53-47.28,32-54.3,9.48,7,32,26.63,32,54.3a32,32,0,0,1-64,0Z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Candles</h3>
                <p className="text-[var(--neutral-dark)]/80">
                  Hand-poured with love and premium fragrances.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-[var(--white)] p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="rounded-full bg-[var(--secondary)]/20 p-4 text-[var(--secondary)]">
                  <svg
                    fill="currentColor"
                    height="40"
                    viewBox="0 0 256 256"
                    width="40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M232,32a8,8,0,0,0-8-8c-44.08,0-89.31,49.71-114.43,82.63A60,60,0,0,0,32,164c0,30.88-19.54,44.73-20.47,45.37A8,8,0,0,0,16,224H92a60,60,0,0,0,57.37-77.57C182.3,121.31,232,76.08,232,32ZM92,208H34.63C41.38,198.41,48,183.92,48,164a44,44,0,1,1,44,44Zm32.42-94.45q5.14-6.66,10.09-12.55A76.23,76.23,0,0,1,155,121.49q-5.9,4.94-12.55,10.09A60.54,60.54,0,0,0,124.42,113.55Zm42.7-2.68a92.57,92.57,0,0,0-22-22c31.78-34.53,55.75-45,69.9-47.91C212.17,55.12,201.65,79.09,167.12,110.87Z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Crafts</h3>
                <p className="text-[var(--neutral-dark)]/80">
                  Unique handmade items to adorn your life.
                </p>
        </div>
              <div className="flex flex-col items-center gap-4 rounded-3xl bg-[var(--white)] p-8 text-center shadow-lg transition-transform duration-300 hover:-translate-y-2">
                <div className="rounded-full bg-[var(--accent)]/20 p-4 text-[var(--accent)]">
                  <svg
                    fill="currentColor"
                    height="40"
                    viewBox="0 0 256 256"
                    width="40"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M232,94c0,59.39-78.53,111.45-98.14,122.28a16,16,0,0,1-11.72,0C102.53,205.45,24,153.39,24,94A62,62,0,0,1,133.56,41.22a8,8,0,0,1,8.88,13.56,46,46,0,1,0,0-29.56A8,8,0,0,1,133.56,11.66,78,78,0,0,0,24,94a8,8,0,0,1-16,0C8,45.31,48.65,8,94,8c32.7,0,61.1,19,74,45.69C179.31,34.8,200.7,24,224,24a8,8,0,0,1,8,8c0,29.93-21,54.4-48,62Z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">New Arrivals</h3>
                <p className="text-[var(--neutral-dark)]/80">
                  Check out the latest additions to our family.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="overflow-hidden py-20 sm:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Featured Products
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                Handpicked just for you. Get them while they&apos;re hot!
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link className="btn-secondary" href="/product-listings">
                View All Products
              </Link>
            </div>
          </div>
        </section>
        <section className="bg-white py-20 sm:py-24">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                &quot;We love our customers, and they love us back.&quot;
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="rounded-3xl bg-[var(--neutral-light)] p-8">
                <p className="text-lg text-[var(--neutral-dark)]/90">
                  &quot;Absolutely in love with my new candle! It smells amazing and
                  looks beautiful on my coffee table.&quot;
                </p>
                <p className="mt-6 font-bold text-[var(--neutral-dark)]">
                  - Sarah L.
                </p>
              </div>
              <div className="rounded-3xl bg-[var(--neutral-light)] p-8">
                <p className="text-lg text-[var(--neutral-dark)]/90">
                  &quot;The crafts are so unique and well-made. I bought a gift for
                  my friend and she was thrilled!&quot;
                </p>
                <p className="mt-6 font-bold text-[var(--neutral-dark)]">
                  - Jessica M.
                </p>
              </div>
              <div className="rounded-3xl bg-[var(--neutral-light)] p-8">
                <p className="text-lg text-[var(--neutral-dark)]/90">
                  &quot;Fast shipping and excellent customer service. I&apos;ll
                  definitely be a repeat customer.&quot;
                </p>
                <p className="mt-6 font-bold text-[var(--neutral-dark)]">
                  - Emily R.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
