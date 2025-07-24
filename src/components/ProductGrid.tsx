'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from './QuickViewModal';

// This defines the shape of a single product that this component expects
interface Product {
  id: string;
  variantId: string;
  href: string;
  name:string;
  imageUrl: string;
  price: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [selectedProductHandle, setSelectedProductHandle] = useState<string | null>(null);

  const getHandleFromHref = (href: string) => {
    const parts = href.split('/');
    return parts[parts.length - 1];
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickView={() => setSelectedProductHandle(getHandleFromHref(product.href))}
          />
        ))}
      </div>

      <QuickViewModal
        isOpen={!!selectedProductHandle}
        onClose={() => setSelectedProductHandle(null)}
        productHandle={selectedProductHandle}
      />
    </>
  );
} 