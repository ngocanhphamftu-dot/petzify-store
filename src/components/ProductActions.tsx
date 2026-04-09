"use client";

import { useState, useMemo } from "react";
import { useCartStore } from "@/store/cartStore";
import { Product, WCVariation } from "@/types";
import { DELIVERY_DAYS, PRODUCTION_DAYS, DISCOUNT_TIERS } from "@/lib/constants";

interface Props {
  product: Product;
  variations?: WCVariation[];
}

export default function ProductActions({ product, variations = [] }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [selectionError, setSelectionError] = useState(false);
  const [personalization, setPersonalization] = useState("");

  // Build variation attribute selectors from product attributes
  const variationAttrs = product.attributes?.filter((a) => a.variation && a.options?.length > 0) ?? [];
  const [selections, setSelections] = useState<Record<string, string>>(
    Object.fromEntries(variationAttrs.map((a) => [a.name, ""]))
  );

  // Check if all variation attributes have been selected
  const allSelected = variationAttrs.length === 0 || variationAttrs.every((a) => selections[a.name]);

  // Find the matching WC variation based on selected attributes
  const selectedVariation = useMemo<WCVariation | null>(() => {
    if (!allSelected || variations.length === 0) return null;
    return (
      variations.find((v) =>
        v.attributes.every((attr) => selections[attr.name] === attr.option)
      ) ?? null
    );
  }, [variations, selections, allSelected]);

  // Use variation-specific price/stock when a variation is selected
  const displayPrice = selectedVariation
    ? parseFloat(selectedVariation.price || "0")
    : parseFloat(product.price || "0");
  const displayRegularPrice = selectedVariation
    ? parseFloat(selectedVariation.regular_price || "0")
    : parseFloat(product.regular_price || "0");
  const isOnSale =
    selectedVariation
      ? selectedVariation.sale_price && selectedVariation.sale_price !== selectedVariation.regular_price
      : product.sale_price && product.sale_price !== product.regular_price;
  const savePercent =
    isOnSale && displayRegularPrice > 0
      ? Math.round((1 - displayPrice / displayRegularPrice) * 100)
      : null;

  const stockStatus = selectedVariation ? selectedVariation.stock_status : product.stock_status;
  const stockQty = selectedVariation ? selectedVariation.stock_quantity : product.stock_quantity;
  const isInStock = stockStatus === "instock";
  const isLowStock = isInStock && stockQty !== null && stockQty <= 5;

  const today = new Date();
  const from = new Date(today);
  from.setDate(today.getDate() + PRODUCTION_DAYS.min + DELIVERY_DAYS.min);
  const to = new Date(today);
  to.setDate(today.getDate() + PRODUCTION_DAYS.max + DELIVERY_DAYS.max);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const handleSelect = (attrName: string, value: string) => {
    setSelections((prev) => ({ ...prev, [attrName]: value }));
    setSelectionError(false);
  };

  const handleAddToCart = () => {
    // Validate all variation attributes are selected
    const missing = variationAttrs.some((a) => !selections[a.name]);
    if (missing) {
      setSelectionError(true);
      return;
    }

    // When a variation is selected, override the parent product's price with
    // the variation's actual price so the cart displays the correct amount.
    const productToAdd = selectedVariation
      ? {
          ...product,
          price: selectedVariation.price || product.price,
          regular_price: selectedVariation.regular_price || product.regular_price,
          sale_price: selectedVariation.sale_price || "",
        }
      : product;

    addItem(
      productToAdd,
      1,
      selectedVariation?.id,
      Object.keys(selections).length > 0 ? { ...selections } : undefined,
      personalization.trim() || undefined
    );
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
          ${displayPrice.toFixed(2)} USD
        </span>
        {isOnSale && displayRegularPrice > 0 && (
          <>
            <span className="text-lg text-gray-400 line-through">
              ${displayRegularPrice.toFixed(2)} USD
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
          <span>
            Get it by:{" "}
            <span className="font-semibold text-gray-800">
              {fmt(from)} – {fmt(to)}
            </span>
          </span>
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
              <a href="/size-chart" target="_blank" className="text-sm text-[#F36621] underline">
                Size Chart
              </a>
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

      {/* Selection error */}
      {selectionError && (
        <p className="text-red-500 text-sm -mt-2">Please select all options above.</p>
      )}

      {/* Personalization input */}
      <div>
        <label className="block font-semibold text-gray-800 text-sm mb-2">
          Personalization{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={personalization}
          onChange={(e) => setPersonalization(e.target.value)}
          placeholder="Enter name, date, or custom text..."
          maxLength={120}
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1.5">
          This will be printed/engraved on your product exactly as written.
        </p>
      </div>

      {/* Buy More Save More */}
      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
        <p className="font-semibold text-gray-800 mb-2 text-sm">Buy More, Save More</p>
        <div className="flex flex-col gap-1.5 text-sm">
          {Object.entries(DISCOUNT_TIERS).map(([qty, rate]) => (
            <div key={qty} className="flex items-center gap-2">
              <span>🎁</span>
              <span className="text-gray-600">
                BUY {qty}
                {parseInt(qty) === Math.max(...Object.keys(DISCOUNT_TIERS).map(Number)) ? "+" : ""}
              </span>
              <span className="text-[#F36621] font-bold">GET {Math.round(rate * 100)}% OFF</span>
            </div>
          ))}
          <p className="text-gray-400 text-xs mt-1">Auto-applied in cart</p>
        </div>
      </div>

      {/* Stock */}
      {isLowStock ? (
        <p className="text-sm font-medium text-amber-600">
          ⚠️ Only {stockQty} left — order soon!
        </p>
      ) : (
        <p className={`text-sm font-medium ${isInStock ? "text-green-600" : "text-red-500"}`}>
          {isInStock ? "✓ In Stock" : "✗ Out of Stock"}
        </p>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={!isInStock}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          !isInStock
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : added
            ? "bg-green-500 text-white"
            : "bg-[#F36621] hover:bg-[#d4551a] text-white"
        }`}
      >
        {added
          ? "✓ Added to Cart!"
          : !isInStock
          ? "Out of Stock"
          : "Add to Cart"}
      </button>
    </div>
  );
}
