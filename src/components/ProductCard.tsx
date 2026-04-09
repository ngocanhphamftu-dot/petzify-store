"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const isOnSale = product.sale_price && product.sale_price !== product.regular_price;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden aspect-square">
        {image ? (
          <Image
            src={image.src}
            alt={image.alt || product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image</span>
          </div>
        )}
        {isOnSale && (
          <span className="absolute top-2 left-2 bg-[#F36621] text-white text-xs font-semibold px-2 py-1 rounded-full">
            Sale
          </span>
        )}
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-[#F36621] transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(parseFloat(product.average_rating))
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.rating_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {parseFloat(product.price) > 0 ? (
            <>
              <span className="text-[#F36621] font-bold">
                {product.type === "variable" ? "From " : ""}${parseFloat(product.price).toFixed(2)}
              </span>
              {isOnSale && parseFloat(product.regular_price) > 0 && (
                <span className="text-gray-400 line-through text-sm">
                  ${parseFloat(product.regular_price).toFixed(2)}
                </span>
              )}
            </>
          ) : (
            <span className="text-[#F36621] font-bold text-sm">View Options</span>
          )}
        </div>

        {/* CTA — always go to product page so customer can personalize */}
        <Link
          href={`/products/${product.slug}`}
          className="block w-full text-center bg-[#F36621] hover:bg-[#d4551a] text-white font-semibold text-sm py-2 rounded-xl transition-colors"
        >
          Personalize & Buy
        </Link>
      </div>
    </div>
  );
}
