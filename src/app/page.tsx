import Link from "next/link";
import Image from "next/image";
import api from "@/lib/woocommerce";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

export const revalidate = 3600;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data } = await api.get("products", {
      per_page: 8,
      status: "publish",
      orderby: "date",
      order: "desc",
    });
    return data;
  } catch {
    return [];
  }
}

const recipients = [
  {
    name: "For Bestie",
    href: "/products?category=for-bestie",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Once-A-Brother_-Always-A-Brother_-No-Matter-The-Distance-Personalized-Leather-Pocket-Hug_1_350214e9-5dcf-4b24-8292-b3bc7706d9d7.jpg?v=1769677112",
    bg: "#fef9ee",
  },
  {
    name: "For Partner",
    href: "/products?category=for-partner",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/I-Fcking-Love-You-_Either-Way-Works_-Thanks-For-All-The-Orgasms-Personalized-Whiskey-Glass_1.jpg?v=1750237832",
    bg: "#fff7ed",
  },
  {
    name: "For Sibling",
    href: "/products?category=for-sibling",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/God-Says-I-Am-Name-Letter-In-Bible-Toile-De-Jouy-Style-Personalized-Jewelry-Dish_1.jpg?v=1753352659",
    bg: "#f0fdf4",
  },
  {
    name: "For Pet Lover",
    href: "/products?category=for-pet-lover",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/A-Girl-_-Her-Dogs-Has-Unbreakable-Bond-Personalized-Mug_1.jpg?v=1762498900",
    bg: "#fff1f2",
  },
  {
    name: "For Family",
    href: "/products?category=for-family",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Check-Ya-Energy-3D-Family-Version-Personalized-Doormat.jpg?v=1769744437",
    bg: "#f5f3ff",
  },
  {
    name: "For Mom",
    href: "/products?category=for-mom",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/First-Mother_S-Day-Hand-Line-Art-Personalized-Night-Light_1.jpg?v=1775274692",
    bg: "#fdf2f8",
  },
  {
    name: "For Dad",
    href: "/products?category=for-dad",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/products/DadTheManTheMythTheLegend-PersonalizedShirt_1.jpg?v=1762485188",
    bg: "#f0f9ff",
  },
  {
    name: "For Kid & Baby",
    href: "/products?category=for-kids",
    img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Preschool_Kindergarten_Graduation_Personalized_Graduation_Stole_1.jpg?v=1770087777",
    bg: "#f7fee7",
  },
];

const productCategories = [
  { name: "Shirts", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/products/DadTheManTheMythTheLegend-PersonalizedShirt_1.jpg?v=1762485188", href: "/products?category=shirts", bg: "bg-orange-50" },
  { name: "Doormats", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Check-Ya-Energy-3D-Family-Version-Personalized-Doormat.jpg?v=1769744437", href: "/products?category=doormats", bg: "bg-amber-50" },
  { name: "Mugs", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/A-Girl-_-Her-Dogs-Has-Unbreakable-Bond-Personalized-Mug_1.jpg?v=1762498900", href: "/products?category=mugs", bg: "bg-rose-50" },
  { name: "Beach Towels", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Custom-Beach-Towel-With-Face-For-Friends_-Family-Personalized-Photo-Beach-Towel_1.png?v=1762494519", href: "/products?category=beach-towels", bg: "bg-blue-50" },
  { name: "Whiskey Glasses", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/I-Fcking-Love-You-_Either-Way-Works_-Thanks-For-All-The-Orgasms-Personalized-Whiskey-Glass_1.jpg?v=1750237832", href: "/products?category=whiskey-glasses", bg: "bg-pink-50" },
  { name: "Jewelry Dishes", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/God-Says-I-Am-Name-Letter-In-Bible-Toile-De-Jouy-Style-Personalized-Jewelry-Dish_1.jpg?v=1753352659", href: "/products?category=jewelry-dishes", bg: "bg-purple-50" },
  { name: "Graduation Stoles", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Preschool_Kindergarten_Graduation_Personalized_Graduation_Stole_1.jpg?v=1770087777", href: "/products?category=graduation-stoles", bg: "bg-yellow-50" },
  { name: "Belts", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/I-Love-Your-Face-Especially-When-It_s-Between-My-Legs-Naughty-Fun-Gifts-For-Him-Personalized-Cowhide-Belt_1.jpg?v=1766820169", href: "/products?category=belts", bg: "bg-green-50" },
  { name: "Pocket Hugs", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Once-A-Brother_-Always-A-Brother_-No-Matter-The-Distance-Personalized-Leather-Pocket-Hug_1_350214e9-5dcf-4b24-8292-b3bc7706d9d7.jpg?v=1769677112", href: "/products?category=pocket-hugs", bg: "bg-teal-50" },
  { name: "Night Lights", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/First-Mother_S-Day-Hand-Line-Art-Personalized-Night-Light_1.jpg?v=1775274692", href: "/products?category=night-lights", bg: "bg-indigo-50" },
  { name: "Cutting Boards", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Custom_Birth_Flower_Name_For_Her_Daughter_Wife_Mom_Grandma_Printed_Effect_Personalized_Cutting_Board_1.jpg?v=1774435179", href: "/products?category=cutting-boards", bg: "bg-lime-50" },
  { name: "Garden Stakes", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Pet_Lover_Gift_Dog_Garden_Metal_Stake_Personalized_Garden_Stake_1.jpg?v=1775562618", href: "/products?category=garden-stakes", bg: "bg-emerald-50" },
  { name: "Tassel Charms", img: "https://cdn.shopify.com/s/files/1/0626/0421/4428/files/Graduation-Walking-Beside-You-Every-Step-Custom-Graduation-Tassel-Photo-Charm_1.jpg", href: "/products?category=tassel-charms", bg: "bg-cyan-50" },
];

const trustBadges = [
  { icon: "🎨", title: "100% Personalized", desc: "Every item made just for you" },
  { icon: "🚚", title: "Free US Shipping", desc: "On all orders to the United States" },
  { icon: "🔒", title: "Secure Checkout", desc: "Your data is always protected" },
  { icon: "⭐", title: "Satisfaction Guaranteed", desc: "Love it or we make it right" },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Texas, US",
    rating: 5,
    text: "Ordered a personalized Hawaiian shirt for my dad's birthday. The quality was amazing and it arrived right on time. He absolutely loved it!",
  },
  {
    name: "James T.",
    location: "California, US",
    rating: 5,
    text: "Great product, fast shipping, and the personalization was exactly what I asked for. Will definitely order again for the holidays!",
  },
  {
    name: "Linda K.",
    location: "New York, US",
    rating: 5,
    text: "The print quality is top-notch. Bought this as a gift and my whole family was impressed. Very happy with my purchase.",
  },
];

const occasions = [
  { name: "Birthday", emoji: "🎂", href: "/products?category=occasion-birthday" },
  { name: "Father's Day", emoji: "👨‍👧", href: "/products?category=for-dad" },
  { name: "Mother's Day", emoji: "💐", href: "/products?category=for-mom" },
  { name: "Christmas", emoji: "🎄", href: "/products?category=occasion-christmas" },
  { name: "Graduation", emoji: "🎓", href: "/products?category=graduation-stoles" },
  { name: "Anniversary", emoji: "💍", href: "/products?category=for-partner" },
];

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[#F36621] font-semibold text-sm uppercase tracking-widest mb-3">
            Personalized Gifts & Home Decor
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-5 leading-tight">
            Make Every Gift <br />
            <span className="text-[#F36621]">Uniquely Theirs</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Thoughtfully designed, custom-made products for the people who matter most.
            Perfect for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-block bg-[#F36621] hover:bg-[#d4551a] text-white font-bold px-8 py-4 rounded-full text-base transition-colors shadow-lg"
            >
              Shop All Products
            </Link>
            <Link
              href="/help"
              className="inline-block border-2 border-[#F36621] text-[#F36621] hover:bg-orange-50 font-bold px-8 py-4 rounded-full text-base transition-colors"
            >
              Need Help?
            </Link>
          </div>
          {/* Social proof micro-bar */}
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span><strong className="text-gray-700">4.9/5</strong> from over 2,000 happy customers</span>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="bg-white border-y border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex flex-col items-center text-center gap-2 px-2">
              <span className="text-3xl">{b.icon}</span>
              <p className="font-semibold text-gray-800 text-sm">{b.title}</p>
              <p className="text-gray-400 text-xs">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY OCCASION ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8">Shop By Occasion</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {occasions.map((o) => (
            <Link
              key={o.name}
              href={o.href}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 hover:border-[#F36621] border border-transparent transition-all text-center group"
            >
              <span className="text-3xl">{o.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-[#F36621] transition-colors">{o.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SHOP BY RECIPIENT ── */}
      <section className="bg-[#fffbf5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F36621] text-center mb-10">Shop By Recipient</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {recipients.map((r) => (
              <Link
                key={r.name}
                href={r.href}
                className="group flex flex-col items-center text-center gap-3"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                  <Image
                    src={r.img}
                    alt={r.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm md:text-base font-semibold text-gray-700 group-hover:text-[#F36621] transition-colors text-center">
                  {r.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE CATEGORIES ── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F36621] text-center mb-10">Shop By Product</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {productCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center text-center gap-3"
              >
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p className="font-semibold text-gray-800 group-hover:text-[#F36621] transition-colors text-sm md:text-base">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#F36621] font-semibold text-sm uppercase tracking-wide mb-1">Fresh In</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">New Arrivals</h2>
          </div>
          <Link href="/products" className="text-[#F36621] font-semibold hover:underline text-sm">
            View All →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-lg font-medium">No products yet</p>
            <p className="text-sm mt-1">Add products in your WooCommerce dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="bg-[#0d1b2e] py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Thousands Choose Petzify</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            We combine premium print quality with heartfelt personalization to create gifts people truly remember.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { icon: "🖨️", title: "Premium Print Quality", desc: "Vibrant, fade-resistant prints that look great wash after wash." },
              { icon: "✍️", title: "Easy Personalization", desc: "Add names, photos, and messages with our simple ordering process." },
              { icon: "📦", title: "Careful Packaging", desc: "Every order is packed securely and ships with tracking included." },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-3xl block mb-3">{item.icon}</span>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-10">
          <p className="text-[#F36621] font-semibold text-sm uppercase tracking-wide mb-1">Reviews</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">What Our Customers Say</h2>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-500">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span>Rated 4.9 out of 5 — 2,000+ reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#F36621] font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
                <span className="ml-auto text-xs text-green-600 font-medium">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-gradient-to-r from-[#F36621] to-[#F7921F] py-16 px-4 text-white text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-3">Find the Perfect Personalized Gift</h2>
        <p className="text-orange-100 mb-8 max-w-xl mx-auto text-sm md:text-base">
          Browse our full collection of customized products. Something for everyone, for every occasion.
        </p>
        <Link
          href="/products"
          className="inline-block bg-white text-[#F36621] font-bold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors text-base shadow-lg"
        >
          Shop All Products
        </Link>
      </section>
    </div>
  );
}
