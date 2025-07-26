'use client';

import { useState } from 'react';
import ProductCard from '@/features/product/components/ProductCard';
import QuickViewModal from '@/features/product/components/QuickViewModal';

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
  onProductClick?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  onProductClick = () => {},
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    onProductClick(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onQuickView={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productHandle={selectedProduct?.href?.split('/').pop() || null}
      />
    </div>
  );
} 