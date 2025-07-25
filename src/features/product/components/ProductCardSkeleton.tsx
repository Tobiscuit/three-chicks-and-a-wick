// src/components/ProductCardSkeleton.tsx
export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <div className="h-full w-full bg-gray-300"></div>
      </div>
      <div className="mt-4 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
  );
} 