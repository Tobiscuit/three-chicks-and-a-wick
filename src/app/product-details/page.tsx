import Link from 'next/link';
import { Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/ProductGallery';

const product = {
  name: 'Lavender Bliss Candle',
  price: '$24.99',
  images: [
    {
      id: 1,
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBV5RzfBvuHPkFcwcy31MtLauPTQUiVOJtY9Bo4hB3oKaJ6a7au2svQUq3E35u-T6FBCmbF-PZRc4oYMC70Fs_5IyF1Qq7m_TL6Swza0rvd9qE5qX4ytjPxRKPlBfY8Dzn4ARDwTUhVmErBhraoL3Z1xWMeRb4vAeOUJvMlXWGqPNx9mly3urS-2OWxtp2xNW2XPBto4IDJaz1PCnMBFLYBEmpBcpug59xU1YKCJ9Ese5nlTaEsn3TdTQ8tG_P_BoFO7AU1CsDaQQ',
      alt: 'Angled view of the Lavender Bliss Candle in its glass jar.',
    },
    {
      id: 2,
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQZxB6uZc2affyYdDKRERqtM003wTqJx_pxbAKPqAotBT0nrflEi2TPgJmBGMmk3S1la9bC3as3nMHVF2rJQKNUBA3NOCCnhzGV9pjjLfzGiZ4jKqFydB-WWKGrduovYfJ9sQA5Ij-WqABzljOecAm6obvUWR-qJ-msM_Vk84w8BFDUiZPz3gdU-nxlMbIEz87we7r-P5xAEZmZrobRvWAJ_ypEYW1OJweur0Y4v9849ws9MRUPXIpEiOgQpV3CroCRDC5i1KM8w',
      alt: 'Top-down view showing the dried lavender buds on the candle surface.',
    },
    {
      id: 3,
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlw1QY2G9b3MsnDBYA8urHykOQZGUPb2bbYjFyqslhAKsrlO4Wnh8vMhxl-ni8V4PqoyZNsSVOR_GYwDs5v7gAUf5rEDIgQJlvW5wfKw0tJjKhbhUQaXxMA6uxjF00KMdJ1HUhtz7qzXJUB6GyOxCkGXtoIQ-n5pO6pqTdeeGMjuTwKKNIDS3q1cDdxEAH8e6ARXZdHTjc_poSDVk-5xoX_lZBZfOoNJz4D-uxCN2KcGabj71_hqEIsH4pEF7Z3YOQjOYZKlPceg',
      alt: 'Lifestyle shot of the candle on a coffee table.',
    },
  ],
  description:
    'Indulge in the calming aroma of our Lavender Bliss candle. Hand-poured with natural soy wax and infused with pure lavender essential oil, this candle creates a serene atmosphere perfect for relaxation. Each candle is adorned with dried lavender buds and comes in a reusable glass jar. Burn time: approximately 50 hours.',
  rating: 4.8,
  reviewCount: 24,
  reviews: [
    {
      id: 1,
      author: 'Emily R.',
      rating: 5,
      title: 'Absolutely Perfect!',
      comment:
        'This is my new favorite candle. The scent is heavenly and not overpowering. It burns so cleanly and looks gorgeous on my nightstand. Will be buying more!',
    },
    {
      id: 2,
      author: 'John D.',
      rating: 4,
      title: 'Great scent, a bit small',
      comment:
        "Love the lavender smell, very relaxing. I just wish the candle was a bit larger for the price. Still, it's a high-quality product.",
    },
    {
      id: 3,
      author: 'Sarah L.',
      rating: 5,
      title: 'The Best Wind-Down Scent',
      comment:
        'I light this every evening to relax before bed. The quality is amazing and the shipping was super fast. Highly recommend!',
    },
  ],
  relatedProducts: [
    {
      id: 1,
      name: 'Ocean Breeze Candle',
      price: '$22.00',
      imageSrc: '/images/placeholders/product-2.png',
    },
    {
      id: 2,
      name: 'Cozy Autumn Mug',
      price: '$25.00',
      imageSrc: '/images/placeholders/product-3.png',
    },
    {
      id: 3,
      name: 'Vanilla Bean Candle',
      price: '$16.00',
      imageSrc: '/images/placeholders/product-1.png',
    },
    {
      id: 4,
      name: 'DIY Macrame Kit',
      price: '$30.00',
      imageSrc: '/images/placeholders/product-2.png',
    },
  ],
};

const Breadcrumbs = () => (
  <nav aria-label="Breadcrumb">
    <ol className="flex items-center gap-2 text-sm">
      <li>
        <Link
          className="font-medium text-[var(--primary-900)] transition-colors hover:text-[var(--primary-600)]"
          href="/"
        >
          Home
        </Link>
      </li>
      <li>
        <span className="font-medium text-[var(--primary-900)]">/</span>
      </li>
      <li>
        <Link
          className="font-medium text-[var(--primary-900)] transition-colors hover:text-[var(--primary-600)]"
          href="/product-listings"
        >
          Candles
        </Link>
      </li>
      <li>
        <span className="font-medium text-[var(--primary-900)]">/</span>
      </li>
      <li>
        <span className="font-medium text-[var(--neutral-1000)]">
          {product.name}
        </span>
      </li>
    </ol>
  </nav>
);

const ProductInfo = () => (
  <div className="flex flex-col gap-6">
    <h2 className="text-4xl font-bold tracking-tight text-[var(--neutral-1000)]">
      {product.name}
    </h2>
    <p className="text-lg leading-relaxed text-[var(--neutral-900)]">
      {product.description}
    </p>
    <p className="text-3xl font-bold text-[var(--primary-900)]">
      {product.price}
    </p>
    <button className="flex w-full max-w-xs cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--primary)] px-8 py-4 text-lg font-bold text-white shadow-lg transition-transform duration-300 ease-in-out hover:scale-105">
      <span className="truncate">Add to My Box of Joy</span>
    </button>
  </div>
);

const ReviewsSection = () => (
  <div className="border-t border-[var(--neutral-200)] pt-8">
    <h3 className="text-3xl font-bold tracking-tight text-[var(--neutral-1000)]">
      Customer Reviews
    </h3>
    <div className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-5xl font-extrabold text-[var(--neutral-1000)]">
          {product.rating}
        </p>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(product.rating)
                  ? 'text-[var(--primary-400)]'
                  : 'text-[var(--neutral-300)]'
              }`}
              fill="currentColor"
            />
          ))}
        </div>
        <p className="text-sm text-[var(--neutral-700)]">
          Based on {product.reviewCount} reviews
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {/* Simplified star rating distribution */}
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--neutral-800)]">
              {rating} star{rating > 1 && 's'}
            </span>
            <div className="h-2 flex-1 rounded-full bg-[var(--neutral-200)]">
              <div
                className="h-2 rounded-full bg-[var(--primary-400)]"
                style={{ width: `${(rating / 5) * 80 + 10}%` }} // dummy percentage
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-10 space-y-8 border-t border-[var(--neutral-200)] pt-10">
      {product.reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < review.rating
                    ? 'text-[var(--primary-400)]'
                    : 'text-[var(--neutral-300)]'
                }`}
                fill="currentColor"
              />
            ))}
          </div>
          <h4 className="text-xl font-bold">{review.title}</h4>
          <p className="text-md text-[var(--neutral-800)]">{review.comment}</p>
          <p className="text-sm font-medium text-[var(--neutral-600)]">
            {review.author}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const RelatedProducts = () => (
    <div className="border-t border-[var(--neutral-200)] pt-8">
        <h3 className="text-3xl font-bold tracking-tight text-[var(--neutral-1000)] mb-8">
            You Might Also Like
        </h3>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {product.relatedProducts.map((related) => (
                <ProductCard
                    key={related.id}
                    href="#"
                    imageUrl={related.imageSrc}
                    name={related.name}
                    price={related.price}
                />
            ))}
        </div>
    </div>
);

export default function ProductDetailsPage() {
  return (
    <div className="bg-[var(--neutral-50)]" style={{ fontFamily: "'Plus Jakarta Sans', 'Noto Sans', sans-serif" }}>
      <Header />
      <main className="flex flex-1 justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex max-w-7xl flex-1 flex-col gap-8">
            <Breadcrumbs />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <ProductGallery images={product.images} />
                <ProductInfo />
            </div>
            <ReviewsSection />
            <RelatedProducts />
        </div>
      </main>
      <Footer />
    </div>
  );
} 