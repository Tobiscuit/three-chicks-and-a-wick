"use client";

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((image) => ({ src: image.src }));

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div
          className="col-span-1 cursor-pointer overflow-hidden rounded-xl shadow-md"
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
        >
          <Image
            src={images[0].src}
            alt={images[0].alt}
            width={800}
            height={800}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {images.slice(1).map((image, i) => (
            <div
              key={image.id}
              className="cursor-pointer overflow-hidden rounded-xl shadow-md"
              onClick={() => {
                setIndex(i + 1);
                setOpen(true);
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={200}
                height={200}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          },
          slide: {
            borderRadius: '0.75rem',
          },
        }}
      />
    </>
  );
} 