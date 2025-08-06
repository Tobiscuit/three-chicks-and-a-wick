'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/context/cart-store';
import ProductGallery from '@/features/product/components/ProductGallery';
import ProductCard from '@/features/product/components/ProductCard';
import { Minus, Plus } from 'lucide-react';
import QuickViewModal from './QuickViewModal';
import { AnimatePresence } from 'framer-motion';

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

type RelatedProduct = {
  id: string;
  href: string;
  imageUrl: string;
  name: string;
  price: string;
};

export default function ProductView({
  product,
  relatedProducts,
}: {
  product: ShopifyProduct;
  relatedProducts: RelatedProduct[];
}) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<RelatedProduct | null>(null);

  const productImages = product.images.edges.map((edge) => ({
    id: edge.node.url,
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  const handleAddToCart = () => {
    const variantId = product.variants.edges[0]?.node.id;
    if (!variantId) {
      console.error("No variant ID found for this product.");
      // Optionally, show an error to the user
      return;
    }

    addItem({
      type: 'STANDARD',
      variantId,
      quantity,
    });
    setQuantity(1); // Reset quantity after adding to cart
    // Optionally, trigger a toast notification "Item added to cart!"
  };

  const productHandle = selectedProduct
    ? new URL(selectedProduct.href, 'http://localhost').pathname.split('/').pop() || null
    : null;

  return (
    <>
      <div className="bg-cream">
        <main className="container mx-auto pb-2 sm:pb-4">
          <nav aria-label="Breadcrumb" className="my-2">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  className="font-medium text-gray-600 hover:text-gray-900"
                  href="/"
                >
                  Home
                </Link>
              </li>
              <li>
                <span className="font-medium text-gray-500">/</span>
              </li>
              <li>
                <Link
                  className="font-medium text-gray-600 hover:text-gray-900"
                  href="/product-listings"
                >
                  Products
                </Link>
              </li>
              <li>
                <span className="font-medium text-gray-500">/</span>
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  {product.title}
                </span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:gap-12">
            <div>
              <ProductGallery images={productImages} />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                {product.title}
              </h1>
              <p
                className="text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div>
                <p className="text-3xl font-bold text-gray-900">
                  $
                  {parseFloat(
                    product.priceRange.minVariantPrice.amount,
                  ).toFixed(2)}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="rounded-full p-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <p className="w-8 text-center text-lg font-bold">
                      {quantity}
                    </p>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="rounded-full p-2 transition-colors hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary flex-1 max-w-xs"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10">
            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-6 text-3xl font-bold tracking-tight">
                You Might Also Like
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={related.href}
                    className="block"
                  >
                    <ProductCard
                      href={related.href}
                      imageUrl={related.imageUrl}
                      name={related.name}
                      price={related.price}
                      priority
                      onQuickView={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedProduct(related);
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <QuickViewModal
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            productHandle={productHandle}
          />
        )}
      </AnimatePresence>
    </>
  );
}
