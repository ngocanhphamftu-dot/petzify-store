"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { getDiscount } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Idempotency key: generated once per checkout session
  // prevents duplicate orders on double-click or network retry
  const idempotencyKey = useRef<string>("");
  useEffect(() => {
    idempotencyKey.current = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }, []);

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

  const setField = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // Client-side validation
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!form.firstName.trim()) errors.firstName = "First name is required.";
    if (!form.lastName.trim()) errors.lastName = "Last name is required.";
    if (!form.address.trim()) errors.address = "Street address is required.";
    if (!form.city.trim()) errors.city = "City is required.";
    return errors;
  };

  const subtotal = totalPrice();
  const discountRate = getDiscount(items.length);
  const discount = subtotal * discountRate;
  const finalTotal = subtotal - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          ...form,
          paymentMethod: "mecom_paypal",
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            variationId: i.variationId,
            selectedAttributes: i.selectedAttributes,
            personalization: i.personalization,
            expectedPrice:
              parseFloat(i.product.price) || parseFloat(i.product.regular_price) || 0,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        if (data.paymentUrl) {
          // PayPal redirect — send user to WooCommerce payment page
          // which then redirects to PayPal
          window.location.href = data.paymentUrl;
        } else {
          router.push(`/order-success?id=${data.orderId}&key=${data.orderKey}`);
        }
      } else if (res.status === 422 && data.errors) {
        setError(data.errors.join("\n"));
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h1>
        <Link
          href="/products"
          className="inline-block bg-[#F36621] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#d4551a] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const inputClass = (field?: string) =>
    `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
      field && fieldErrors[field]
        ? "border-red-400 focus:border-red-400"
        : "border-gray-300 focus:border-[#F36621]"
    }`;

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
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email address *"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={inputClass("email")}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={inputClass()}
                />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="First name *"
                      value={form.firstName}
                      onChange={(e) => setField("firstName", e.target.value)}
                      className={inputClass("firstName")}
                    />
                    {fieldErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Last name *"
                      value={form.lastName}
                      onChange={(e) => setField("lastName", e.target.value)}
                      className={inputClass("lastName")}
                    />
                    {fieldErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">
                    Street address *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="House number and street name"
                        value={form.address}
                        onChange={(e) => setField("address", e.target.value)}
                        className={inputClass("address")}
                      />
                      {fieldErrors.address && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.address}</p>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Apartment, suite, unit (optional)"
                      value={form.address2}
                      onChange={(e) => setField("address2", e.target.value)}
                      className={inputClass()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City *"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className={inputClass("city")}
                    />
                    {fieldErrors.city && (
                      <p className="text-red-500 text-xs mt-1">{fieldErrors.city}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="State"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className={inputClass()}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    value={form.postcode}
                    onChange={(e) => setField("postcode", e.target.value)}
                    className={inputClass()}
                  />
                  <select
                    value={form.country}
                    onChange={(e) => setField("country", e.target.value)}
                    className={inputClass()}
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
                placeholder="Any special instructions for your order..."
                value={form.note}
                onChange={(e) => setField("note", e.target.value)}
                className={`${inputClass()} resize-none`}
              />
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment</h2>

              <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 flex items-start gap-3">
                <span className="text-xl mt-0.5">🔒</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Secure Payment via PayPal</p>
                  <p className="text-xs text-gray-500 mt-1">
                    After reviewing your order, you will be redirected to the payment page to choose PayPal or pay by credit/debit card — powered by PayPal.
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm whitespace-pre-line">
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
                {items.map((item) => {
                  const image = item.product.images[0];
                  const price =
                    parseFloat(item.product.price) ||
                    parseFloat(item.product.regular_price) ||
                    0;
                  return (
                    <div key={item.cartItemId} className="flex gap-3 items-start">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {image ? (
                          <Image
                            src={image.src}
                            alt={image.alt || item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : null}
                        <span className="absolute -top-1 -right-1 bg-[#F36621] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">
                          {item.product.name}
                        </p>
                        {/* Show variant selection */}
                        {item.selectedAttributes &&
                          Object.entries(item.selectedAttributes).map(([k, v]) => (
                            <p key={k} className="text-xs text-gray-400">
                              {k}: {v}
                            </p>
                          ))}
                        {/* Show personalization */}
                        {item.personalization && (
                          <p className="text-xs text-gray-400 italic">
                            ✏️ &quot;{item.personalization}&quot;
                          </p>
                        )}
                        <p className="text-sm text-[#F36621] font-semibold mt-0.5">
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 flex flex-col gap-2 text-sm text-gray-600">
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
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span className="text-[#F36621]">${finalTotal.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-5 py-4 rounded-2xl font-bold text-lg transition-all ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0070ba] hover:bg-[#005ea6] text-white shadow-md hover:shadow-lg"
                }`}
              >
                {loading ? "Processing..." : `Place Order — $${finalTotal.toFixed(2)}`}
              </button>

              {/* Trust signals */}
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-400">
                <span>🔒 SSL Secured</span>
                <span>·</span>
                <span>🚚 Free shipping</span>
                <span>·</span>
                <span>🛡️ Buyer Protection</span>
              </div>

              <Link
                href="/cart"
                className="block text-center text-sm text-gray-400 hover:text-[#F36621] mt-3 transition-colors"
              >
                ← Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
