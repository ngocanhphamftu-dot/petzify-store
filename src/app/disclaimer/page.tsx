import InfoPage from "@/components/InfoPage";

export const metadata = { title: "Disclaimer Regarding Fake Websites – Petzify" };

export default function DisclaimerPage() {
  return (
    <InfoPage title="Disclaimer Regarding Fake Websites">
      <p>
        We have become aware that fraudulent websites are impersonating <strong>Petzify</strong> and
        using our brand name, images, and product listings to deceive customers.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Our Official Website</h2>
      <p>
        The <strong>only</strong> official Petzify website is:
      </p>
      <p className="text-[#F36621] font-bold text-lg">🌐 petzify.co</p>
      <p>
        Any other website claiming to be Petzify is fraudulent and not affiliated with us in any way.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">How to Identify Fake Sites</h2>
      <ul>
        <li>Different domain name (e.g., petzify-shop.com, petzify.store, petzify.net)</li>
        <li>Prices that seem too good to be true</li>
        <li>No working customer support contact</li>
        <li>No secure checkout (no HTTPS)</li>
        <li>Poor grammar and spelling throughout the site</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">What to Do If You've Been Scammed</h2>
      <ul>
        <li>Contact your bank or payment provider immediately to dispute the charge.</li>
        <li>Report the fake website to Google, your browser, or your local consumer protection agency.</li>
        <li>Contact us so we can document and report the fraudulent site.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">Contact the Real Petzify</h2>
      <p>
        If you are unsure whether you are shopping on the real Petzify website, please verify the URL
        and contact us directly:
      </p>
      <ul>
        <li>📧 support@petzify.co</li>
        <li>📞 (301) 448-0061</li>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
      </ul>
    </InfoPage>
  );
}
