import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";
import { Product } from "@/types";
import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

// Fetch all published products (paginated)
async function getAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  try {
    while (true) {
      const { data } = await api.get("products", {
        per_page: 100,
        page,
        status: "publish",
      });
      if (!data?.length) break;
      all.push(...data);
      if (data.length < 100) break;
      page++;
    }
  } catch {
    /* silent */
  }
  return all;
}

// Normalize image URLs: replace local dev domain with production domain
function normalizeImageUrl(url: string): string {
  return url
    .replace(/http:\/\/petzifyco\.local(:\d+)?/g, BASE_URL)
    .replace(/https?:\/\/petzifyco\.local(:\d+)?/g, BASE_URL);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getProductCategory(product: Product): string {
  if (!product.categories?.length) return "Home & Garden";
  const slug = product.categories[0].slug;
  const map: Record<string, string> = {
    shirts: "Apparel & Accessories > Clothing > Shirts & Tops",
    "hawaiian-shirts": "Apparel & Accessories > Clothing > Shirts & Tops",
    doormats: "Home & Garden > Decor > Door Mats",
    mugs: "Kitchen & Dining > Drinkware > Mugs",
    "beach-towels": "Home & Garden > Linens & Bedding > Towels",
    "whiskey-glasses": "Kitchen & Dining > Drinkware > Glasses",
    "jewelry-dishes": "Home & Garden > Decor > Decorative Trays",
    "graduation-stoles": "Apparel & Accessories > Clothing Accessories > Sashes & Stoles",
    belts: "Apparel & Accessories > Clothing Accessories > Belts",
    "pocket-hugs": "Arts & Entertainment > Hobbies & Creative Arts > Gift Giving",
    "night-lights": "Hardware > Lighting > Night Lights",
    "cutting-boards": "Kitchen & Dining > Kitchen Tools & Utensils > Cutting Boards",
    "garden-stakes": "Home & Garden > Lawn & Garden > Gardening",
    "tassel-charms": "Apparel & Accessories > Jewelry > Charms & Charm Bracelets",
    accessories: "Apparel & Accessories > Clothing Accessories",
    "home-living": "Home & Garden > Decor",
  };
  return map[slug] || "Home & Garden > Decor";
}

function getGtin(product: Product): string {
  // WooCommerce doesn't store GTIN by default — use product ID padded to 8 digits
  return String(product.id).padStart(8, "0");
}

export async function GET() {
  const products = await getAllProducts();

  const items = products
    .filter((p) => {
      const price = parseFloat(p.price);
      return price > 0 && p.images?.length > 0;
    })
    .map((p) => {
      const price = parseFloat(p.price || "0").toFixed(2);
      const regularPrice = parseFloat(p.regular_price || "0");
      const isOnSale = p.sale_price && p.sale_price !== p.regular_price && regularPrice > 0;
      const availability = p.stock_status === "instock" ? "in stock" : "out of stock";
      const image = normalizeImageUrl(p.images[0].src);
      const additionalImages = p.images.slice(1, 11).map((img) => ({
        ...img,
        src: normalizeImageUrl(img.src),
      }));
      const description = stripHtml(p.short_description || p.description || p.name);
      const truncatedDesc = description.length > 5000 ? description.slice(0, 4997) + "..." : description;
      const category = getProductCategory(p);
      const title = p.name.length > 150 ? p.name.slice(0, 147) + "..." : p.name;

      return `
    <item>
      <g:id>${escapeXml(String(p.id))}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(truncatedDesc || title)}</g:description>
      <g:link>${BASE_URL}/products/${escapeXml(p.slug)}</g:link>
      <g:image_link>${escapeXml(image)}</g:image_link>
      ${additionalImages.map((img) => `<g:additional_image_link>${escapeXml(img.src)}</g:additional_image_link>`).join("\n      ")}
      <g:price>${price} USD</g:price>
      ${isOnSale ? `<g:sale_price>${price} USD</g:sale_price>` : ""}
      ${isOnSale ? `<g:sale_price_effective_date>2026-01-01T00:00:00+00:00/2099-12-31T23:59:59+00:00</g:sale_price_effective_date>` : ""}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>Petzify</g:brand>
      <g:product_type>${escapeXml(category)}</g:product_type>
      <g:google_product_category>${escapeXml(category)}</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard</g:service>
        <g:price>0.00 USD</g:price>
      </g:shipping>
      <g:shipping_weight>0.5 lb</g:shipping_weight>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Petzify - Personalized Gifts &amp; Home Decor</title>
    <link>${BASE_URL}</link>
    <description>Shop personalized home decor, gifts, and apparel for every occasion.</description>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
