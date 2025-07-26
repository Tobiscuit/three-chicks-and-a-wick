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

export default function ProductGrid({ products }: { products: any[] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const onProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={() => onProductClick(product)}
          />
        ))}
      </div>
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
} 