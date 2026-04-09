/**
 * Syncs the Next.js Zustand cart to WooCommerce via a custom PHP REST endpoint,
 * then navigates to the native WC /checkout/ page so CardsShield renders its UI.
 *
 * Endpoint: POST /wp-json/petzify/v1/cart-sync
 *   - Clears the WC cart
 *   - Adds each item via WC()->cart->add_to_cart()
 *   - Sets the WC session cookie in the browser
 *   - Returns { checkout_url }
 *
 * Because the fetch is same-origin and uses credentials:"include", the
 * woocommerce_session_* cookie is automatically sent on the subsequent
 * navigation to /checkout/, so WC sees a populated cart.
 */

import type { CartItem } from "@/types";

export async function syncCartAndRedirectToCheckout(items: CartItem[]): Promise<void> {
  const payload = items.map((item) => ({
    productId:          item.product.id,
    quantity:           item.quantity,
    variationId:        item.variationId ?? null,
    selectedAttributes: item.selectedAttributes ?? {},
    personalization:    item.personalization ?? "",
  }));

  const res = await fetch("/wp-json/petzify/v1/cart-sync", {
    method:      "POST",
    credentials: "include",          // sends + receives WC session cookie
    headers:     { "Content-Type": "application/json" },
    body:        JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `Cart sync failed (${res.status})`);
  }

  const data = await res.json();

  // Navigate to WC checkout — session cookie now has the populated cart
  window.location.href = data.checkout_url ?? "/checkout/";
}
