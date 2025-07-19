// src/components/ProductCardSkeleton.tsx

export default function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg animate-pulse">
      <div className="w-full h-64 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-6"></div>
        <div className="h-10 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );
} 