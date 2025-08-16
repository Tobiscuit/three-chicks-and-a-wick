// src/app/product-listings/page.tsx
'use client';

import ProductGrid from '@/features/product/components/ProductGrid';
import MagicRequestCard from '@/components/MagicRequestCard';
import { getClient } from '@/lib/client';
import { Suspense, useEffect, useState } from 'react';
import ProductCardSkeleton from '@/features/product/components/ProductCardSkeleton';
import { gql } from '@/gql';
import { GetProductsQuery, PageInfo } from '@/gql/graphql';
import Pagination from '@/components/ui/Pagination';
import { useSearchParams } from 'next/navigation';
import SlideOutPanel from '@/components/ui/SlideOutPanel';

type Product = {
  id: string;
  variantId: string;
  href: string;
  name: string;
  imageUrl: string;
  price: string;
  priority?: boolean;
};

const GetProducts = gql(`
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
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

function ProductListings() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const after = searchParams.get('after');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await getClient().query<GetProductsQuery>({
        query: GetProducts,
        variables: { first: 4, after: after || null },
      });

      const loadedProducts =
        data?.products?.edges.map(({ node }) => ({
          id: node.id,
          variantId: node.variants.edges[0]?.node.id ?? '',
          href: `/products/${node.handle}`,
          name: node.title,
          imageUrl: node.images.edges[0]?.node.url ?? '',
          price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
        })) || [];

      setProducts(loadedProducts);
      setPageInfo(data?.products?.pageInfo as PageInfo);
      setLoading(false);
    };

    fetchProducts();
  }, [after]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <ProductGrid products={products.map((p, i) => ({ ...p, priority: i < 4 }))} />
      <Pagination hasNextPage={!!pageInfo?.hasNextPage} endCursor={pageInfo?.endCursor} />
    </>
  );
}

export default function ProductListingsPage() {
  const [isFilterOpen, setFilterOpen] = useState(false);

  const header = (
    <header className="text-center mb-4">
      <h1 className="text-5xl font-sans font-black tracking-tight text-neutral-dark">
        Our Collection
      </h1>
      <p className="mt-3 max-w-2xl mx-auto text-lg text-neutral-dark/80">
        Browse our curated selection of handcrafted goods, made with love and
        attention to detail.
      </p>
    </header>
  );

  return (
    <main className="container mx-auto">
      {header}

      {/* Mobile filter pill bar + button */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pr-2">
          {['All', 'Candles', 'DIY Kits', 'Wax Melts'].map((label, i) => (
            <button
              key={label}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm ${
                i === 0
                  ? 'bg-primary text-white border-primary'
                  : 'bg-cream border-subtle-border text-neutral-dark'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="rounded-full border border-subtle-border px-3 py-1 text-sm"
        >
          Filter
        </button>
      </div>

      {/* Desktop with sidebar */}
      <div className="hidden md:grid md:grid-cols-12 md:gap-6">
        <aside className="md:col-span-3 lg:col-span-3 xl:col-span-2 sticky top-4 self-start h-min rounded-xl border border-subtle-border bg-white p-4">
          <h3 className="font-bold text-neutral-dark mb-3">Filters</h3>
          <div className="space-y-2">
            {['All', 'Candles', 'DIY Kits', 'Wax Melts'].map((label, i) => (
              <button
                key={label}
                className={`w-full text-left rounded-md border px-3 py-2 text-sm ${
                  i === 0
                    ? 'bg-primary text-white border-primary'
                    : 'bg-cream border-subtle-border text-neutral-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
        <section className="md:col-span-9 lg:col-span-9 xl:col-span-10">
          {/* Full-width banner at top */}
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="col-span-2 md:col-span-3 lg:col-span-4">
                <MagicRequestCard />
              </div>
            </div>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <ProductListings />
          </Suspense>
        </section>
      </div>

      {/* Mobile content layout */}
      <div className="md:hidden">
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="col-span-2 md:col-span-3 lg:col-span-4">
              <MagicRequestCard />
            </div>
          </div>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <ProductListings />
        </Suspense>
      </div>

      {/* Mobile slide-out filter panel */}
      <SlideOutPanel isOpen={isFilterOpen} onClose={() => setFilterOpen(false)}>
        <div className="h-full bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-neutral-dark">Filters</h3>
            <button onClick={() => setFilterOpen(false)} className="text-neutral-dark/70">
              Close
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold mb-2">Category</div>
              <div className="flex flex-wrap gap-2">
                {['All', 'Candles', 'DIY Kits', 'Wax Melts'].map((label, i) => (
                  <button
                    key={label}
                    className={`rounded-full border px-3 py-1 text-sm ${
                      i === 0
                        ? 'bg-primary text-white border-primary'
                        : 'bg-cream border-subtle-border text-neutral-dark'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SlideOutPanel>
    </main>
  );
} 