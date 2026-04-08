"use client";

import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

const categoryNav = [
  { label: "Gifts", href: "/products" },
  { label: "Home & Living", href: "/products?category=home-living" },
  { label: "Apparel", href: "/products?category=shirts" },
  { label: "Drink & Barware", href: "/products?category=whiskey-glasses" },
  { label: "Accessories", href: "/products?category=accessories" },
  { label: "Pet Lovers", href: "/products?category=for-pet-lover" },
  { label: "Graduation", href: "/products?category=graduation-stoles" },
  { label: "New Arrivals", href: "/products?orderby=date" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openDrawer = useCartStore((s) => s.openDrawer);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* ── Row 1: Logo + Search + Actions ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 select-none flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#F36621] flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="5.5" cy="8.5" rx="2" ry="2.8" />
                <ellipse cx="10" cy="6" rx="2" ry="2.8" />
                <ellipse cx="14" cy="6" rx="2" ry="2.8" />
                <ellipse cx="18.5" cy="8.5" rx="2" ry="2.8" />
                <path d="M12 10c-3.5 0-6.5 2.5-6.5 5.5 0 2 1.5 3.5 3 4 1 .3 2 .5 3.5.5s2.5-.2 3.5-.5c1.5-.5 3-2 3-4C18.5 12.5 15.5 10 12 10z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">Petz<span className="text-[#F36621]">ify</span></span>
          </Link>

          {/* Search bar — hidden on mobile */}
          <form
            className="hidden md:flex flex-1 max-w-xl mx-4 items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 focus-within:border-[#F36621] transition-colors"
            onSubmit={(e) => { e.preventDefault(); if (search.trim()) window.location.href = `/products?search=${encodeURIComponent(search.trim())}`; }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search personalized gifts..."
              className="flex-1 px-4 py-2.5 bg-transparent text-sm text-gray-700 outline-none placeholder-gray-400"
            />
            <button type="submit" className="w-10 h-10 flex items-center justify-center bg-[#F36621] hover:bg-[#d4551a] transition-colors flex-shrink-0 rounded-full m-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
            {/* Track Order — desktop only */}
            <Link href="/help" className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#F36621] transition-colors font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Track Order
            </Link>

            {/* Cart */}
            <button onClick={openDrawer} className="relative p-2 text-gray-700 hover:text-[#F36621] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F36621] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Row 2: Category Nav (desktop) ── */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-6 h-10 overflow-x-auto scrollbar-none">
            {categoryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#F36621] transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-[#F36621]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-1">
          {/* Mobile search */}
          <form
            className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 mb-3"
            onSubmit={(e) => { e.preventDefault(); if (search.trim()) { window.location.href = `/products?search=${encodeURIComponent(search.trim())}`; setMenuOpen(false); } }}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-4 py-2 bg-transparent text-sm outline-none placeholder-gray-400"
            />
            <button type="submit" className="w-9 h-9 flex items-center justify-center bg-[#F36621] rounded-full m-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          </form>
          {categoryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-700 font-medium py-2 border-b border-gray-50 hover:text-[#F36621] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/help" className="text-gray-700 font-medium py-2 hover:text-[#F36621] transition-colors" onClick={() => setMenuOpen(false)}>
            Track Order
          </Link>
        </div>
      )}
    </header>
  );
}
