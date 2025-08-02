'use client';

import { useQuery } from '@apollo/client';
import ProductGallery from '@/features/product/components/ProductGallery';
import { X, Plus, Minus } from 'lucide-react';
import { gql } from '@/gql';
import { GetProductDetailsQuery } from '@/gql/graphql';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const GET_PRODUCT_DETAILS = gql(`
  query GetProductDetails($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalPanelVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring' as const, duration: 0.4 } },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

export default function QuickViewModal({
  isOpen,
  onClose,
  productHandle,
}: {
  isOpen: boolean;
  onClose: () => void;
  productHandle: string | null;
}) {
  const { addToCart, isCartLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { data, loading, error } = useQuery<GetProductDetailsQuery>(
    GET_PRODUCT_DETAILS,
    {
      variables: { handle: productHandle! },
      skip: !productHandle,
    }
  );

  const handleAddToCart = async () => {
    if (!data || !data.product) return;
    const cartProduct = {
      id: data.product.id,
      variantId: data.product.variants.edges[0].node.id,
      handle: data.product.handle,
      title: data.product.title,
      price: {
        amount: data.product.priceRange.minVariantPrice.amount,
        currencyCode: data.product.priceRange.minVariantPrice.currencyCode || 'USD',
      },
      image: {
        url: data.product.images.edges[0].node.url,
        altText: data.product.images.edges[0].node.altText ?? '',
      },
    };
    await addToCart(cartProduct, quantity);
    setQuantity(1); // Reset quantity after adding to cart
    onClose(); // Close modal after adding to cart
  };

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          className="fixed inset-0 bg-neutral-dark/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalPanelVariants}
            className="w-full max-w-2xl lg:max-w-5xl bg-cream shadow-xl flex flex-col md:h-auto md:max-h-[90vh] md:rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* All modal content is inside this scaling div */}
            <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 p-6 md:p-8">
              <div className="sm:col-span-4 lg:col-span-5">
                <ProductGallery images={productImages} />
              </div>
              <div className="sm:col-span-8 lg:col-span-7 flex flex-col h-full">
                <h2 className="text-3xl font-bold text-neutral-dark sm:pr-12">{product.title}</h2>
                <section aria-labelledby="information-heading" className="mt-2">
                  <h3 id="information-heading" className="sr-only">Product information</h3>
                  <p className="text-2xl text-neutral-dark">${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</p>
                </section>
                <div className="mt-6 flex-grow overflow-y-auto pr-4">
                  <div className="prose" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                <section aria-labelledby="options-heading" className="mt-4 pt-4 border-t border-neutral-dark/10">
                  <h3 id="options-heading" className="sr-only">Product options</h3>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 rounded-full border border-gray-300 p-1">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50" disabled={quantity <= 1}>
                        <Minus size={16} />
                      </button>
                      <p className="font-bold w-8 text-center text-lg">{quantity}</p>
                      <button onClick={() => setQuantity(q => q + 1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button onClick={handleAddToCart} disabled={isCartLoading} className="btn-primary flex-1">
                      {isCartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>

          {/* Close button is a sibling to the panel, so it doesn't scale */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1 } }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={32} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}