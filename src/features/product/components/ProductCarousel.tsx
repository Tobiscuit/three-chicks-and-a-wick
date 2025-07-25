'use client';

import React, { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/features/product/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuickViewModal from '@/features/product/components/QuickViewModal';

interface Product {
  id: string;
  variantId: string;
  href: string;
  imageUrl: string;
  name: string;
  price: string;
}

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {products.map((product) => (
            <div className="flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] p-4" key={product.id}>
              <ProductCard 
                {...product} 
                onQuickView={() => setSelectedProduct(product)}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      <QuickViewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productHandle={selectedProduct?.href?.split('/').pop() || null}
      />
    </div>
  );
}
