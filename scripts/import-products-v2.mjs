/**
 * Import products from macorner.co with full attributes & variations.
 * Usage: node scripts/import-products-v2.mjs <collection-slug> <wc-category-id> [limit]
 */

import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";
import https from "https";

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

// Delete products by IDs
async function deleteProducts(ids) {
  for (const id of ids) {
    try {
      await api.delete(`products/${id}`, { force: true });
      console.log(`  🗑  Deleted product ID ${id}`);
    } catch(e) {
      console.log(`  ⚠️  Could not delete ID ${id}: ${e?.response?.data?.message || e.message}`);
    }
  }
}

async function createProduct(p, categoryId) {
  const images = p.images.slice(0, 4).map(img => ({ src: img.src.split("?")[0] }));
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 1000);
  const basePrice = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";

  // Check if simple product (only 1 variant with Default Title)
  const isSimple = p.variants.length === 1 && p.options.length === 1 && p.options[0].name === "Title";

  if (isSimple) {
    const { data } = await api.post("products", {
      name: p.title,
      type: "simple",
      status: "publish",
      description: desc,
      short_description: `Personalized ${p.title.split("-")[0].trim()} — custom made just for you.`,
      regular_price: comparePrice || basePrice,
      sale_price: comparePrice ? basePrice : "",
      categories: [{ id: categoryId }],
      images,
    });
    return { id: data.id, type: "simple", variationsCreated: 0 };
  }

  // Variable product
  // Build WooCommerce attributes from Shopify options
  const attributes = p.options.map((opt, position) => ({
    name: opt.name,
    position,
    visible: true,
    variation: true,
    options: opt.values,
  }));

  const { data: product } = await api.post("products", {
    name: p.title,
    type: "variable",
    status: "publish",
    description: desc,
    short_description: `Personalized ${p.title.split("-")[0].trim()} — custom made just for you.`,
    categories: [{ id: categoryId }],
    images,
    attributes,
  });

  // Create variations
  let variationsCreated = 0;
  for (const variant of p.variants) {
    // Build attributes array for this variation
    const varAttributes = p.options.map((opt, i) => ({
      name: opt.name,
      option: variant[`option${i + 1}`],
    }));

    const varPrice = variant.price || basePrice;
    const varCompare = variant.compare_at_price || "";

    try {
      await api.post(`products/${product.id}/variations`, {
        regular_price: varCompare || varPrice,
        sale_price: varCompare ? varPrice : "",
        sku: variant.sku || "",
        attributes: varAttributes,
        status: "publish",
      });
      variationsCreated++;
    } catch(e) {
      console.log(`    ⚠️  Variation failed (${variant.title}): ${e?.response?.data?.message || e.message}`);
    }
  }

  return { id: product.id, type: "variable", variationsCreated };
}

// === MAIN ===
const [,, collection, categoryId, limitArg] = process.argv;
const LIMIT = parseInt(limitArg || "4");
const CAT_ID = parseInt(categoryId);

if (!collection || !CAT_ID) {
  console.log("Usage: node scripts/import-products-v2.mjs <collection-slug> <category-id> [limit]");
  console.log("Example: node scripts/import-products-v2.mjs jewelry-dish 21 4");
  process.exit(1);
}

// If --delete flag provided, delete those IDs first
const deleteArg = process.argv.find(a => a.startsWith("--delete="));
if (deleteArg) {
  const ids = deleteArg.replace("--delete=", "").split(",").map(Number);
  console.log(`\nDeleting ${ids.length} existing products...`);
  await deleteProducts(ids);
  console.log("");
}

console.log(`Fetching ${LIMIT} products from macorner.co/collections/${collection}...\n`);
const data = await fetchJson(`https://macorner.co/collections/${collection}/products.json?limit=${LIMIT}`);
const products = data.products?.slice(0, LIMIT) || [];

if (products.length === 0) {
  console.log("No products found.");
  process.exit(0);
}

console.log(`Found ${products.length} products. Importing...\n`);

for (const p of products) {
  const optionsSummary = p.options.map(o => `${o.name} (${o.values.length})`).join(", ");
  const type = p.variants.length === 1 && p.options[0]?.name === "Title" ? "simple" : "variable";
  console.log(`Creating [${type}]: ${p.title}`);
  console.log(`  Options: ${optionsSummary} | Variants: ${p.variants.length} | Images: ${p.images.length}`);

  try {
    const result = await createProduct(p, CAT_ID);
    if (result.type === "simple") {
      console.log(`  ✅ ID ${result.id} — simple product`);
    } else {
      console.log(`  ✅ ID ${result.id} — variable product, ${result.variationsCreated} variations created`);
    }
  } catch (e) {
    console.log(`  ❌ Failed: ${e?.response?.data?.message || e.message}`);
    if (e?.response?.data) console.log("    ", JSON.stringify(e.response.data));
  }
}

console.log("\n=== Done ===");
