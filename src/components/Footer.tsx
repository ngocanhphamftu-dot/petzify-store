"use client";

import Link from "next/link";
import { useState } from "react";

const shopAccordions = [
  {
    title: "Shop By Product",
    links: [
      { label: "Shirts", href: "/products?category=shirts" },
      { label: "Doormats", href: "/products?category=doormats" },
      { label: "Mugs", href: "/products?category=mugs" },
      { label: "Beach Towels", href: "/products?category=beach-towels" },
      { label: "Whiskey Glasses", href: "/products?category=whiskey-glasses" },
      { label: "Jewelry Dishes", href: "/products?category=jewelry-dishes" },
      { label: "Night Lights", href: "/products?category=night-lights" },
      { label: "Cutting Boards", href: "/products?category=cutting-boards" },
      { label: "Garden Stakes", href: "/products?category=garden-stakes" },
      { label: "Pocket Hugs", href: "/products?category=pocket-hugs" },
      { label: "Tassel Charms", href: "/products?category=tassel-charms" },
      { label: "Graduation Stoles", href: "/products?category=graduation-stoles" },
      { label: "Belts", href: "/products?category=belts" },
    ],
  },
  {
    title: "Shop By Occasion",
    links: [
      { label: "Graduation", href: "/products?category=graduation-stoles" },
      { label: "For Pet Lovers", href: "/products?category=for-pet-lover" },
    ],
  },
  {
    title: "Shop By Recipient",
    links: [
      { label: "For Mom", href: "/products?category=for-mom" },
      { label: "For Dad", href: "/products?category=for-dad" },
      { label: "For Bestie", href: "/products?category=for-bestie" },
      { label: "For Partner", href: "/products?category=for-partner" },
      { label: "For Sibling", href: "/products?category=for-sibling" },
      { label: "For Family", href: "/products?category=for-family" },
      { label: "For Kids", href: "/products?category=for-kids" },
      { label: "For Pet Lover", href: "/products?category=for-pet-lover" },
    ],
  },
];

function Accordion({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left text-white font-medium text-sm"
      >
        {title}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="pb-3 space-y-2">
          {links.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-gray-400 text-sm hover:text-[#F36621] transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const PaymentIcons = () => (
  <div className="flex flex-wrap justify-center gap-2">
    {/* Visa */}
    <div className="bg-white rounded px-2 py-1 flex items-center h-8 w-14 justify-center">
      <svg viewBox="0 0 48 16" className="h-4"><text x="0" y="13" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#1A1F71">VISA</text></svg>
    </div>
    {/* Mastercard */}
    <div className="bg-white rounded px-1 py-1 flex items-center h-8 w-14 justify-center">
      <svg viewBox="0 0 38 24" className="h-6">
        <circle cx="14" cy="12" r="10" fill="#EB001B"/>
        <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
        <path d="M19 5.3a10 10 0 010 13.4A10 10 0 0119 5.3z" fill="#FF5F00"/>
      </svg>
    </div>
    {/* PayPal */}
    <div className="bg-white rounded px-2 py-1 flex items-center h-8 w-16 justify-center">
      <svg viewBox="0 0 60 20" className="h-4">
        <text x="0" y="14" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#003087">Pay</text>
        <text x="24" y="14" fontFamily="Arial" fontWeight="bold" fontSize="13" fill="#009CDE">Pal</text>
      </svg>
    </div>
    {/* Apple Pay */}
    <div className="bg-white rounded px-2 py-1 flex items-center h-8 w-16 justify-center">
      <svg viewBox="0 0 60 20" className="h-4">
        <text x="0" y="14" fontFamily="-apple-system,sans-serif" fontSize="12" fill="#000"> Pay</text>
      </svg>
    </div>
    {/* Google Pay */}
    <div className="bg-white rounded px-2 py-1 flex items-center h-8 w-16 justify-center">
      <svg viewBox="0 0 64 20" className="h-4">
        <text x="0" y="14" fontFamily="Arial" fontSize="11" fontWeight="500">
          <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC04">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
        </text>
        <text x="38" y="14" fontFamily="Arial" fontSize="11" fontWeight="500" fill="#000"> Pay</text>
      </svg>
    </div>
    {/* Amex */}
    <div className="bg-[#2E77BC] rounded px-2 py-1 flex items-center h-8 w-14 justify-center">
      <svg viewBox="0 0 50 16" className="h-3.5"><text x="0" y="12" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white">AMEX</text></svg>
    </div>
    {/* Discover */}
    <div className="bg-white rounded px-2 py-1 flex items-center h-8 w-18 justify-center gap-1">
      <svg viewBox="0 0 70 16" className="h-4">
        <text x="0" y="12" fontFamily="Arial" fontSize="10" fontWeight="bold" fill="#231F20">DISCOVER</text>
      </svg>
      <div className="w-4 h-4 rounded-full bg-[#F76F20] flex-shrink-0" />
    </div>
    {/* Amazon Pay */}
    <div className="bg-[#FFD814] rounded px-2 py-1 flex items-center h-8 w-20 justify-center">
      <svg viewBox="0 0 72 16" className="h-4"><text x="0" y="12" fontFamily="Arial" fontWeight="bold" fontSize="10" fill="#131921">amazon</text><text x="44" y="12" fontFamily="Arial" fontSize="9" fill="#131921">pay</text></svg>
    </div>
    {/* Shop Pay */}
    <div className="bg-[#5A31F4] rounded px-2 py-1 flex items-center h-8 w-16 justify-center">
      <svg viewBox="0 0 58 16" className="h-4"><text x="0" y="12" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="white">Shop Pay</text></svg>
    </div>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2e] text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Col 1: Shop accordions */}
          <div>
            <Link href="/products" className="block text-white font-bold text-lg mb-4 hover:text-[#F36621] transition-colors">
              Gift Finder
            </Link>
            {shopAccordions.map((a) => (
              <Accordion key={a.title} title={a.title} links={a.links} />
            ))}
          </div>

          {/* Col 2: Petzify */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[#F36621] flex items-center justify-center flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="5.5" cy="8.5" rx="2" ry="2.8" />
                  <ellipse cx="10" cy="6" rx="2" ry="2.8" />
                  <ellipse cx="14" cy="6" rx="2" ry="2.8" />
                  <ellipse cx="18.5" cy="8.5" rx="2" ry="2.8" />
                  <path d="M12 10c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3.5 3 4 1 .3 2 .5 3.5.5s2.5-.2 3.5-.5c1.5-.5 3-2 3-4C18.5 12.5 15.5 10 12 10z" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">Petz<span className="text-[#F36621]">ify</span></span>
            </div>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-[#F36621] transition-colors">About Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#F36621] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/accessibility" className="hover:text-[#F36621] transition-colors">Accessibility Statement</Link></li>
              <li><Link href="/terms" className="hover:text-[#F36621] transition-colors">Terms of Services</Link></li>
            </ul>
          </div>

          {/* Col 3: Help and Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Help and Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/return-policy" className="hover:text-[#F36621] transition-colors">Return Policy</Link></li>
              <li><Link href="/help" className="hover:text-[#F36621] transition-colors">Help Center</Link></li>
              <li><Link href="/size-chart" className="hover:text-[#F36621] transition-colors">Size Chart</Link></li>
              <li><Link href="/shipping" className="hover:text-[#F36621] transition-colors">Shipping And Delivery</Link></li>
              <li><Link href="/cancellation-policy" className="hover:text-[#F36621] transition-colors">Cancellation &amp; Modification Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-[#F36621] transition-colors">Refund &amp; Replacement Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-[#F36621] transition-colors">Disclaimer Regarding Fake Websites</Link></li>
            </ul>
          </div>

          {/* Col 4: Get In Touch */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">GET IN TOUCH</h3>
            <p className="text-sm mb-1">Support Time: 9 AM to 5 PM, Mon–Sat</p>
            <p className="text-sm mb-1">📞 (301) 448-0061</p>
            <p className="text-sm mb-4">📍 5716 Rio Vista Dr, Derwood, MD 20855, US</p>
            <Link
              href="/help"
              className="inline-block bg-[#F36621] hover:bg-[#d4551a] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors mb-6"
            >
              Open A Support Ticket
            </Link>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-2">
              <a href="#" aria-label="Facebook" className="hover:text-[#F36621] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-[#F36621] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path fill="#0d1b2e" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#0d1b2e" strokeWidth="2"/></svg>
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-[#F36621] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/></svg>
              </a>
              <a href="#" aria-label="Pinterest" className="hover:text-[#F36621] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Payment icons */}
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="mb-4">
            <PaymentIcons />
          </div>
          <div className="text-center text-xs text-gray-500 flex flex-wrap justify-center gap-3">
            <Link href="/terms" className="hover:text-[#F36621] transition-colors">Terms Of Services</Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-[#F36621] transition-colors">Privacy Policy</Link>
            <span>•</span>
            <span>© {new Date().getFullYear()} Petzify. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
