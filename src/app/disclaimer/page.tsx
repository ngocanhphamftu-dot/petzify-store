import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Disclaimer – Petzify" };

export default function DisclaimerPage() {
  return (
    <InfoPage title="Disclaimer">
      <p className="text-sm text-gray-400">Last updated: April 2026</p>

      <h2>Disclaimer Regarding Fake Websites</h2>
      <p>
        We have become aware that fraudulent websites are impersonating <strong>Petzify</strong> and
        using our brand name, images, and product listings to deceive customers.
      </p>

      <h2>Our Official Website</h2>
      <p>
        The <strong>only</strong> official Petzify website is:
      </p>
      <p className="text-[#F36621] font-bold text-lg not-prose my-3">🌐 petzify.co</p>
      <p>
        Any other website claiming to be Petzify is fraudulent and not affiliated with us in any way.
      </p>

      <h2>How to Identify Fake Sites</h2>
      <ul>
        <li>Different domain name (e.g., petzify-shop.com, petzify.store, petzify.net)</li>
        <li>Prices that seem too good to be true</li>
        <li>No working customer support contact</li>
        <li>No secure HTTPS connection</li>
        <li>Poor grammar and spelling throughout the site</li>
        <li>No physical address or verifiable contact information</li>
      </ul>

      <h2>What to Do If You&apos;ve Been Scammed</h2>
      <ul>
        <li>Contact your bank or payment provider immediately to dispute the charge.</li>
        <li>Report the fake website to Google Safe Browsing or your browser&apos;s fraud report tool.</li>
        <li>File a complaint with the FTC at reportfraud.ftc.gov.</li>
        <li>Contact us so we can document and report the fraudulent site.</li>
      </ul>

      <h2>General Disclaimer</h2>
      <p>
        The information on this website is provided for general informational purposes only. While we
        strive to keep product information accurate and up to date, we make no warranties of any kind
        regarding the completeness or accuracy of the content.
      </p>
      <p>
        Product colors may vary slightly from what is displayed on screen due to monitor settings and
        printing variations.
      </p>

      <h2>Contact the Real Petzify</h2>
      <p>
        If you are unsure whether you are on the official Petzify website, verify the URL is{" "}
        <strong>petzify.co</strong> and contact us directly:
      </p>
      <ul>
        <li>📧 <a href="mailto:support@petzify.co">support@petzify.co</a></li>
        <li>📞 (301) 448-0061</li>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
      </ul>
    </InfoPage>
  );
}
