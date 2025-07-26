'use client';

import { useState } from 'react';
import ProductCard from '@/features/product/components/ProductCard';
import QuickViewModal from '@/features/product/components/QuickViewModal';

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
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickView={() => onProductClick(product)}
          />
        ))}
      </div>
      {selectedProduct && (
        <QuickViewModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          productHandle={productHandle}
        />
      )}
    </>
  );
} 