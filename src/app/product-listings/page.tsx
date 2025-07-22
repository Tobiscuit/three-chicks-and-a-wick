'use client';

import { shopifyFetch } from '@/lib/shopify';
import { useCart, CartProduct } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import ProductCard from '@/components/ProductCard';

const getProductsQuery = `
  query getProducts {
    products(first: 10) {
      edges {
        node {
          id
          title
          handle
          descriptionHtml
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

type Product = {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

type ProductsQueryResponse = {
  products: {
    edges: {
      node: Product;
    }[];
  };
};


export default function ProductListingsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const { data } = await shopifyFetch<ProductsQueryResponse>({ query: getProductsQuery });
        setProducts(data.products.edges.map(edge => edge.node));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  if (isLoading) {
    return (
      <div className="bg-cream">
        <main className="container mx-auto py-16 sm:py-24">
          {header}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-cream">
      <main className="container mx-auto py-16 sm:py-24">
        {header}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              href={`/product-details?handle=${product.handle}`}
              imageUrl={product.images.edges[0]?.node.url}
              name={product.title}
              price={`$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
} 