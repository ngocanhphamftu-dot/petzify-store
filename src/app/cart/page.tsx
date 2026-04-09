"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { getDiscount } from "@/lib/constants";
import { syncCartAndRedirectToCheckout } from "@/lib/wcCartSync";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [syncing, setSyncing] = useState(false);

  const handleCheckout = async () => {
    if (syncing || items.length === 0) return;
    setSyncing(true);
    try {
      await syncCartAndRedirectToCheckout(items);
    } catch {
      window.location.href = "/checkout";
    }
  };

  const subtotal = totalPrice();
  const discountRate = getDiscount(items.length);
  const discount = subtotal * discountRate;
  const finalTotal = subtotal - discount;

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
          {items.map((item) => {
            const image = item.product.images[0];
            const price =
              parseFloat(item.product.price) || parseFloat(item.product.regular_price) || 0;
            return (
              <div
                key={item.cartItemId}
                className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  {image ? (
                    <Image
                      src={image.src}
                      alt={image.alt || item.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No img
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold text-gray-800 hover:text-[#F36621] line-clamp-2 transition-colors"
                  >
                    {item.product.name}
                  </Link>

                  {/* Selected attributes */}
                  {item.selectedAttributes &&
                    Object.entries(item.selectedAttributes).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(item.selectedAttributes).map(([k, v]) => (
                          <span
                            key={k}
                            className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
                          >
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Personalization */}
                  {item.personalization && (
                    <p className="text-xs text-gray-500 mt-1 italic">
                      ✏️ &quot;{item.personalization}&quot;
                    </p>
                  )}

                  <p className="text-[#F36621] font-bold mt-1">${price.toFixed(2)}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-red-400 hover:text-red-600 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="text-right font-bold text-gray-800">
                  ${(price * item.quantity).toFixed(2)}
                </div>
              </div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

            {/* Buy More Save More */}
            {discountRate > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-4 text-sm text-green-700 font-medium">
                🎁 {Math.round(discountRate * 100)}% discount applied!
              </div>
            )}

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({Math.round(discountRate * 100)}% off)</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg text-gray-800">
                <span>Total</span>
                <span className="text-[#F36621]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={syncing}
              className={`block w-full text-center font-bold py-4 rounded-2xl transition-colors ${
                syncing
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#F36621] hover:bg-[#d4551a] text-white"
              }`}
            >
              {syncing ? "Redirecting..." : "Proceed to Checkout"}
            </button>

            <Link
              href="/products"
              className="block text-center text-sm text-gray-500 hover:text-[#F36621] mt-3 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
