"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { getDiscount } from "@/lib/constants";

export default function CartDrawer() {
  const { items, isOpen, closeDrawer, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = totalPrice();
  const discountRate = getDiscount(items.length);
  const discount = subtotal * discountRate;
  const finalTotal = subtotal - discount;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#F36621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="font-bold text-gray-900 text-lg">Your Cart</h2>
            {totalItems() > 0 && (
              <span className="bg-[#F36621] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems()}
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Buy More Save More banner */}
        {items.length > 0 && (
          <div className="bg-orange-50 border-b border-orange-100 px-5 py-2.5">
            <p className="text-xs font-semibold text-gray-700 mb-1">🎁 Buy More, Save More</p>
            <div className="flex gap-3 text-xs text-gray-500">
              <span className={items.length >= 2 ? "text-[#F36621] font-bold" : ""}>BUY 2 → 15% OFF</span>
              <span className={items.length >= 3 ? "text-[#F36621] font-bold" : ""}>BUY 3 → 20% OFF</span>
              <span className={items.length >= 4 ? "text-[#F36621] font-bold" : ""}>BUY 4+ → 25% OFF</span>
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[#F36621]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="text-[#F36621] font-semibold text-sm hover:underline"
              >
                Continue Shopping →
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price =
                parseFloat(item.product.price) || parseFloat(item.product.regular_price) || 0;
              const img = item.product.images?.[0]?.src;
              return (
                <div key={item.cartItemId} className="flex gap-3">
                  {/* Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.slug}`}
                      onClick={closeDrawer}
                      className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[#F36621] transition-colors leading-snug"
                    >
                      {item.product.name}
                    </Link>

                    {/* Selected attributes */}
                    {item.selectedAttributes &&
                      Object.entries(item.selectedAttributes).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {Object.entries(item.selectedAttributes).map(([k, v]) => (
                            <span
                              key={k}
                              className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
                            >
                              {k}: {v}
                            </span>
                          ))}
                        </div>
                      )}

                    {/* Personalization */}
                    {item.personalization && (
                      <p className="text-xs text-gray-500 mt-0.5 italic truncate">
                        ✏️ &quot;{item.personalization}&quot;
                      </p>
                    )}

                    <p className="text-[#F36621] font-bold text-sm mt-1">${price.toFixed(2)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors text-lg leading-none"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item total */}
                  <div className="text-sm font-bold text-gray-700 flex-shrink-0 pt-0.5">
                    ${(price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 space-y-3">
            {/* Price summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({totalItems()} item{totalItems() !== 1 ? "s" : ""})
                </span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount ({Math.round(discountRate * 100)}% off)</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#F36621]">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Free shipping notice */}
            <div className="bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2 text-xs text-green-700 font-medium">
              <span>🚚</span>
              <span>
                You&apos;ve unlocked <strong>FREE US Shipping!</strong>
              </span>
            </div>

            {/* Buttons */}
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block w-full bg-[#F36621] hover:bg-[#d4551a] text-white font-bold text-center py-3.5 rounded-2xl transition-colors text-base"
            >
              Checkout — ${finalTotal.toFixed(2)}
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full border-2 border-gray-200 hover:border-[#F36621] text-gray-700 hover:text-[#F36621] font-semibold text-center py-3 rounded-2xl transition-colors text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
