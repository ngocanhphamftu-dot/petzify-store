import { NextResponse } from "next/server";
import api from "@/lib/woocommerce";
import { Product } from "@/types";
import { BASE_URL } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

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

function normalizeImageUrl(url: string): string {
  return url
    .replace(/https?:\/\/petzifyco\.local(:\d+)?/g, BASE_URL);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function isGenericDescription(desc: string): boolean {
  if (!desc || desc.length < 80) return true;
  return /made just for you/i.test(desc) || /^personalized .{1,80}—\s*$/i.test(desc);
}

function buildDescription(p: Product): string {
  const raw = stripHtml(p.short_description || p.description || "");
  if (!isGenericDescription(raw)) {
    return raw.length > 5000 ? raw.slice(0, 4997) + "..." : raw;
  }

  const name         = p.name;
  const categoryName = p.categories?.[0]?.name ?? "Gift";
  const tags         = (p.tags ?? []).map((t) => t.name).filter(Boolean);
  const attrs        = p.attributes ?? [];

  const materialAttr = attrs.find((a) => /material|style|type|finish/i.test(a.name));
  const sizeAttr     = attrs.find((a) => /size/i.test(a.name));

  let desc = `${name} — a one-of-a-kind personalized ${categoryName.toLowerCase()}. `;

  if (materialAttr?.options?.length) {
    desc += `Available in ${materialAttr.options.slice(0, 3).join(", ")}. `;
  }
  if (sizeAttr?.options?.length) {
    desc += `Sizes: ${sizeAttr.options.slice(0, 3).join(", ")}. `;
  }
  if (tags.length > 0) {
    desc += `Great for ${tags.slice(0, 4).join(", ")}. `;
  }
  desc += "Add a custom name, photo, or personal message. Ships from the United States.";

  return desc.length > 5000 ? desc.slice(0, 4997) + "..." : desc;
}

// Wrap field in quotes and escape inner quotes
function csvField(value: string): string {
  const escaped = String(value).replace(/"/g, '""');
  return `"${escaped}"`;
}

function getProductCategory(product: Product): string {
  if (!product.categories?.length) return "Home & Garden";
  const slug = product.categories[0].slug;
  const map: Record<string, string> = {
    "shirts": "Apparel & Accessories > Clothing > Shirts & Tops",
    "hawaiian-shirts": "Apparel & Accessories > Clothing > Shirts & Tops",
    "doormats": "Home & Garden > Decor > Door Mats",
    "mugs": "Kitchen & Dining > Drinkware > Mugs",
    "beach-towels": "Home & Garden > Linens & Bedding > Towels",
    "whiskey-glasses": "Kitchen & Dining > Drinkware > Glasses",
    "jewelry-dishes": "Home & Garden > Decor > Decorative Trays",
    "graduation-stoles": "Apparel & Accessories > Clothing Accessories > Sashes & Stoles",
    "belts": "Apparel & Accessories > Clothing Accessories > Belts",
    "pocket-hugs": "Arts & Entertainment > Hobbies & Creative Arts > Gift Giving",
    "night-lights": "Hardware > Lighting > Night Lights",
    "cutting-boards": "Kitchen & Dining > Kitchen Tools & Utensils > Cutting Boards",
    "garden-stakes": "Home & Garden > Lawn & Garden > Gardening",
    "tassel-charms": "Apparel & Accessories > Jewelry > Charms & Charm Bracelets",
    "accessories": "Apparel & Accessories > Clothing Accessories",
    "home-living": "Home & Garden > Decor",
  };
  return map[slug] || "Home & Garden > Decor";
}

export async function GET() {
  const products = await getAllProducts();

  // Bing Merchant Center required + recommended columns
  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "additional_image_link",
    "price",
    "sale_price",
    "availability",
    "condition",
    "brand",
    "product_type",
    "google_product_category",
    "identifier_exists",
    "shipping",
    "custom_label_0",
    "mobile_link",
  ];

  const rows = products
    .filter((p) => parseFloat(p.price) > 0 && p.images?.length > 0)
    .map((p) => {
      const price = `${parseFloat(p.price || "0").toFixed(2)} USD`;
      const regularPrice = parseFloat(p.regular_price || "0");
      const isOnSale =
        p.sale_price &&
        p.sale_price !== p.regular_price &&
        regularPrice > 0;
      const salePrice = isOnSale ? price : "";
      const availability = p.stock_status === "instock" ? "in stock" : "out of stock";
      const image = normalizeImageUrl(p.images[0].src);
      const additionalImages = p.images
        .slice(1, 11)
        .map((img) => normalizeImageUrl(img.src))
        .join(",");
      const truncatedDesc = buildDescription(p) || p.name;
      const category = getProductCategory(p);
      const title =
        p.name.length > 150 ? p.name.slice(0, 147) + "..." : p.name;
      const productUrl = `${BASE_URL}/products/${p.slug}`;
      const shipping = "US::Standard:0 USD";

      // custom_label_0: first category name (useful for Bing campaign segmentation)
      const customLabel = p.categories?.[0]?.name || "";

      return [
        csvField(String(p.id)),
        csvField(title),
        csvField(truncatedDesc || title),
        csvField(productUrl),
        csvField(image),
        csvField(additionalImages),
        csvField(price),
        csvField(salePrice),
        csvField(availability),
        csvField("new"),
        csvField("Petzify"),
        csvField(category),
        csvField(category),
        csvField("no"),
        csvField(shipping),
        csvField(customLabel),
        csvField(productUrl), // mobile_link same as link
      ].join(",");
    });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="petzify-products.csv"',
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
