import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Privacy Policy – Petzify" };

export default function PrivacyPolicyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>

      <p>
        At <strong>Petzify</strong> (petzify.co), we are committed to protecting your personal information
        and your right to privacy. This Privacy Policy explains how we collect, use, and share information
        about you when you use our website and services.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">1. Information We Collect</h2>
      <p>We collect information you provide directly, including:</p>
      <ul>
        <li>Name, email address, phone number, and shipping address when placing an order</li>
        <li>Payment information (processed securely by third-party payment providers)</li>
        <li>Messages you send us via email or support forms</li>
      </ul>
      <p>We also automatically collect certain information when you visit our site, including:</p>
      <ul>
        <li>IP address, browser type, and device information</li>
        <li>Pages visited, time spent, and referring URLs</li>
        <li>Cookies and similar tracking technologies</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">2. How We Use Your Information</h2>
      <ul>
        <li>To process and fulfill your orders</li>
        <li>To communicate with you about your order status</li>
        <li>To send promotional emails (you may opt out at any time)</li>
        <li>To improve our website and customer experience</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">3. Sharing Your Information</h2>
      <p>
        We do not sell your personal information. We may share it with trusted third parties such as
        shipping carriers, payment processors, and analytics providers, solely to operate our business
        and serve you.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">4. Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience, remember your cart, and analyze site traffic.
        You can disable cookies in your browser settings, though some features may not function properly.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">5. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction or deletion of your data</li>
        <li>Opt out of marketing communications at any time</li>
      </ul>
      <p>
        <strong>California Residents (CCPA):</strong> If you are a California resident, you have the right to
        know what personal information we collect, request deletion, and opt out of the sale of personal
        information. We do not sell your personal information. To exercise your rights, contact us at
        support@petzify.co.
      </p>
      <p>
        <strong>EEA/UK Residents (GDPR):</strong> If you are located in the European Economic Area or the
        United Kingdom, you have additional rights including the right to data portability and to lodge a
        complaint with your local supervisory authority. Our legal basis for processing your data is the
        performance of a contract (fulfilling your order) and legitimate interests.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">6. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill your orders, comply with
        legal obligations, and resolve disputes. Order records are typically kept for 7 years for accounting
        purposes.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">7. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at:<br />
        📧 support@petzify.co<br />
        📍 5716 Rio Vista Dr, Derwood, MD 20855, United States<br />
        📞 (301) 448-0061
      </p>
    </InfoPage>
  );
}
