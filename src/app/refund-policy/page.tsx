import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Refund & Replacement Policy – Petzify" };

export default function RefundPolicyPage() {
  return (
    <InfoPage title="Refund & Replacement Policy">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        We stand behind the quality of every product we create. If something is not right, we will make it right.
      </p>

      <h2>Eligible Cases for Refund or Replacement</h2>
      <p>You are eligible for a <strong>full refund or free replacement</strong> if:</p>
      <ul>
        <li>Your item arrived <strong>damaged</strong> during shipping</li>
        <li>The product has a <strong>manufacturing or printing defect</strong></li>
        <li>You received the <strong>wrong item</strong></li>
        <li>The <strong>print quality</strong> is significantly different from what was displayed</li>
      </ul>

      <h2>How to Request a Refund or Replacement</h2>
      <ol>
        <li>Contact us at <a href="mailto:support@petzify.co">support@petzify.co</a> within <strong>7 days</strong> of delivery.</li>
        <li>Include your order number and clear photos showing the issue.</li>
        <li>Our team will review and respond within <strong>2 business days</strong>.</li>
      </ol>

      <h2>Refund Timeline</h2>
      <p>
        Approved refunds are returned to your original payment method within{" "}
        <strong>5–10 business days</strong>. Replacement items are shipped within{" "}
        <strong>5 business days</strong> of approval.
      </p>

      <h2>Not Eligible for Refund or Replacement</h2>
      <ul>
        <li>Incorrect personalization details submitted by the customer (e.g. wrong name, wrong color)</li>
        <li>Change of mind after the order has been produced</li>
        <li>Requests submitted more than <strong>7 days</strong> after delivery</li>
        <li>Normal wear and tear or damage caused by misuse</li>
      </ul>

      <h2>Contact Us</h2>
      <p>
        📧 <a href="mailto:support@petzify.co">support@petzify.co</a> &nbsp;|&nbsp; 📞 (301) 448-0061<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States
      </p>
    </InfoPage>
  );
}
