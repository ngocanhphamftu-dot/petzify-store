import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Cancellation & Modification Policy – Petzify" };

export default function CancellationPolicyPage() {
  return (
    <InfoPage title="Cancellation & Modification Policy">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        We begin processing orders quickly to ensure fast production and delivery. Please review our
        cancellation and modification policy below before placing your order.
      </p>

      <h2>Order Cancellations</h2>
      <p>
        You may request a cancellation within <strong>12 hours</strong> of placing your order, provided
        it has not yet entered production. To cancel, email us immediately at{" "}
        <a href="mailto:support@petzify.co">support@petzify.co</a> with your order number in the subject line.
      </p>
      <p>
        Once production has begun, cancellations are <strong>no longer possible</strong> for personalized items,
        as the product is already being custom-made for you.
      </p>

      <h2>Order Modifications</h2>
      <p>
        If you need to change personalization details (such as name, text, size, or color), please contact
        us within <strong>6 hours</strong> of placing your order. After this window, modifications may
        not be possible once production has started.
      </p>

      <h2>How to Request a Cancellation or Modification</h2>
      <ol>
        <li>Email <a href="mailto:support@petzify.co">support@petzify.co</a> as soon as possible.</li>
        <li>Include your order number in the subject line.</li>
        <li>Describe the change or cancellation you need.</li>
        <li>We will confirm whether the request can still be accommodated.</li>
      </ol>

      <h2>Refunds for Approved Cancellations</h2>
      <p>
        If your cancellation is approved before production begins, a <strong>full refund</strong> will be
        issued to your original payment method within <strong>5–10 business days</strong>.
      </p>

      <h2>After Production Has Begun</h2>
      <p>
        Once an item has entered production, we are unable to cancel or modify the order. If the finished
        item arrives damaged or incorrect due to our error, please refer to our{" "}
        <a href="/refund-policy">Refund &amp; Replacement Policy</a>.
      </p>

      <h2>Contact Us</h2>
      <p>
        📧 <a href="mailto:support@petzify.co">support@petzify.co</a> &nbsp;|&nbsp; 📞 (301) 448-0061<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States
      </p>
    </InfoPage>
  );
}
