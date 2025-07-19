'use client';

import { shopifyFetch } from '@/lib/shopify';
import { useCart, CartProduct } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';

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
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      price: product.priceRange.minVariantPrice,
      image: {
        url: product.images.edges[0]?.node.url,
        altText: product.images.edges[0]?.node.altText || product.title,
      }
    };
    addToCart(cartProduct);
    setAddedToCart(product.id);
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000); // Reset after 2 seconds
  };

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
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
            {product.images.edges.length > 0 && (
              <img
                src={product.images.edges[0].node.url}
                alt={product.images.edges[0].node.altText || product.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2 flex-grow">{product.title}</h2>
              <p className="text-gray-700 mb-4">
                ${product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className={`mt-auto font-bold py-2 px-4 rounded transition-colors duration-300 ${
                  addedToCart === product.id
                    ? 'bg-green-500 text-white'
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
                disabled={addedToCart === product.id}
              >
                {addedToCart === product.id ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
        </div>
    </div>
  );
} 