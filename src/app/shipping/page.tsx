import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Shipping & Delivery – Petzify" };

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping & Delivery">
      <p>
        We want your order to arrive as quickly as possible! Here is everything you need to know
        about our shipping process.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Processing Time</h2>
      <p>
        All orders are processed within <strong>3–5 business days</strong> after payment is confirmed.
        Personalized items may require additional processing time due to custom production.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Delivery Times</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm mt-2">
          <thead>
            <tr className="bg-orange-50">
              <th className="border border-gray-200 px-4 py-2 text-left">Destination</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Estimated Delivery</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Shipping Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-4 py-2">United States</td>
              <td className="border border-gray-200 px-4 py-2">7–14 business days</td>
              <td className="border border-gray-200 px-4 py-2 text-green-600 font-medium">Free</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">Canada</td>
              <td className="border border-gray-200 px-4 py-2">10–18 business days</td>
              <td className="border border-gray-200 px-4 py-2">$4.99</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">United Kingdom</td>
              <td className="border border-gray-200 px-4 py-2">10–18 business days</td>
              <td className="border border-gray-200 px-4 py-2">$4.99</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border border-gray-200 px-4 py-2">Australia</td>
              <td className="border border-gray-200 px-4 py-2">12–20 business days</td>
              <td className="border border-gray-200 px-4 py-2">$4.99</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-4 py-2">Other International</td>
              <td className="border border-gray-200 px-4 py-2">14–25 business days</td>
              <td className="border border-gray-200 px-4 py-2">$6.99</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-semibold text-gray-800">Order Tracking</h2>
      <p>
        Once your order ships, you will receive a tracking number via email. You can use it to track
        your package on the carrier's website.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Delays</h2>
      <p>
        Delivery times may be affected by holidays, weather, or customs clearance for international orders.
        We are not responsible for delays caused by carriers or customs agencies.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Questions?</h2>
      <p>📧 support@petzify.co &nbsp;|&nbsp; 📞 (301) 448-0061</p>
    </InfoPage>
  );
}
