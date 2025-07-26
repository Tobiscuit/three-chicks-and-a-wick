import ProductCarousel from '@/features/product/components/ProductCarousel';
import CategoryCards from '@/components/CategoryCards';
import NewsletterSignup from '@/components/NewsletterSignup';
import { getClient } from '@/lib/client';
import { gql } from '@/gql';
import { GetFeaturedProductsQuery } from '@/gql/graphql';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from '../../public/images/products/diy-macrame-plant-hanger-kit.png';
import { useEffect } from 'react';

const GetFeaturedProducts = gql(`
  query GetFeaturedProducts {
    products(first: 10, query: "tag:featured") {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`);

async function getFeaturedProducts() {
  const { data } = await getClient().query<GetFeaturedProductsQuery>({
    query: GetFeaturedProducts,
    context: {
      fetchOptions: {
        next: { revalidate: 3600 },
      },
    },
  });

  const products =
    data.products.edges.map(({ node }) => ({
      id: node.id,
      variantId: node.variants.edges[0]?.node.id,
      href: `/products/${node.handle}`,
      name: node.title,
      imageUrl: node.images.edges[0]?.node.url,
      price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
    })) || [];

  return products;
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

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
              <Image
                src={heroImage}
                alt="DIY macrame plant hanger kit"
                fill
                className="rounded-3xl object-cover transition-transform duration-500 hover:scale-105"
                placeholder="blur"
                priority
              />
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
            <div className="mt-12">
              <ProductCarousel products={featuredProducts} />
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
