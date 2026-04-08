import { MetadataRoute } from "next";
import api from "@/lib/woocommerce";
import { Product } from "@/types";

const BASE_URL = "https://petzify.co";

const staticPages = [
  { url: "/", priority: 1.0, changeFrequency: "daily" as const },
  { url: "/products", priority: 0.9, changeFrequency: "daily" as const },
  { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/help", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/shipping", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/return-policy", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/refund-policy", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/cancellation-policy", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/privacy-policy", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/terms", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/accessibility", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/disclaimer", priority: 0.4, changeFrequency: "monthly" as const },
  { url: "/size-chart", priority: 0.4, changeFrequency: "monthly" as const },
];

async function getAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  try {
    while (true) {
      const { data } = await api.get("products", { per_page: 100, page, status: "publish" });
      if (!data?.length) break;
      all.push(...data);
      if (data.length < 100) break;
      page++;
    }
  } catch { /* silent */ }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${BASE_URL}${p.url}`,
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  return [...staticEntries, ...productEntries];
}
