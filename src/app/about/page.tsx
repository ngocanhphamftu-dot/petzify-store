import InfoPage from "@/components/InfoPage";

export const metadata = { title: "About Us – Petzify" };

export default function AboutPage() {
  return (
    <InfoPage title="About Us">
      <h2 className="text-xl font-semibold text-gray-800 mt-0">Our Story</h2>
      <p>
        Welcome to <strong>Petzify</strong> — where personalization meets passion. We are a small team of
        creative minds dedicated to bringing meaningful, customized products to people who want to celebrate
        life's special moments in a truly unique way.
      </p>
      <p>
        Founded with the belief that every gift should tell a story, Petzify was born from a love of
        pets, family, and the joy that comes from giving something truly personal. Whether it's a Hawaiian
        shirt featuring your grandpa's grandkids, or a custom home decor piece that captures a cherished
        memory — we pour our hearts into every product we create.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Our Mission</h2>
      <p>
        Our mission is simple: <em>to make every occasion unforgettable</em>. We believe that a
        personalized gift is more than just a product — it's a message of love, appreciation, and
        connection. That's why we work hard to ensure that every item we sell is crafted with care
        and delivered with a smile.
      </p>

      <h2 className="text-xl font-semibold text-gray-800">Our Values</h2>
      <ul>
        <li><strong>Quality:</strong> We source and create only the best products for our customers.</li>
        <li><strong>Personalization:</strong> Every product can be made uniquely yours.</li>
        <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
        <li><strong>Fast Shipping:</strong> We work hard to get your order to you as quickly as possible.</li>
      </ul>

      <h2 className="text-xl font-semibold text-gray-800">Contact Us</h2>
      <p>We'd love to hear from you! Reach us at:</p>
      <ul>
        <li>📍 5716 Rio Vista Dr, Derwood, MD 20855, United States</li>
        <li>📞 (301) 448-0061</li>
        <li>📧 support@petzify.co</li>
        <li>🕒 Support Hours: 9 AM – 5 PM, Monday to Saturday</li>
      </ul>
    </InfoPage>
  );
}
