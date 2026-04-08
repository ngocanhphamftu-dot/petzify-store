import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Accessibility Statement – Petzify" };

export default function AccessibilityPage() {
  return (
    <InfoPage title="Accessibility Statement">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>
      <p>
        Petzify is committed to ensuring digital accessibility for people with disabilities. We are
        continually improving the user experience for everyone and applying relevant accessibility standards.
      </p>

      <h2>Our Commitment</h2>
      <p>
        We aim to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>.
        These guidelines explain how to make web content more accessible to people with disabilities.
      </p>

      <h2>Accessibility Features</h2>
      <ul>
        <li>All images include descriptive alt text</li>
        <li>The website is navigable using keyboard and screen readers</li>
        <li>Sufficient color contrast is maintained throughout the site</li>
        <li>Interactive elements have clear focus indicators</li>
        <li>Text can be resized without loss of content or functionality</li>
        <li>Forms include labels and error messages</li>
      </ul>

      <h2>Known Limitations</h2>
      <p>
        While we strive for full accessibility, some areas of our website may not yet fully meet all
        guidelines. We are actively working to identify and address these gaps on an ongoing basis.
      </p>

      <h2>Third-Party Content</h2>
      <p>
        Some content on our site is provided by third-party services (such as payment processors and
        shipping tools). We cannot guarantee the accessibility of third-party pages, but we encourage
        our partners to meet accessibility standards as well.
      </p>

      <h2>Feedback &amp; Contact</h2>
      <p>
        If you experience any accessibility barriers or have suggestions for improvement, we want to hear
        from you. Please contact us and we will do our best to respond within <strong>2 business days</strong>:
      </p>
      <ul>
        <li>📧 <a href="mailto:support@petzify.co">support@petzify.co</a></li>
        <li>📞 (301) 448-0061</li>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
      </ul>
    </InfoPage>
  );
}
