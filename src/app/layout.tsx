import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { BASE_URL } from "@/lib/constants";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Petzify - Personalized Home Decor & Gifts",
    template: "%s | Petzify",
  },
  description:
    "Shop personalized home decor, gifts, and apparel for every occasion. Custom mugs, doormats, shirts, jewelry dishes & more — made just for you.",
  keywords: [
    "personalized gifts", "custom home decor", "personalized mugs",
    "custom shirts", "personalized doormats", "custom gifts for her",
    "custom gifts for him", "pet lover gifts", "graduation gifts",
  ],
  authors: [{ name: "Petzify", url: BASE_URL }],
  creator: "Petzify",
  publisher: "Petzify",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Petzify",
    title: "Petzify - Personalized Home Decor & Gifts",
    description:
      "Shop personalized home decor, gifts, and apparel. Custom mugs, doormats, shirts & more — made just for you.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Petzify - Personalized Gifts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Petzify - Personalized Home Decor & Gifts",
    description: "Shop personalized gifts & home decor — made just for you.",
    images: ["/og-image.jpg"],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Petzify",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "Personalized home decor and gifts for every occasion",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5716 Rio Vista Dr",
    addressLocality: "Derwood",
    addressRegion: "MD",
    postalCode: "20855",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-301-448-0061",
    contactType: "customer service",
    availableLanguage: "English",
    hoursAvailable: "Mo-Sa 09:00-17:00",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Petzify",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/products?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-poppins)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
