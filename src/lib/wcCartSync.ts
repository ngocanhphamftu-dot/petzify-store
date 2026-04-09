/**
 * Syncs the Next.js Zustand cart to the WooCommerce session (via WC Store API),
 * then redirects the browser to the native WC /checkout/ page so that
 * the CardsShield Gateway PayPal plugin renders its own payment UI.
 *
 * Why this works:
 *   - All fetch calls are same-origin (petzify.co → petzify.co/wp-json/)
 *   - credentials:"include" makes the browser automatically send + receive
 *     the woocommerce_session_* cookie on every request
 *   - window.location.href = "/checkout/" uses the same cookie jar,
 *     so WC sees a non-empty cart and renders the checkout form
 */

import type { CartItem } from "@/types";

export async function syncCartAndRedirectToCheckout(items: CartItem[]): Promise<void> {
  // ── 1. GET /cart  → establishes WC session cookie + returns Nonce ──────
  const cartRes = await fetch("/wp-json/wc/store/v1/cart", {
    credentials: "include",
  });

  if (!cartRes.ok) {
    throw new Error(`WC Store API unavailable (${cartRes.status})`);
  }

  // Nonce is safe to read — same-origin request, no CORS restriction
  const nonce = cartRes.headers.get("Nonce") ?? "";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(nonce ? { Nonce: nonce } : {}),
  };

  // ── 2. DELETE all existing items in WC cart ─────────────────────────────
  await fetch("/wp-json/wc/store/v1/cart/items", {
    method: "DELETE",
    credentials: "include",
    headers: nonce ? { Nonce: nonce } : {},
  });

  // ── 3. Add each item ────────────────────────────────────────────────────
  for (const item of items) {
    // For variable products use variationId; WC treats variations as products
    const id = item.variationId ?? item.product.id;

    await fetch("/wp-json/wc/store/v1/cart/add-item", {
      method: "POST",
      credentials: "include",
      headers,
      body: JSON.stringify({ id, quantity: item.quantity }),
    });
  }

  // ── 4. Navigate to WC native checkout ───────────────────────────────────
  // The browser cookie jar now has the WC session with items populated,
  // so WooCommerce will render the checkout form instead of redirecting to cart.
  window.location.href = "/checkout/";
}
