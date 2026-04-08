import InfoPage from "@/components/InfoPage";
import Link from "next/link";

export const metadata = { title: "Help Center – Petzify" };

const faqs = [
  {
    q: "How do I track my order?",
    a: "Once your order ships, you will receive a tracking number via email. Use it to track your package on the carrier's website.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "You can request modifications within 6 hours and cancellations within 12 hours of placing your order. Contact us immediately at support@petzify.co. After production begins, changes are no longer possible.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Please email us within 7 days of receiving your order with clear photos of the damage. We will send a free replacement or issue a full refund.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders are produced in 3–5 business days. US orders then take 10–17 business days in transit, for a total of 13–22 business days from order to delivery. International orders may take longer. See our Shipping page for full details.",
  },
  {
    q: "Can I return a personalized item?",
    a: "Personalized items cannot be returned unless they arrive damaged, defective, or incorrect. Please double-check all personalization details before ordering. Non-personalized items may be returned within 30 days.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with SSL encryption.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes! We ship to Canada, the UK, Australia, and many other countries. International shipping starts at $4.99. See our Shipping page for estimated delivery times by region.",
  },
  {
    q: "Is shipping free?",
    a: "Yes — we offer free standard shipping on all orders to the United States, with no minimum order required.",
  },
];

export default function HelpPage() {
  return (
    <InfoPage title="Help Center">
      <p>
        Have a question? We&apos;re here to help! Browse the most common questions below, or contact us directly.
      </p>

      <div className="bg-[#F36621] rounded-2xl p-6 text-white mb-8 not-prose">
        <h2 className="text-xl font-bold mb-1 text-white">Need Personal Help?</h2>
        <p className="text-orange-100 text-sm mb-4">Our support team is available Mon–Sat, 9 AM – 5 PM EST.</p>
        <div className="flex flex-col sm:flex-row gap-3 text-sm">
          <a
            href="mailto:support@petzify.co"
            className="bg-white text-[#F36621] font-semibold px-5 py-2.5 rounded-full hover:bg-orange-50 transition-colors text-center"
          >
            📧 Email Support
          </a>
          <a
            href="tel:3014480061"
            className="border border-white text-white font-semibold px-5 py-2.5 rounded-full hover:bg-white hover:text-[#F36621] transition-colors text-center"
          >
            📞 (301) 448-0061
          </a>
        </div>
      </div>

      <h2>Frequently Asked Questions</h2>
      <div className="flex flex-col gap-4 not-prose">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-5 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-2">{faq.q}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <h2>Helpful Links</h2>
      <ul>
        <li><Link href="/shipping">Shipping &amp; Delivery</Link></li>
        <li><Link href="/return-policy">Return Policy</Link></li>
        <li><Link href="/refund-policy">Refund &amp; Replacement Policy</Link></li>
        <li><Link href="/cancellation-policy">Cancellation &amp; Modification Policy</Link></li>
        <li><Link href="/size-chart">Size Chart</Link></li>
      </ul>
    </InfoPage>
  );
}
