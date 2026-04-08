import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Refund & Replacement Policy – Petzify" };

export default function RefundPolicyPage() {
  return (
    <InfoPage title="Refund & Replacement Policy">
      <p>
        We stand behind the quality of our products. If something goes wrong, we are here to make it right.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Eligible Cases for Refund or Replacement</h2>
      <p>You are eligible for a full refund or free replacement if:</p>
      <ul>
        <li>Your item arrived <strong>damaged</strong> during shipping</li>
        <li>The product has a <strong>manufacturing defect</strong></li>
        <li>You received the <strong>wrong item</strong></li>
        <li>The <strong>print quality</strong> is significantly different from what was shown</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">How to Request</h2>
      <ol>
        <li>Contact us at <strong>support@petzify.co</strong> within <strong>7 days</strong> of delivery.</li>
        <li>Include your order number and clear photos showing the issue.</li>
        <li>Our team will review and respond within 2 business days.</li>
      </ol>

      <h2 className="text-xl font-semibold text-gray-800">Refund Timeline</h2>
      <p>
        Approved refunds are returned to your original payment method within <strong>5–10 business days</strong>.
        Replacement items are shipped within 5 business days of approval.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Not Eligible</h2>
      <ul>
        <li>Incorrect personalization details submitted by the customer</li>
        <li>Change of mind after the order has been produced</li>
        <li>Requests submitted more than 7 days after delivery</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
      <p>📧 support@petzify.co &nbsp;|&nbsp; 📞 (301) 448-0061</p>
    </InfoPage>
  );
}
