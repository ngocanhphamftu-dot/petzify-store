import InfoPage from "@/components/InfoPage";

export const metadata = { title: "About Us – Petzify" };

export default function AboutPage() {
  return (
    <InfoPage title="About Us">
      <h2>Our Story</h2>
      <p>
        Welcome to <strong>Petzify</strong> — where personalization meets passion. We are a small team of
        creative minds dedicated to bringing meaningful, customized products to people who want to celebrate
        life&apos;s special moments in a truly unique way.
      </p>
      <p>
        Founded with the belief that every gift should tell a story, Petzify was born from a love of
        pets, family, and the joy that comes from giving something truly personal. Whether it&apos;s a custom
        shirt featuring your family, a personalized doormat for your home, or a one-of-a-kind mug —
        we pour our hearts into every product we create.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is simple: <em>to make every occasion unforgettable</em>. We believe that a
        personalized gift is more than just a product — it&apos;s a message of love, appreciation, and
        connection. That&apos;s why we work hard to ensure every item is crafted with care and delivered
        with a smile.
      </p>

      <h2>What We Offer</h2>
      <ul>
        <li>Personalized shirts, Hawaiian shirts &amp; apparel</li>
        <li>Custom home decor — doormats, mugs, cutting boards, night lights</li>
        <li>Unique gift items — pocket hugs, whiskey glasses, jewelry dishes</li>
        <li>Graduation stoles, garden stakes, beach towels &amp; more</li>
      </ul>

      <h2>Our Values</h2>
      <ul>
        <li><strong>Quality First:</strong> We source and create only the best products for our customers.</li>
        <li><strong>True Personalization:</strong> Every product is made uniquely for you.</li>
        <li><strong>Customer Satisfaction:</strong> Your happiness is our top priority — we stand behind every order.</li>
        <li><strong>Transparency:</strong> Clear pricing, clear policies, and honest communication.</li>
      </ul>

      <h2>Contact Us</h2>
      <p>We&apos;d love to hear from you!</p>
      <ul>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
        <li>📞 (301) 448-0061</li>
        <li>📧 <a href="mailto:support@petzify.co">support@petzify.co</a></li>
        <li>🕒 Support Hours: Monday – Saturday, 9 AM – 5 PM (EST)</li>
      </ul>
    </InfoPage>
  );
}
