import ProductGrid from '@/components/ProductGrid';
import { gql } from '@apollo/client';
import { getClient } from '@/lib/client';

const GET_PRODUCTS_QUERY = gql`
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

type ProductsQueryResponse = {
  products: {
    edges: { node: ShopifyProduct }[];
  };
};

async function getProducts() {
  const { data } = await getClient().query<ProductsQueryResponse>({
    query: GET_PRODUCTS_QUERY,
  });

  const products = data?.products?.edges.map(({ node }: { node: ShopifyProduct }) => ({
    id: node.id,
    variantId: node.variants.edges[0]?.node.id,
    href: `/products/${node.handle}`,
    name: node.title,
    imageUrl: node.images.edges[0]?.node.url,
    price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
  })) || [];

  return products;
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
        <ProductGrid products={products.map((p, i) => ({ ...p, priority: i < 4 }))} />
      </main>
    </div>
  );
} 