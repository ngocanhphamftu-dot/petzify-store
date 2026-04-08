"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export default function ProductImageGallery({
  images,
  productName,
  isOnSale,
}: {
  images: ProductImage[];
  productName: string;
  isOnSale: boolean;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[active].src}
          alt={images[active].alt || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {isOnSale && (
          <span className="absolute top-4 left-4 bg-[#F36621] text-white text-sm font-semibold px-3 py-1 rounded-full">
            Sale
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                i === active ? "border-[#F36621]" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
