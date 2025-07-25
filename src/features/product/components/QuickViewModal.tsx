'use client';

import { useQuery } from '@apollo/client';
import ProductGallery from '@/features/product/components/ProductGallery';
import { X } from 'lucide-react';
import { gql } from '@/gql';
import { GetProductDetailsQuery } from '@/gql/graphql';
import Modal from '@/components/ui/Modal';

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
    return null;
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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl">
        <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
          <button
            type="button"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
            <div className="sm:col-span-4 lg:col-span-5">
              <ProductGallery images={productImages} />
            </div>
            <div className="sm:col-span-8 lg:col-span-7">
              <h2
                className="text-2xl font-bold text-gray-900 sm:pr-12"
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
                <p className="text-2xl text-gray-900">
                  $
                  {parseFloat(
                    product.priceRange.minVariantPrice.amount
                  ).toFixed(2)}
                </p>
              </section>
              <section
                aria-labelledby="options-heading"
                className="mt-10"
              >
                <h3 id="options-heading" className="sr-only">
                  Product options
                </h3>
                <div className="mt-10">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-primary px-8 py-3 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark/50 focus:ring-offset-2"
                  >
                    Add to bag
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}