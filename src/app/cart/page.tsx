"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/products"
          className="inline-block bg-[#F36621] hover:bg-[#d4551a] text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const image = product.images[0];
            return (
              <div key={product.id} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug}`} className="font-semibold text-gray-800 hover:text-[#F36621] line-clamp-2 transition-colors">
                    {product.name}
                  </Link>
                  <p className="text-[#F36621] font-bold mt-1">${parseFloat(product.price).toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors">−</button>
                      <span className="px-3 py-1 text-sm font-semibold">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors">+</button>
                    </div>
                    <button onClick={() => removeItem(product.id)} className="text-red-400 hover:text-red-600 text-sm transition-colors">
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-gray-800">
                  ${(parseFloat(product.price) * quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

          <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-[#F36621]">${totalPrice().toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-[#F36621] hover:bg-[#d4551a] text-white font-bold py-4 rounded-2xl transition-colors"
            >
              Proceed to Checkout
            </Link>

            <Link href="/products" className="block text-center text-sm text-gray-500 hover:text-[#F36621] mt-3 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
