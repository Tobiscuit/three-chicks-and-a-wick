import ProductGrid from '@/features/product/components/ProductGrid';
import { getClient } from '@/lib/client';
import { Suspense } from 'react';
import ProductCardSkeleton from '@/features/product/components/ProductCardSkeleton';
import { gql } from '@/gql';
import { GetProductsQuery } from '@/gql/graphql';

const GetProducts = gql(`
  query getProducts {
    products(first: 20) {
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

async function ProductData() {
  const { data } = await getClient().query<GetProductsQuery>({
    query: GetProducts,
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

  return <ProductGrid products={products.map((p, i) => ({ ...p, priority: i < 4 }))} />;
}

export default async function ProductListingsPage() {
  const header = (
    <header className="text-center mb-12">
      <h1 className="text-5xl font-sans font-black tracking-tight text-neutral-dark mb-6">
        Our Collection
      </h1>
      <p className="max-w-2xl mx-auto text-lg text-neutral-dark/80">
        Browse our curated selection of handcrafted goods, made with love and attention to detail.
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
    <div className="bg-cream">
      <main className="container mx-auto py-8 sm:py-12">
        {header}
        <Suspense fallback={skeleton}>
          <ProductData />
        </Suspense>
      </main>
    </div>
  );
} 