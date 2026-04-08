import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Cancellation & Modification Policy – Petzify" };

export default function CancellationPolicyPage() {
  return (
    <InfoPage title="Cancellation & Modification Policy">
      <p>
        We begin processing orders quickly to ensure fast delivery. Please review our cancellation
        and modification policy below.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Cancellation Window</h2>
      <p>
        You may cancel your order within <strong>12 hours</strong> of placing it, as long as it has not yet
        entered production. After this window, cancellations are generally not possible for
        personalized items.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">How to Cancel</h2>
      <ol>
        <li>Email us at <strong>support@petzify.co</strong> as soon as possible.</li>
        <li>Include your order number in the subject line.</li>
        <li>We will confirm whether cancellation is still possible.</li>
      </ol>

      <h2 className="text-xl font-semibold text-gray-800">Order Modifications</h2>
      <p>
        If you need to change personalization details (name, text, size, etc.), contact us within
        <strong> 6 hours</strong> of placing your order. After that, changes may not be possible once
        production has started.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">After Production Begins</h2>
      <p>
        Once an item enters production, we are unable to cancel or modify the order. If the item
        arrives damaged or incorrect due to our error, please refer to our
        <strong> Refund &amp; Replacement Policy</strong>.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Contact</h2>
      <p>📧 support@petzify.co &nbsp;|&nbsp; 📞 (301) 448-0061</p>
    </InfoPage>
  );
}
