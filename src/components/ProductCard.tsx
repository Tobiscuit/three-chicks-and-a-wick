import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  href: string;
  imageUrl: string;
  name: string;
  price: string;
}

export default function ProductCard({
  href,
  imageUrl,
  name,
  price,
}: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-[var(--neutral-dark)]">{name}</h3>
          <p className="mt-1 text-lg font-medium text-[var(--neutral-dark)]/90">
            {price}
          </p>
        </div>
      </div>
    </Link>
  );
} 