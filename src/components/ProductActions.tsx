"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import { DELIVERY_DAYS, PRODUCTION_DAYS, DISCOUNT_TIERS } from "@/lib/constants";

export default function ProductActions({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectionError, setSelectionError] = useState(false);

  // Build initial selection state: { [attrName]: "" }
  const variationAttrs = product.attributes?.filter((a) => a.variation && a.options?.length > 0) ?? [];
  const [selections, setSelections] = useState<Record<string, string>>(
    Object.fromEntries(variationAttrs.map((a) => [a.name, ""]))
  );

  const price = parseFloat(product.price || "0");
  const regularPrice = parseFloat(product.regular_price || "0");
  const isOnSale = product.sale_price && product.sale_price !== product.regular_price;
  const savePercent = isOnSale && regularPrice > 0
    ? Math.round((1 - price / regularPrice) * 100)
    : null;

  const today = new Date();
  const from = new Date(today); from.setDate(today.getDate() + PRODUCTION_DAYS.min + DELIVERY_DAYS.min);
  const to = new Date(today); to.setDate(today.getDate() + PRODUCTION_DAYS.max + DELIVERY_DAYS.max);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const handleSelect = (attrName: string, value: string) => {
    setSelections((prev) => ({ ...prev, [attrName]: value }));
    setSelectionError(false);
  };

  const handleAddToCart = () => {
    // Check all variation attributes are selected
    const missing = variationAttrs.some((a) => !selections[a.name]);
    if (missing) {
      setSelectionError(true);
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Social proof */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 font-semibold px-2 py-0.5 rounded-full text-xs">
          🔥 2K+ bought in past month
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-3xl font-bold text-[#F36621]">
          ${price.toFixed(2)} USD
        </span>
        {isOnSale && regularPrice > 0 && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ${regularPrice.toFixed(2)} USD
            </span>
            <span className="bg-[#F36621] text-white text-sm font-bold px-3 py-1 rounded-full">
              Save {savePercent}%
            </span>
          </>
        )}
      </div>

      {/* Delivery */}
      <div className="flex flex-col gap-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span>🇺🇸</span>
          <span>Deliver to <span className="font-semibold text-gray-800">United States</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>🚚</span>
          <span>Get it by: <span className="font-semibold text-gray-800">{fmt(from)} – {fmt(to)}</span></span>
        </div>
      </div>

      {/* Dynamic Attribute Selectors */}
      {variationAttrs.map((attr) => (
        <div key={attr.name}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-800 text-sm">
              {attr.name}
              {selections[attr.name] && (
                <span className="ml-2 text-[#F36621] font-normal">— {selections[attr.name]}</span>
              )}
            </span>
            {attr.name.toLowerCase().includes("size") && (
              <button className="text-sm text-[#F36621] underline">Size Chart</button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(attr.name, option)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                  selections[attr.name] === option
                    ? "border-[#F36621] bg-orange-50 text-[#F36621]"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Error message */}
      {selectionError && (
        <p className="text-red-500 text-sm -mt-2">Please select all options above.</p>
      )}

      {/* Buy More Save More */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
        <p className="font-semibold text-gray-800 mb-2 text-sm">Buy More, Save More</p>
        <div className="flex flex-col gap-1.5 text-sm">
          {Object.entries(DISCOUNT_TIERS).map(([qty, rate]) => (
            <div key={qty} className="flex items-center gap-2">
              <span>🎁</span>
              <span className="text-gray-600">BUY {qty}{parseInt(qty) === Math.max(...Object.keys(DISCOUNT_TIERS).map(Number)) ? "+" : ""}</span>
              <span className="text-[#F36621] font-bold">GET {Math.round(rate * 100)}% OFF</span>
            </div>
          ))}
          <p className="text-gray-400 text-xs mt-1">Auto apply discounts on Cart Page</p>
        </div>
      </div>

      {/* Stock */}
      <p className={`text-sm font-medium ${product.stock_status === "instock" ? "text-green-600" : "text-red-500"}`}>
        {product.stock_status === "instock" ? "✓ In Stock" : "✗ Out of Stock"}
      </p>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock_status !== "instock"}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          product.stock_status !== "instock"
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-[#F36621] hover:bg-[#d4551a] text-white"
        }`}
      >
        {added ? "✓ Added to Cart!" : product.stock_status !== "instock" ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
