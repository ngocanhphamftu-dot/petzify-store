import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Return Policy – Petzify" };

export default function ReturnPolicyPage() {
  return (
    <InfoPage title="Return Policy">
      <p>
        At Petzify, your satisfaction is our priority. Please read our return policy carefully before
        making a purchase.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Non-Personalized Items</h2>
      <p>
        Items that are <strong>not personalized</strong> may be returned within <strong>30 days</strong> of
        delivery, provided they are unused, in original packaging, and in the same condition as received.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Personalized / Custom Items</h2>
      <p>
        Because personalized items are made specifically for you, we <strong>cannot accept returns</strong> on
        custom products unless:
      </p>
      <ul>
        <li>The item arrived damaged or defective</li>
        <li>The item received is different from what was ordered</li>
        <li>There is a printing error on our part</li>
      </ul>
      <p>
        In these cases, please contact us within <strong>7 days</strong> of receiving your order and provide
        photos of the issue.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">How to Initiate a Return</h2>
      <ol>
        <li>Email us at <strong>support@petzify.co</strong> with your order number and reason for return.</li>
        <li>Include photos if the item is damaged or incorrect.</li>
        <li>We will respond within 2 business days with instructions.</li>
      </ol>

      <h2 className="text-xl font-semibold text-gray-800">Return Shipping</h2>
      <p>
        For returns due to our error (damaged, defective, or incorrect item), <strong>Petzify covers all return shipping costs</strong>.
        For returns of non-personalized items due to change of mind, the customer is responsible for return shipping.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Refund Processing</h2>
      <p>
        Once your return is approved and received, refunds are processed within <strong>5–10 business days</strong> to
        your original payment method (credit card, PayPal, etc.).
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
      <p>📧 support@petzify.co &nbsp;|&nbsp; 📞 (301) 448-0061</p>
    </InfoPage>
  );
}
