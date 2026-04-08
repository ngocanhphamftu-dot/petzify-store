import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Return Policy – Petzify" };

export default function ReturnPolicyPage() {
  return (
    <InfoPage title="Return Policy">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        At Petzify, your satisfaction is our priority. Please read our return policy carefully before
        making a purchase.
      </p>

      <h2>Non-Personalized Items</h2>
      <p>
        Items that are <strong>not personalized</strong> may be returned within <strong>30 days</strong> of
        delivery, provided they are unused, in original packaging, and in the same condition as received.
      </p>

      <h2>Personalized / Custom Items</h2>
      <p>
        Because personalized items are made specifically for you, we <strong>cannot accept returns</strong> on
        custom products unless:
      </p>
      <ul>
        <li>The item arrived damaged or defective</li>
        <li>The item received is different from what was ordered</li>
        <li>There is a printing or production error on our part</li>
      </ul>
      <p>
        In these cases, please contact us within <strong>7 days</strong> of receiving your order and provide
        clear photos of the issue.
      </p>

      <h2>How to Initiate a Return</h2>
      <ol>
        <li>Email <strong>support@petzify.co</strong> with your order number and reason for return.</li>
        <li>Include clear photos if the item is damaged or incorrect.</li>
        <li>We will respond within <strong>2 business days</strong> with instructions.</li>
      </ol>

      <h2>Return Shipping</h2>
      <p>
        For returns due to our error (damaged, defective, or incorrect item),{" "}
        <strong>Petzify covers all return shipping costs</strong>. For returns of non-personalized items
        due to change of mind, the customer is responsible for return shipping costs.
      </p>

      <h2>Refund Processing</h2>
      <p>
        Once your return is approved and the item is received, refunds are processed within{" "}
        <strong>5–10 business days</strong> to your original payment method (credit card, PayPal, etc.).
      </p>

      <h2>Contact Us</h2>
      <p>
        📧 <a href="mailto:support@petzify.co">support@petzify.co</a> &nbsp;|&nbsp; 📞 (301) 448-0061<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States
      </p>
    </InfoPage>
  );
}
