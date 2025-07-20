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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Explore Our Creations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Our Creations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                href={`/product-details?handle=${product.handle}`}
                imageUrl={product.images.edges[0]?.node.url}
                name={product.title}
                price={`$${product.priceRange.minVariantPrice.amount}`}
              />
        ))}
        </div>
    </div>
  );
} 