'use client';

import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

// Define the types right in the component file for clarity
type ShopifyProductImage = {
  url: string;
  altText: string;
};

type ShopifyVariant = {
  id: string;
};

type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode?: string;
    };
  };
  images: {
    edges: { node: ShopifyProductImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
};

export default function ProductView({
  product,
  relatedProducts,
}: {
  product: ShopifyProduct;
  relatedProducts: any[]; // You can define a more specific type for related products
}) {
  const { addToCart, isCartLoading } = useCart();

  const productImages = product.images.edges.map((edge: { node: ShopifyProductImage }) => ({
    id: edge.node.url,
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      variantId: product.variants.edges[0].node.id,
      title: product.title,
      price: {
        amount: product.priceRange.minVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode || 'USD',
      },
      image: {
        url: product.images.edges[0].node.url,
        altText: product.images.edges[0].node.altText,
      },
    };
    addToCart(cartProduct, 1);
  };

  return (
    <div className="bg-cream">
      <main className="container mx-auto py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm">
                <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/">Home</Link></li>
                <li><span className="font-medium text-gray-500">/</span></li>
                <li><Link className="font-medium text-gray-600 hover:text-gray-900" href="/product-listings">Products</Link></li>
                <li><span className="font-medium text-gray-500">/</span></li>
                <li><span className="font-medium text-gray-900">{product.title}</span></li>
              </ol>
            </nav>
            <div className="mt-8">
              <ProductGallery images={productImages} />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-bold tracking-tight">{product.title}</h2>
            <p className="text-lg leading-relaxed">{product.description}</p>
            <p className="text-3xl font-bold text-gray-900">
              ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
            </p>
            <button onClick={handleAddToCart} disabled={isCartLoading} className="btn-primary max-w-xs">
              {isCartLoading ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
        <div className="mt-16 sm:mt-24 space-y-16 sm:space-y-24">
            <div className="border-t border-gray-200 pt-12">
                <h3 className="text-3xl font-bold tracking-tight mb-8">
                    You Might Also Like
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {relatedProducts.map((related) => (
                        <ProductCard
                            key={related.id}
                            href={related.href}
                            imageUrl={related.imageUrl}
                            name={related.name}
                            price={related.price}
                            priority
                        />
                    ))}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
} 