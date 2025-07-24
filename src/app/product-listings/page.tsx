import { shopifyFetch } from '@/lib/shopify';
import ProductGrid from '@/components/ProductGrid'; // We will create this next

const getProductsQuery = `
  query getProducts {
    products(first: 20) { // Fetch more products
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
`;

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: { node: { url: string; altText: string } }[];
  };
  variants: {
    edges: { node: { id: string } }[];
  };
};

async function getProducts() {
  const { data } = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
    query: getProductsQuery,
    cache: 'no-store', // For now, let's keep it fresh
  });

  return data?.products?.edges.map(({ node }) => ({
    id: node.id,
    variantId: node.variants.edges[0]?.node.id,
    href: `/products/${node.handle}`,
    name: node.title,
    imageUrl: node.images.edges[0]?.node.url,
    price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
  })) || [];
}


export default async function ProductListingsPage() {
  const products = await getProducts();

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

  return (
    <div className="bg-cream">
      <main className="container mx-auto py-16 sm:py-24">
        {header}
        <ProductGrid products={products} />
      </main>
    </div>
  );
} 