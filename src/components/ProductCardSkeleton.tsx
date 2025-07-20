// src/components/ProductCardSkeleton.tsx

export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-200"></div>
        <div className="p-4 text-center">
          <div className="mx-auto w-3/4 rounded-full bg-gray-200 font-bold text-lg text-transparent">
            -
          </div>
          <div className="mx-auto mt-1 w-1/4 rounded-full bg-gray-200 font-medium text-base text-transparent">
            -
          </div>
        </div>
      </div>
    </div>
  );
} 