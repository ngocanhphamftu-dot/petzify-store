import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Accessibility Statement – Petzify" };

export default function AccessibilityPage() {
  return (
    <InfoPage title="Accessibility Statement">
      <p>
        Petzify is committed to ensuring digital accessibility for people with disabilities. We are
        continually improving the user experience for everyone and applying relevant accessibility standards.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Our Efforts</h2>
      <ul>
        <li>We strive to meet WCAG 2.1 Level AA guidelines.</li>
        <li>All images include descriptive alt text.</li>
        <li>Our website is navigable using keyboard and screen readers.</li>
        <li>We use sufficient color contrast throughout the site.</li>
        <li>Interactive elements have clear focus indicators.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">Known Limitations</h2>
      <p>
        While we strive for full accessibility, some areas of our website may not yet fully meet all
        accessibility guidelines. We are actively working to address these issues.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Feedback & Contact</h2>
      <p>
        If you experience any accessibility barriers or have suggestions for improvement, please contact us:
      </p>
      <ul>
        <li>📧 support@petzify.co</li>
        <li>📞 (301) 448-0061</li>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
      </ul>
      <p>We aim to respond to accessibility feedback within 2 business days.</p>
    </InfoPage>
  );
}
