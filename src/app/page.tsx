import ProductCarousel from '@/features/product/components/ProductCarousel';
import { getClient } from '@/lib/client';
import { gql } from '@/gql';
import { GetFeaturedProductsQuery } from '@/gql/graphql';
import Link from 'next/link';
import Image from 'next/image';
import heroImage from '../../public/images/products/diy-macrame-plant-hanger-kit.webp';
import EducationSection from '@/features/home/components/EducationSection';
import LoginSuccessToast from '@/components/LoginSuccessToast';
import { Suspense } from 'react';

const GetFeaturedProducts = gql(`
  query GetFeaturedProducts {
    collection(handle: "featured") {
      products(first: 10) {
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
    data.collection?.products.edges.map(({ node }) => ({
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
      <Suspense fallback={null}>
        <LoginSuccessToast />
      </Suspense>
      <main className="flex-grow">
        <section className="relative pb-1 sm:pb-2">
          <div className="container mx-auto grid grid-cols-1 items-center gap-4 lg:gap-16 lg:grid-cols-5">
            <div className="z-10 text-center lg:col-span-2 lg:text-left">
              <h1 className="text-5xl font-sans font-black leading-tight tracking-tighter md:text-7xl">
                Spark Some Joy
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-center text-lg text-[var(--neutral-dark)]/80 lg:mx-0 lg:text-left">
                Discover our unique collection of handmade candles and crafts,
                designed to brighten your day and add a touch of whimsy to your
                home.
              </p>
              <Link className="btn-primary mt-4 inline-block" href="/product-listings">
                Explore Our Collection
              </Link>
            </div>
            <Link href="/product-listings" className="relative h-[19rem] lg:h-[23rem] lg:col-span-3">
              <Image
                src={heroImage}
                alt="DIY macrame plant hanger kit"
                fill
                className="rounded-3xl object-cover transition-transform duration-300 hover:scale-[1.02]"
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

        <section className="overflow-hidden sm:py-1 pb-12 sm:pb-16">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-sans font-black tracking-tight md:text-5xl">
                Featured Products
              </h2>
              <p className="mx-auto mt-1 max-w-2xl text-lg text-[var(--neutral-dark)]/80">
                Handpicked just for you. Get them while they&apos;re hot!
              </p>
            </div>
            <div>
              <ProductCarousel products={featuredProducts} />
            </div>
            <div className="mt-8 text-center">
              <Link className="btn-secondary" href="/product-listings">
                View All Products
              </Link>
            </div>
          </div>
        </section>
        <EducationSection />
        <section className="bg-white pt-12 sm:pt-16 pb-12 sm:pb-16">
          <div className="container mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-sans font-black tracking-tight md:text-5xl">
                What Our Customers Say
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-lg text-neutral-dark/80">
                Real stories from our amazing community.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-10">
              <div className="rounded-3xl bg-neutral-light p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <p className="text-lg text-neutral-dark/90">
                  &quot;I&apos;m so impressed with the coconut wax candle. It burns so cleanly and for so much longer than my old paraffin candles. My living room feels healthier already!&quot;
                </p>
                <p className="mt-6 font-bold text-neutral-dark">
                  - Mia K.
                </p>
              </div>
              <div className="rounded-3xl bg-neutral-light p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <p className="text-lg text-neutral-dark/90">
                  &quot;The &apos;Enchanted Forest&apos; scent is pure magic. After a stressful day, lighting it instantly calms my mind and makes my apartment feel like a serene escape. It&apos;s my daily ritual now.&quot;
                </p>
                <p className="mt-6 font-bold text-neutral-dark">
                  - David L.
                </p>
              </div>
              <div className="rounded-3xl bg-neutral-light p-8 transition-all duration-300 hover:bg-white hover:shadow-xl hover:-translate-y-1">
                <p className="text-lg text-neutral-dark/90">
                  &quot;I never knew a wick could make such a difference! The gentle crackle of the wooden wick is so incredibly cozy and relaxing. It&apos;s like having a miniature fireplace. I&apos;m obsessed!&quot;
                </p>
                <p className="mt-6 font-bold text-neutral-dark">
                  - Chloe R.
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
