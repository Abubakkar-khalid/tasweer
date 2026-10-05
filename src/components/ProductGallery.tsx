"use client";

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center p-4 sm:p-8">
        <Image 
          src={mainImage} 
          alt={productName} 
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                mainImage === img ? 'border-[#6B4C8A]' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image 
                src={img} 
                alt={`${productName} thumbnail ${idx + 1}`} 
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
