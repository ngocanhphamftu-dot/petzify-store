"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    postcode: "",
    country: "US",
    note: "",
  });

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push(`/order-success?id=${data.orderId}`);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <Link href="/products" className="inline-block bg-[#F36621] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d4551a] transition-colors">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="email"
                  required
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="First name *"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Last name *"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Street address *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="House number and street name"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit, etc. (optional)"
                      value={form.address2}
                      onChange={(e) => set("address2", e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={form.postcode}
                    onChange={(e) => set("postcode", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors"
                  />
                  <select
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors bg-white"
                  >
                    <option value="US">🇺🇸 United States</option>
                    <option value="VN">🇻🇳 Vietnam</option>
                    <option value="GB">🇬🇧 United Kingdom</option>
                    <option value="CA">🇨🇦 Canada</option>
                    <option value="AU">🇦🇺 Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Note */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Note (optional)</h2>
              <textarea
                rows={3}
                placeholder="Add a note to your order..."
                value={form.note}
                onChange={(e) => set("note", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F36621] transition-colors resize-none"
              />
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment</h2>
              <div className="flex items-center gap-3 border border-[#F36621] bg-orange-50 rounded-xl px-4 py-3">
                <div className="w-4 h-4 rounded-full bg-[#F36621] flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
              </div>
              <p className="text-xs text-gray-400 mt-2 ml-1">Pay when you receive your order.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="flex flex-col gap-3 mb-4">
                {items.map(({ product, quantity }) => {
                  const image = product.images[0];
                  return (
                    <div key={product.id} className="flex gap-3 items-start">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {image ? (
                          <Image src={image.src} alt={image.alt || product.name} fill className="object-cover" sizes="56px" />
                        ) : null}
                        <span className="absolute -top-1 -right-1 bg-[#F36621] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                          {quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</p>
                        <p className="text-sm text-[#F36621] font-semibold mt-0.5">
                          ${(parseFloat(product.price) * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span className="text-[#F36621]">${totalPrice().toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-5 py-4 rounded-2xl font-bold text-lg transition-all ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#F36621] hover:bg-[#d4551a] text-white"
                }`}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <Link href="/cart" className="block text-center text-sm text-gray-400 hover:text-[#F36621] mt-3 transition-colors">
                ← Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
