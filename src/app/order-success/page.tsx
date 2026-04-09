import Link from "next/link";
import { redirect } from "next/navigation";
import api from "@/lib/woocommerce";

interface WCOrderLine {
  id: number;
  name: string;
  quantity: number;
  total: string;
  image?: { src: string } | null;
}

interface WCOrder {
  id: number;
  order_key: string;
  status: string;
  billing: { first_name: string; last_name: string; email: string };
  line_items: WCOrderLine[];
  total: string;
  fee_lines: { name: string; total: string }[];
  customer_note: string;
  date_created: string;
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; key?: string }>;
}) {
  const { id, key } = await searchParams;

  // Both id and key are required — prevents fake success page via URL manipulation
  if (!id || !key) {
    redirect("/products");
  }

  let order: WCOrder | null = null;

  try {
    const { data } = await api.get(`orders/${id}`);
    // Verify the order_key matches to prevent enumeration attacks
    if (data.order_key !== key) {
      redirect("/products");
    }
    order = data as WCOrder;
  } catch {
    // WC API unreachable — still show success page (order was created)
    // but without detailed order info
    order = null;
  }

  const customerName = order
    ? `${order.billing.first_name} ${order.billing.last_name}`.trim()
    : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {customerName ? `Thank you, ${customerName}!` : "Order Placed!"}
        </h1>
        <p className="text-gray-500">
          Your order has been received and is being prepared.
        </p>
      </div>

      {/* Order info card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800">Order #{id}</h2>
          <span className="bg-orange-50 text-[#F36621] text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {order?.status ?? "pending"}
          </span>
        </div>

        {/* Line items */}
        {order && order.line_items.length > 0 && (
          <div className="divide-y divide-gray-50 mb-4">
            {order.line_items.map((line) => (
              <div key={line.id} className="py-3 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{line.name}</p>
                  <p className="text-xs text-gray-400">Qty: {line.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  ${parseFloat(line.total).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Totals */}
        {order && (
          <div className="border-t pt-4 space-y-2 text-sm">
            {order.fee_lines?.map((fee) => (
              <div key={fee.name} className="flex justify-between text-green-600 font-medium">
                <span>{fee.name}</span>
                <span>${parseFloat(fee.total).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-gray-800 text-base pt-1">
              <span>Total</span>
              <span className="text-[#F36621]">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Delivery & email info */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-sm text-gray-600">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-lg">🚚</span>
          <div>
            <p className="font-semibold text-gray-800">Estimated Delivery</p>
            <p>13–22 business days (includes 3–5 days production + 10–17 days shipping)</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-lg">📧</span>
          <div>
            <p className="font-semibold text-gray-800">Confirmation Email</p>
            <p>
              A confirmation will be sent to{" "}
              <span className="font-medium text-gray-700">
                {order?.billing.email ?? "your email"}
              </span>
              .
            </p>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-block bg-[#F36621] hover:bg-[#d4551a] text-white font-bold px-8 py-4 rounded-full transition-colors text-center"
        >
          Continue Shopping
        </Link>
        <Link
          href="/help"
          className="inline-block border-2 border-gray-200 hover:border-[#F36621] text-gray-700 hover:text-[#F36621] font-semibold px-8 py-4 rounded-full transition-colors text-center"
        >
          Track / Help
        </Link>
      </div>
    </div>
  );
}
