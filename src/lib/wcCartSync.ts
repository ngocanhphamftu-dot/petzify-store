/**
 * Syncs the Next.js Zustand cart to the WooCommerce Store API session,
 * then redirects the browser to the native WC /checkout page so that
 * the CardsShield Gateway PayPal plugin renders its own payment UI.
 *
 * Flow:
 *   1. GET  /wp-json/wc/store/v1/cart            → get session nonce
 *   2. DELETE /wp-json/wc/store/v1/cart/items    → clear any existing WC cart
 *   3. POST /wp-json/wc/store/v1/cart/add-item   → add each item (qty + variation)
 *   4. window.location.href = "/checkout"        → WC checkout with native plugin UI
 */

import type { CartItem } from "@/types";

export async function syncCartAndRedirectToCheckout(items: CartItem[]): Promise<void> {
  // ── 1. Fetch nonce ──────────────────────────────────────────────────────
  const cartRes = await fetch("/wp-json/wc/store/v1/cart", {
    credentials: "include",
  });

  // WC Store API returns the nonce in a response header
  const nonce =
    cartRes.headers.get("Nonce") ??
    cartRes.headers.get("X-WC-Store-API-Nonce") ??
    "";

  const authHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (nonce) authHeaders["Nonce"] = nonce;

  // ── 2. Clear existing WC cart ───────────────────────────────────────────
  await fetch("/wp-json/wc/store/v1/cart/items", {
    method: "DELETE",
    credentials: "include",
    headers: nonce ? { Nonce: nonce } : {},
  });

  // ── 3. Add each item ────────────────────────────────────────────────────
  for (const item of items) {
    // Use variationId when set (WC accepts variation IDs as product id)
    const id = item.variationId ?? item.product.id;

    await fetch("/wp-json/wc/store/v1/cart/add-item", {
      method: "POST",
      credentials: "include",
      headers: authHeaders,
      body: JSON.stringify({ id, quantity: item.quantity }),
    });
  }

  // ── 4. Hand off to WooCommerce checkout ─────────────────────────────────
  window.location.href = "/checkout";
}
