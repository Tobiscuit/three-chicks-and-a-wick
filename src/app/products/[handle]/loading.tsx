// src/app/products/[handle]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="bg-gray-300 rounded-lg w-full aspect-square"></div>

        {/* Product Info Skeleton */}
        <div>
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6 mb-6"></div>
          <div className="h-12 bg-gray-300 rounded w-full"></div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <div className="mt-16">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-8 mx-auto"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-300 rounded-lg aspect-square"></div>
          <div className="bg-gray-300 rounded-lg aspect-square"></div>
          <div className="bg-gray-300 rounded-lg aspect-square"></div>
          <div className="bg-gray-300 rounded-lg aspect-square"></div>
        </div>
      </div>
    </div>
  );
} 