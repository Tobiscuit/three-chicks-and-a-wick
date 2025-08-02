// src/app/product-listings/page.tsx
'use client';

import ProductGrid from '@/features/product/components/ProductGrid';
import { getClient } from '@/lib/client';
import { Suspense, useEffect, useState } from 'react';
import ProductCardSkeleton from '@/features/product/components/ProductCardSkeleton';
import { gql } from '@/gql';
import { GetProductsQuery, PageInfo } from '@/gql/graphql';
import Pagination from '@/components/ui/Pagination';
import { useSearchParams } from 'next/navigation';

type Product = {
  id: string;
  variantId: string | undefined;
  href: string;
  name: string;
  imageUrl: string | undefined;
  price: string;
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
          variantId: node.variants.edges[0]?.node.id,
          href: `/products/${node.handle}`,
          name: node.title,
          imageUrl: node.images.edges[0]?.node.url,
          price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(
            2
          )}`,
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
      <Suspense fallback={<p>Loading...</p>}>
        <ProductListings />
      </Suspense>
    </main>
  );
} 