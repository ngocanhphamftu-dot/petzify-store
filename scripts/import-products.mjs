/**
 * Import products from a macorner.co collection into WooCommerce.
 * Usage: node scripts/import-products.mjs <collection-slug> <wc-category-id> [limit]
 * Example: node scripts/import-products.mjs jewelry-dish 21 4
 */

import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";
import https from "https";

// Patch LocalWP port
const original = http.request.bind(http);
http.request = function (opts, cb) {
  if (typeof opts === "object" && opts !== null && "hostname" in opts &&
      typeof opts.hostname === "string" && opts.hostname.includes("petzifyco")) {
    opts.hostname = "127.0.0.1";
    opts.port = 10004;
  }
  return original(opts, cb);
};

const api = new WooCommerceRestApi({
  url: "http://petzifyco.local",
  consumerKey: "ck_83d2cdf16249cd6a4e6225cbc2c0b651cb0d1669",
  consumerSecret: "cs_7c3c899a003116929f0e83b927aea60639e402aa",
  version: "wc/v3",
});

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on("error", reject);
  });
}

const [,, collection, categoryId, limitArg] = process.argv;
const LIMIT = parseInt(limitArg || "4");
const CAT_ID = parseInt(categoryId);

if (!collection || !CAT_ID) {
  console.log("Usage: node scripts/import-products.mjs <collection-slug> <category-id> [limit]");
  console.log("Example: node scripts/import-products.mjs jewelry-dish 21 4");
  process.exit(1);
}

console.log(`\nFetching ${LIMIT} products from macorner.co/collections/${collection}...\n`);

const data = await fetchJson(`https://macorner.co/collections/${collection}/products.json?limit=${LIMIT}`);
const products = data.products?.slice(0, LIMIT) || [];

if (products.length === 0) {
  console.log("No products found.");
  process.exit(0);
}

console.log(`Found ${products.length} products. Creating in WooCommerce...\n`);

for (const p of products) {
  const images = p.images.slice(0, 4).map(img => ({
    src: img.src.split("?")[0],  // remove Shopify query params
    name: p.handle,
  }));

  const price = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 1000);

  console.log(`Creating: ${p.title}`);

  try {
    const payload = {
      name: p.title,
      status: "publish",
      description: desc,
      short_description: `Personalized ${p.title} — custom made just for you.`,
      regular_price: comparePrice || price,
      sale_price: comparePrice ? price : "",
      categories: [{ id: CAT_ID }],
      images,
    };

    const { data: created } = await api.post("products", payload);
    console.log(`  ✅ ID ${created.id} — $${price} — ${images.length} images`);
  } catch (e) {
    console.log(`  ❌ Failed: ${e?.response?.data?.message || e.message}`);
  }
}

console.log("\n=== Done ===");
