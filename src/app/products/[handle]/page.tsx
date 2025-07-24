import { shopifyFetch } from '@/lib/shopify';
import Link from 'next/link';
import { Star } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard'; // Assuming you have this component
import { notFound } from 'next/navigation';

const GET_PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
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
`;

// This is a placeholder for a more advanced related products implementation
const GET_RELATED_PRODUCTS_QUERY = `
  query getRelatedProducts {
    products(first: 4) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
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
        }
      }
    }
  }
`;

type ShopifyProductImage = {
  url: string;
  altText: string;
};

type ShopifyVariant = {
  id: string;
};

type ShopifyProduct = {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: { node: ShopifyProductImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
};

async function getProduct(handle: string) {
  const { data } = await shopifyFetch<{ product: ShopifyProduct }>({
    query: GET_PRODUCT_QUERY,
    variables: { handle },
  });
  if (!data?.product) {
    notFound();
  }
  return data.product;
}

async function getRelatedProducts() {
    const { data } = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
        query: GET_RELATED_PRODUCTS_QUERY,
    });
    return data?.products?.edges.map(({ node }) => ({
        href: `/products/${node.handle}`,
        imageUrl: node.images.edges[0]?.node.url || '/images/placeholders/product-1.png',
        name: node.title,
        price: `$${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}`,
    })) || [];
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  const relatedProducts = await getRelatedProducts();

  const productImages = product.images.edges.map((edge) => ({
    id: edge.node.url, // Using URL as a temporary unique ID
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  return (
    <div className="bg-cream">
      <main className="container mx-auto py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/">Home</Link></li>
                <li><span className="font-medium text-gray-500">/</span></li>
                <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/product-listings">Products</Link></li>
                <li><span className="font-medium text-gray-500">/</span></li>
                <li><span className="font-medium text-gray-900">{product.title}</span></li>
              </ol>
            </nav>
            <div className="mt-8">
              <ProductGallery images={productImages} />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-bold tracking-tight">{product.title}</h2>
            <p className="text-lg leading-relaxed">{product.description}</p>
            <p className="text-3xl font-bold text-gray-900">
              ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
            </p>
            <button className="btn-primary max-w-xs">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 space-y-16 sm:space-y-24">
            <div className="border-t border-gray-200 pt-12">
                <h3 className="text-3xl font-bold tracking-tight mb-8">
                    You Might Also Like
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((related, index) => (
                        <ProductCard
                            key={index}
                            href={related.href}
                            imageUrl={related.imageUrl}
                            name={related.name}
                            price={related.price}
                        />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
} 