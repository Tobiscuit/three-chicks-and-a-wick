'use client';

import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

// Define the types right in the component file for clarity
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
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
  };
  images: {
    edges: { node: ShopifyProductImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
};

export default function ProductView({
  product,
  relatedProducts,
}: {
  product: ShopifyProduct;
  relatedProducts: {
    id: string;
    href: string;
    imageUrl: string;
    name: string;
    price: string;
  }[];
}) {
  const { addToCart, isCartLoading } = useCart();
  const [quantity, setQuantity] = useState(1);

  const productImages = product.images.edges.map((edge: { node: ShopifyProductImage }) => ({
    id: edge.node.url,
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      variantId: product.variants.edges[0].node.id,
      title: product.title,
      price: {
        amount: product.priceRange.minVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode || 'USD',
      },
      image: {
        url: product.images.edges[0].node.url,
        altText: product.images.edges[0].node.altText,
      },
    };
    addToCart(cartProduct, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="bg-cream">
      <main className="container mx-auto pt-8 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/">Home</Link></li>
            <li><span className="font-medium text-gray-500">/</span></li>
            <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/product-listings">Products</Link></li>
            <li><span className="font-medium text-gray-500">/</span></li>
            <li><span className="font-medium text-gray-900">{product.title}</span></li>
          </ol>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <ProductGallery images={productImages} />
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-bold tracking-tight">{product.title}</h2>
            
            {/* Action block - visible on mobile */}
            <div className="md:hidden">
              <p className="text-3xl font-bold text-gray-900 mb-4">
                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                        <Minus size={16} />
                    </button>
                    <p className="font-bold w-8 text-center text-lg">{quantity}</p>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
                <button onClick={handleAddToCart} disabled={isCartLoading} className="btn-primary flex-1 max-w-xs">
                  {isCartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>

            <p className="text-lg leading-relaxed">{product.description}</p>
            
            {/* Action block - visible on desktop */}
            <div className="hidden md:block">
              <p className="text-3xl font-bold text-gray-900">
                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                        <Minus size={16} />
                    </button>
                    <p className="font-bold w-8 text-center text-lg">{quantity}</p>
                    <button onClick={() => setQuantity(q => q + 1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Plus size={16} />
                    </button>
                </div>
                <button onClick={handleAddToCart} disabled={isCartLoading} className="btn-primary flex-1 max-w-xs">
                  {isCartLoading ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 space-y-16 sm:space-y-24">
            <div className="border-t border-gray-200 pt-12">
                <h3 className="text-3xl font-bold tracking-tight mb-8">
                    You Might Also Like
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((related) => (
                        <ProductCard
                            key={related.id}
                            href={related.href}
                            imageUrl={related.imageUrl}
                            name={related.name}
                            price={related.price}
                            priority
                        />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
} 