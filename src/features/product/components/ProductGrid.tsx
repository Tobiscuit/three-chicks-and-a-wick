'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ProductCard from '@/features/product/components/ProductCard';
import QuickViewModal from '@/features/product/components/QuickViewModal';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

// This defines the shape of a single product that this component expects
interface Product {
  id: string;
  variantId: string;
  href: string;
  name: string;
  imageUrl: string;
  price: string;
}

// This now defines the props for the component
interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  // State is now properly typed to be a Product object or null
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // The parameter is now correctly typed
  const onProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // The handle for the QuickViewModal is now correctly extracted
  const productHandle = selectedProduct ? new URL(selectedProduct.href, 'http://localhost').pathname.split('/').pop() || null : null;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Insert Magic Request Card at the first slot */}
        <MagicRequestCardWrapper />
        {products.map((product) => (
          // WRAP the ProductCard with a Link component
          <Link key={product.id} href={product.href}>
            <ProductCard
              {...product}
              onQuickView={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onProductClick(product);
              }}
            />
          </Link>
        ))}
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

const MagicRequestCardWrapper = dynamic(() => import('@/components/MagicRequestCard'), { ssr: false });