export default function Loading() {
  return (
    <div className="bg-cream">
      <main className="container mx-auto animate-pulse py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            {/* Breadcrumbs Skeleton */}
            <div className="h-4 bg-white/60 rounded w-3/4 mb-8"></div>
            
            {/* Product Gallery Skeleton - Now matches the real component */}
            <div className="aspect-square w-full bg-white/60 rounded-3xl"></div>
          </div>
          <div className="flex flex-col gap-8">
            {/* Product Title Skeleton */}
            <div className="h-10 bg-white/60 rounded w-full"></div>
            
            {/* Product Description Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-white/60 rounded"></div>
              <div className="h-4 bg-white/60 rounded w-5/6"></div>
              <div className="h-4 bg-white/60 rounded w-4/6"></div>
            </div>

            {/* Price Skeleton */}
            <div className="h-8 bg-white/60 rounded w-1/4"></div>

            {/* Button Skeleton */}
            <div className="h-12 bg-white/60 rounded max-w-xs"></div>
          </div>
        </div>
        <div className="mt-16 sm:mt-24">
            <div className="border-t border-white/30 pt-12">
                {/* Related Products Title Skeleton */}
                <div className="h-8 bg-white/60 rounded w-1/3 mb-8"></div>

                {/* Related Products Grid Skeleton */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i}>
                          <div className="aspect-[4/3] w-full bg-white/60 rounded-3xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
} 