import ProductGrid from '@/features/product/components/ProductGrid';
import { getClient } from '@/lib/client';
import { Suspense } from 'react';
import ProductCardSkeleton from '@/features/product/components/ProductCardSkeleton';
import { gql } from '@/gql';
import { GetProductsQuery } from '@/gql/graphql';
import Pagination from '@/components/ui/Pagination';

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

async function ProductData({ first, after }: { first: number, after?: string }) {
  const { data } = await getClient().query<GetProductsQuery>({
    query: GetProducts,
    variables: { first, after },
  });

  const products =
    data?.products?.edges.map(({ node }) => ({
      id: node.id,
      variantId: node.variants.edges[0]?.node.id,
      href: `/products/${node.handle}`,
      name: node.title,
      imageUrl: node.images.edges[0]?.node.url,
      price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
    })) || [];
  
  const pageInfo = data?.products?.pageInfo;

  return (
    <>
      <ProductGrid products={products.map((p, i) => ({ ...p, priority: i < 4 }))} />
      <Pagination hasNextPage={!!pageInfo?.hasNextPage} endCursor={pageInfo?.endCursor} />
    </>
  );
}

export default async function ProductListingsPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  // TODO: Change this back to 12 for production
  const first = 4; // Number of products per page
  const after = typeof searchParams?.after === 'string' ? searchParams.after : undefined;
  
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

  const skeleton = (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <main className="container mx-auto">
      {header}
      <Suspense fallback={skeleton}>
        <ProductData first={first} after={after} />
      </Suspense>
    </main>
  );
} 