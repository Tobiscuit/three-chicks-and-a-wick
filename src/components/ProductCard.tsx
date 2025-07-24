'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  href: string;
  imageUrl: string;
  name: string;
  price: string;
  onQuickView: () => void;
}

export default function ProductCard({
  href,
  imageUrl,
  name,
  price,
  onQuickView,
}: ProductCardProps) {
  return (
    <div className="group block">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
        <div className="relative w-full overflow-hidden">
          <Link href={href}>
            <Image
              src={imageUrl}
              alt={name}
              width={400}
              height={300}
              className="aspect-[4/3] w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 transform md:block">
            <button
              onClick={onQuickView}
              className="translate-y-4 rounded-full bg-white/80 px-6 py-2 text-sm font-semibold text-black opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              Quick View
            </button>
          </div>
        </div>
        <div className="p-3 text-center">
          <Link href={href}>
            <h3 className="text-lg font-bold text-[var(--neutral-dark)] h-14 flex items-center justify-center line-clamp-2 sm:line-clamp-none">
              {name}
            </h3>
          </Link>
          <p className="mt-1 text-base font-medium text-[var(--neutral-dark)]/70">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}
