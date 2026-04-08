import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Terms of Services – Petzify" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Services">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        By accessing or using the Petzify website (petzify.co), you agree to be bound by these Terms of
        Services. Please read them carefully before placing an order or using our services.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">1. Use of Website</h2>
      <p>
        You agree to use our website only for lawful purposes. You must not use it in any way that violates
        any applicable local, national, or international law or regulation.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">2. Orders and Payment</h2>
      <ul>
        <li>All orders are subject to availability and confirmation.</li>
        <li>We reserve the right to cancel any order at our discretion.</li>
        <li>Prices are listed in USD and are subject to change without notice.</li>
        <li>Payment must be completed before an order is processed and shipped.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">3. Personalized Products</h2>
      <p>
        Since many of our products are custom-made to order, we are unable to accept returns or exchanges
        for personalized items unless they arrive damaged or defective. Please review your customization
        details carefully before placing an order.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">4. Intellectual Property</h2>
      <p>
        All content on this website, including images, text, logos, and graphics, is the property of
        Petzify and is protected by applicable intellectual property laws. You may not reproduce or
        distribute any content without our written permission.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">5. Limitation of Liability</h2>
      <p>
        Petzify shall not be liable for any indirect, incidental, or consequential damages arising from
        your use of our website or products. Our total liability shall not exceed the amount paid for
        the relevant order.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">6. Changes to Terms</h2>
      <p>
        We reserve the right to update these Terms at any time. Continued use of the site after changes
        are posted constitutes your acceptance of the new Terms.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">7. Contact</h2>
      <p>
        For questions about these Terms, contact us at:<br />
        📧 support@petzify.co<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States<br />
        📞 (301) 448-0061
      </p>
    </InfoPage>
  );
}
