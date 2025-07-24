'use client';

import React, { useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuickViewModal from './QuickViewModal';

interface Product {
  href: string;
  imageUrl: string;
  name: string;
  price: string;
}

interface ProductCarouselProps {
  products: Product[];
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
    inViewThreshold: 0.7,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {products.map((product, index) => (
              <div
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]"
                key={index}
              >
                <div className="p-2">
                  <ProductCard
                    {...product}
                    onQuickView={() => setSelectedProduct(product)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6 text-neutral-dark" />
        </button>
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6 text-neutral-dark" />
        </button>
      </div>
      {selectedProduct && (
        <QuickViewModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
};

export default ProductCarousel;
