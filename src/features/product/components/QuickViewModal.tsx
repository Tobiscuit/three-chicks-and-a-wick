'use client';

import { useQuery } from '@apollo/client';
import ProductGallery from '@/features/product/components/ProductGallery';
import { X } from 'lucide-react';
import { gql } from '@/gql';
import { GetProductDetailsQuery } from '@/gql/graphql';

const GET_PRODUCT_DETAILS = gql(`
  query GetProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 1) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`);

export default function QuickViewModal({
  isOpen,
  onClose,
  productHandle,
}: {
  isOpen: boolean;
  onClose: () => void;
  productHandle: string | null;
}) {
  const { data, loading, error } = useQuery<GetProductDetailsQuery>(
    GET_PRODUCT_DETAILS,
    {
      variables: { handle: productHandle! },
      skip: !productHandle,
    }
  );

  if (loading || !data || !data.product) {
    return null; // Or a loading skeleton
  }

  if (error) {
    console.error(error);
    return <p>Error loading product details.</p>;
  }

  const { product } = data;
  const productImages = product.images.edges.map((edge) => ({
    id: edge.node.url,
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-[var(--neutral-dark)]/60 backdrop-blur-sm z-50 flex justify-center items-center" 
      onClick={onClose}
    >
      <div className="w-full max-w-4xl h-full bg-cream shadow-xl flex flex-col md:h-auto md:max-h-[90vh] md:rounded-xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}>
        
        <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="text-neutral-dark hover:text-primary transition-colors">
                <X size={28} />
            </button>
        </div>

        <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 p-8">
          <div className="sm:col-span-4 lg:col-span-5">
            <ProductGallery images={productImages} />
          </div>
          <div className="sm:col-span-8 lg:col-span-7 flex flex-col h-full">
            <h2
              className="text-3xl font-bold text-neutral-dark sm:pr-12"
            >
              {product.title}
            </h2>
            <section
              aria-labelledby="information-heading"
              className="mt-2"
            >
              <h3 id="information-heading" className="sr-only">
                Product information
              </h3>
              <p className="text-2xl text-neutral-dark">
                $
                {parseFloat(
                  product.priceRange.minVariantPrice.amount
                ).toFixed(2)}
              </p>
            </section>
            
            <div className="mt-6 flex-grow overflow-y-auto pr-4">
                <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            <section
              aria-labelledby="options-heading"
              className="mt-6 pt-6 border-t border-neutral-dark/10"
            >
              <h3 id="options-heading" className="sr-only">
                Product options
              </h3>
              <div className="mt-10">
                <button
                  type="submit"
                  className="btn-primary w-full"
                >
                  Add to Cart
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}