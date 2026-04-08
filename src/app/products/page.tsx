import api from "@/lib/woocommerce";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import Link from "next/link";

export const revalidate = 3600; // Re-fetch from WooCommerce every 1 hour

// Map slug → WooCommerce category ID
const categoryMap: Record<string, number> = {
  // Product categories
  "shirts": 16,
  "doormats": 17,
  "mugs": 18,
  "beach-towels": 19,
  "whiskey-glasses": 20,
  "jewelry-dishes": 21,
  "graduation-stoles": 22,
  "belts": 23,
  "pocket-hugs": 24,
  "night-lights": 25,
  "cutting-boards": 26,
  "garden-stakes": 27,
  // Recipient categories
  "for-bestie": 28,
  "for-partner": 29,
  "for-sibling": 30,
  "for-pet-lover": 31,
  "for-family": 32,
  "for-mom": 33,
  "for-dad": 34,
  "for-kids": 35,
  "tassel-charms": 36,
  // Navbar aliases — multi-category groups represented by primary category
  "home-living": 17,     // doormats, mugs, night-lights, cutting-boards → primary: doormats
  "accessories": 21,     // jewelry-dishes, belts, tassel-charms → primary: jewelry-dishes
  // Occasion aliases mapped to recipient/product categories
  "occasion-fathers-day": 34,   // for-dad
  "occasion-mothers-day": 33,   // for-mom
  "occasion-graduation": 22,    // graduation-stoles
  "occasion-anniversary": 29,   // for-partner
};

// Multi-category slugs: fetch from multiple WC categories and merge
const multiCategoryMap: Record<string, number[]> = {
  "home-living":       [17, 18, 25, 26, 27], // doormats, mugs, night-lights, cutting-boards, garden-stakes
  "accessories":       [21, 23, 36],          // jewelry-dishes, belts, tassel-charms
  "occasion-birthday": [33, 32, 35, 18, 21],  // for-mom, for-family, for-kids, mugs, jewelry-dishes
  "occasion-christmas":[16, 18, 24, 25, 26],  // shirts, mugs, pocket-hugs, night-lights, cutting-boards
};

async function getProducts(page = 1, categorySlug?: string, search?: string, orderby?: string): Promise<Product[]> {
  try {
    // Multi-category fetch
    if (categorySlug && multiCategoryMap[categorySlug]) {
      const catIds = multiCategoryMap[categorySlug];
      const perCat = Math.ceil(12 / catIds.length);
      const results = await Promise.all(
        catIds.map((catId) =>
          api.get("products", { per_page: perCat, page: 1, status: "publish", category: catId, orderby: "date", order: "desc" })
            .then((r) => r.data as Product[])
            .catch(() => [] as Product[])
        )
      );
      // Interleave and deduplicate
      const seen = new Set<number>();
      const merged: Product[] = [];
      const maxLen = Math.max(...results.map((r) => r.length));
      for (let i = 0; i < maxLen; i++) {
        for (const list of results) {
          if (list[i] && !seen.has(list[i].id)) { seen.add(list[i].id); merged.push(list[i]); }
        }
      }
      return merged.slice(0, 12);
    }

    const params: Record<string, unknown> = {
      per_page: 12,
      page,
      status: "publish",
      orderby: "date",
      order: "desc",
    };
    if (categorySlug && categoryMap[categorySlug]) {
      params.category = categoryMap[categorySlug];
    }
    if (search) {
      params.search = search;
    }
    const { data } = await api.get("products", params);
    return data;
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string; orderby?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1");
  const categorySlug = params.category;
  const search = params.search?.trim() || "";
  const orderby = params.orderby || "";

  const products = await getProducts(currentPage, categorySlug, search || undefined, orderby || undefined);

  // Friendly labels for special slugs
  const specialLabels: Record<string, string> = {
    "home-living":         "Home & Living",
    "accessories":         "Accessories",
    "occasion-birthday":   "Birthday Gifts",
    "occasion-christmas":  "Christmas Gifts",
    "occasion-fathers-day":"Father's Day Gifts",
    "occasion-mothers-day":"Mother's Day Gifts",
    "occasion-graduation": "Graduation Gifts",
    "occasion-anniversary":"Anniversary Gifts",
  };

  const categoryTitle = categorySlug
    ? (specialLabels[categorySlug] ?? categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    : null;

  const isNewArrivals = orderby === "date" && !categorySlug && !search;
  const pageTitle = isNewArrivals
    ? "New Arrivals"
    : search
    ? `Search: "${search}"`
    : categoryTitle ?? "All Products";
  const pageSubtitle = isNewArrivals
    ? "The latest personalized gifts, just added"
    : search
    ? `${products.length} result${products.length !== 1 ? "s" : ""} for "${search}"`
    : categoryTitle
    ? `Browse our ${categoryTitle} collection — personalized just for you`
    : "Discover our full collection of personalized gifts";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-[#F36621]">Home</Link>
        <span className="mx-2">›</span>
        {categoryTitle || search ? (
          <>
            <Link href="/products" className="hover:text-[#F36621]">Products</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-700 font-medium">{search ? `"${search}"` : categoryTitle}</span>
          </>
        ) : (
          <span className="text-gray-700 font-medium">All Products</span>
        )}
      </nav>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">{pageTitle}</h1>
      <p className="text-gray-500 mb-8">{pageSubtitle}</p>

      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
          <p className="text-lg">No products found.</p>
          <p className="text-sm mt-2">
            {search ? `No results for "${search}".` : categoryTitle ? `No products in "${categoryTitle}" yet.` : "Add products in your WooCommerce dashboard."}
          </p>
          <Link href="/products" className="mt-4 inline-block text-[#F36621] font-semibold hover:underline text-sm">
            ← View All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {products.length === 12 && (
        <div className="flex justify-center gap-2 mt-12">
          {currentPage > 1 && (
            <a
              href={`/products?${categorySlug ? `category=${categorySlug}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}page=${currentPage - 1}`}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#F36621] hover:text-[#F36621] transition-colors"
            >
              ← Previous
            </a>
          )}
          <a
            href={`/products?${categorySlug ? `category=${categorySlug}&` : ""}${search ? `search=${encodeURIComponent(search)}&` : ""}page=${currentPage + 1}`}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#F36621] hover:text-[#F36621] transition-colors"
          >
            Next →
          </a>
        </div>
      )}
    </div>
  );
}
