/**
 * WooCommerce Order Received handler
 *
 * After PayPal payment, WooCommerce redirects the customer to:
 *   /checkout/order-received/{orderId}/?key={orderKey}
 *
 * This page captures that redirect and forwards to our branded
 * /order-success page so the customer sees the correct confirmation UI.
 */
import { redirect } from "next/navigation";

export default async function OrderReceivedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;

  if (id && key) {
    redirect(`/order-success?id=${id}&key=${key}`);
  }

  // Fallback: missing key means something went wrong — send to help page
  redirect("/help");
}
