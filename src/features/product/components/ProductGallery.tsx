'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type ImageType = {
  id: string;
  src: string;
  alt: string;
};

export default function ProductGallery({ images }: { images: ImageType[] }) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <AnimatePresence initial={false}>
          <motion.div
            key={mainImage.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setMainImage(image)}
              className={`relative aspect-square w-full overflow-hidden rounded-lg transition-transform duration-200 hover:scale-105 ${
                mainImage.id === image.id ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 