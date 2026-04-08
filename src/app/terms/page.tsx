import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Terms of Service – Petzify" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        By accessing or using the Petzify website (petzify.co), you agree to be bound by these Terms of
        Service. Please read them carefully before placing an order or using our services.
      </p>

      <h2>1. Use of Website</h2>
      <p>
        You agree to use our website only for lawful purposes. You must not use it in any way that violates
        any applicable local, national, or international law or regulation, or that causes harm to others.
      </p>

      <h2>2. Orders and Payment</h2>
      <ul>
        <li>All orders are subject to availability and confirmation.</li>
        <li>We reserve the right to cancel any order at our discretion.</li>
        <li>Prices are listed in USD and may change without prior notice.</li>
        <li>Full payment is required before an order is processed and shipped.</li>
        <li>We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and Shop Pay.</li>
      </ul>

      <h2>3. Personalized Products</h2>
      <p>
        Since many of our products are custom-made to order, we are unable to accept returns or exchanges
        for personalized items unless they arrive damaged, defective, or incorrect. Please carefully review
        all personalization details before placing your order.
      </p>

      <h2>4. Shipping & Delivery</h2>
      <p>
        Orders are produced within 3–5 business days, followed by 10–17 business days of transit time
        for US orders. Delivery estimates are not guaranteed and may vary due to carrier delays or customs.
        See our <a href="/shipping">Shipping Policy</a> for full details.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content on this website — including images, text, logos, and graphics — is the property of
        Petzify and is protected by applicable intellectual property laws. You may not reproduce or
        distribute any content without our prior written permission.
      </p>

      <h2>6. Disclaimer of Warranties</h2>
      <p>
        Our website and products are provided &quot;as is&quot; without warranties of any kind, either express or
        implied, including but not limited to warranties of merchantability or fitness for a particular purpose.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Petzify shall not be liable for any indirect, incidental, or consequential damages arising from your
        use of our website or products. Our total liability shall not exceed the amount paid for the relevant order.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        These Terms of Service are governed by the laws of the State of Maryland, United States, without
        regard to its conflict of law provisions.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to update these Terms at any time. Continued use of the site after changes
        are posted constitutes your acceptance of the updated Terms.
      </p>

      <h2>10. Contact</h2>
      <p>
        For questions about these Terms, contact us at:<br />
        📧 <a href="mailto:support@petzify.co">support@petzify.co</a><br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States<br />
        📞 (301) 448-0061
      </p>
    </InfoPage>
  );
}
