import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Shipping & Delivery – Petzify" };

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping & Delivery">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        We want your order to arrive as quickly as possible. Here is everything you need to know
        about our shipping process.
      </p>

      <h2>Production Time</h2>
      <p>
        All orders require <strong>3–5 business days</strong> of production time after payment is confirmed.
        Each item is made-to-order, so please allow this time before shipment.
      </p>

      <h2>Delivery Times</h2>
      <p>After production, estimated delivery times are:</p>

      <div className="overflow-x-auto not-prose my-4">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#F36621] text-white">
              <th className="px-4 py-3 text-left rounded-tl-xl">Destination</th>
              <th className="px-4 py-3 text-left">Transit Time</th>
              <th className="px-4 py-3 text-left">Total (incl. production)</th>
              <th className="px-4 py-3 text-left rounded-tr-xl">Shipping Cost</th>
            </tr>
          </thead>
          <tbody>
            {[
              { dest: "United States", transit: "10–17 business days", total: "13–22 business days", cost: "Free", free: true },
              { dest: "Canada",        transit: "12–20 business days", total: "15–25 business days", cost: "$4.99", free: false },
              { dest: "United Kingdom",transit: "12–20 business days", total: "15–25 business days", cost: "$4.99", free: false },
              { dest: "Australia",     transit: "14–22 business days", total: "17–27 business days", cost: "$4.99", free: false },
              { dest: "Other International", transit: "16–28 business days", total: "19–33 business days", cost: "$6.99", free: false },
            ].map((row, i) => (
              <tr key={row.dest} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-3 font-semibold text-gray-800">{row.dest}</td>
                <td className="px-4 py-3 text-gray-600">{row.transit}</td>
                <td className="px-4 py-3 text-gray-600">{row.total}</td>
                <td className={`px-4 py-3 font-medium ${row.free ? "text-green-600" : "text-gray-600"}`}>{row.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 not-prose">
        * Business days exclude weekends and public holidays. Delivery dates are estimates and not guaranteed.
      </p>

      <h2>Free Shipping</h2>
      <p>
        We offer <strong>free standard shipping</strong> on all orders to the United States — no minimum
        order required.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once your order ships, you will receive a <strong>tracking number via email</strong>. You can use it
        to track your package directly on the carrier&apos;s website.
      </p>

      <h2>Delays</h2>
      <p>
        Delivery times may be affected by holidays, extreme weather, or customs clearance for international
        orders. We are not responsible for delays caused by carriers or customs agencies beyond our control.
      </p>

      <h2>Lost or Missing Packages</h2>
      <p>
        If your package has not arrived after the estimated delivery window, please contact us at{" "}
        <a href="mailto:support@petzify.co">support@petzify.co</a>. We will investigate with the carrier
        and work to resolve the issue as quickly as possible.
      </p>

      <h2>Questions?</h2>
      <p>
        📧 <a href="mailto:support@petzify.co">support@petzify.co</a> &nbsp;|&nbsp; 📞 (301) 448-0061<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States
      </p>
    </InfoPage>
  );
}
