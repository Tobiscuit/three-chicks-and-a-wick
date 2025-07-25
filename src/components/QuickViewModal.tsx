'use client';

import { useQuery, gql } from '@apollo/client';
import ProductGallery from '@/components/ProductGallery';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

const GET_PRODUCT_DETAILS_QUERY = gql`
  query GetProductForModal($handle: String!) {
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
`;

export default function QuickViewModal({
  productHandle,
  isOpen,
  onClose,
}: {
  productHandle: string | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS_QUERY, {
    variables: { handle: productHandle },
    skip: !productHandle,
  });

  const product = data?.product;

  const productImages = product?.images.edges.map((edge: { node: { url: string; altText: string } }) => ({
    id: edge.node.url,
    src: edge.node.url,
    alt: edge.node.altText || product.title,
  }));

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition md:my-8 md:max-w-2xl lg:max-w-4xl">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {loading && <div className="w-full text-center">Loading...</div>}
                  {error && <div className="w-full text-center text-red-500">Error: {error.message}</div>}

                  {product && (
                    <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                      <div className="sm:col-span-4 lg:col-span-5">
                        <ProductGallery images={productImages || []} />
                      </div>
                      <div className="sm:col-span-8 lg:col-span-7">
                        <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.title}</h2>
                        <section aria-labelledby="information-heading" className="mt-2">
                          <h3 id="information-heading" className="sr-only">
                            Product information
                          </h3>
                          <p className="text-2xl text-gray-900">
                            ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                          </p>
                        </section>
                        <section aria-labelledby="options-heading" className="mt-10">
                          <div className="mt-4">
                            <p className="text-base text-gray-700">{product.description}</p>
                          </div>
                          <button
                            type="button"
                            className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Add to bag
                          </button>
                        </section>
                      </div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}