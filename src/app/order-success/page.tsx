import Link from "next/link";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="text-7xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Placed!</h1>
      {id && (
        <p className="text-gray-500 mb-2 text-sm">
          Order ID: <span className="font-semibold text-gray-700">#{id}</span>
        </p>
      )}
      <p className="text-gray-500 mb-8">
        Thank you for your purchase! We will process your order and ship it soon.
      </p>

      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-sm text-gray-600 text-left">
        <div className="flex items-center gap-2 mb-2">
          <span>🚚</span>
          <span>Estimated delivery: <strong>10–17 business days</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span>📧</span>
          <span>Confirmation email will be sent to your inbox</span>
        </div>
      </div>

      <Link
        href="/products"
        className="inline-block bg-[#F36621] hover:bg-[#d4551a] text-white font-bold px-8 py-4 rounded-full transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
