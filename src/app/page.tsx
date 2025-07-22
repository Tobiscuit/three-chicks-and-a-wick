import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const featuredProducts = [
  {
    href: '/product-details',
    imageUrl: '/images/products/lavender-bliss-candle.png',
    name: 'Lavender Bliss Candle',
    price: '$24.99',
  },
  {
    href: '/product-details',
    imageUrl: '/images/products/ocean-breeze-candle.png',
    name: 'Ocean Breeze Candle',
    price: '$22.00',
  },
  {
    href: '/product-details',
    imageUrl: '/images/products/enchanted-forest-wax-melts.png',
    name: 'Enchanted Forest Wax Melts',
    price: '$12.50',
  },
];

export default function Home() {
  return (
    <>
      <main className="flex-grow">
        <section className="relative py-16 sm:py-24">
          <div className="container mx-auto grid grid-cols-1 items-center gap-8 lg:gap-16 lg:grid-cols-5">
            <div className="z-10 text-center lg:col-span-2 lg:text-left">
              <h1 className="text-4xl font-sans font-black leading-tight tracking-tighter md:text-7xl">
                Spark Some Joy
              </h1>
              <p className="mt-4 max-w-lg text-lg text-[var(--neutral-dark)]/80 lg:mx-0">
                Discover our unique collection of handmade candles and crafts,
                designed to brighten your day and add a touch of whimsy to your
                home.
              </p>
              <Link className="btn-primary mt-8 inline-block" href="/product-listings">
                Explore Our Collection
              </Link>
            </div>
            <Link href="/product-listings" className="relative h-80 lg:h-96 lg:col-span-3">
              <div
                className="absolute left-0 top-0 h-full w-full rounded-3xl bg-cover bg-center transition-transform duration-500 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('/images/products/diy-macrame-plant-hanger-kit.png')",
                }}
              ></div>
            </Link>
          </div>
        </section>

        {/* 
          The "Explore the Creations" section has been componentized and can be found in:
          src/components/CategoryCards.tsx
          It can be re-added here if needed.
        */}

        <section className="overflow-hidden py-16 sm:py-24">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-sans font-black tracking-tight md:text-5xl">
                Featured Products
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                Handpicked just for you. Get them while they&apos;re hot!
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
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
        <section className="bg-white py-16 sm:py-24">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-sans font-black tracking-tight md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                &quot;We love our customers, and they love us back.&quot;
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
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
      {/* Footer is now handled by the layout */}
    </>
  );
}
