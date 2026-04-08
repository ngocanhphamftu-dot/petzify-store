/**
 * Bulk import products from multiple macorner collections.
 * Skips personalization/custom attributes automatically.
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

// Keywords that indicate a personalization/custom field (skip these)
const CUSTOM_KEYWORDS = [
  "personali", "custom", "name", "text", "photo", "upload", "note",
  "message", "engrav", "monogram", "initial", "font", "preview",
  "enter", "type your", "your pet", "number of",
];

function isCustomAttribute(attr) {
  const nameLower = attr.name.toLowerCase();
  // Skip if attribute name contains custom keywords
  if (CUSTOM_KEYWORDS.some(k => nameLower.includes(k))) return true;
  // Skip if all options look like instructions
  if (attr.options?.every(o =>
    o.toLowerCase().startsWith("please") ||
    o.toLowerCase().startsWith("enter") ||
    o.toLowerCase().startsWith("type")
  )) return true;
  return false;
}

async function createCategoryIfNeeded(name, slug) {
  try {
    const { data: existing } = await api.get("products/categories", { slug });
    if (existing.length > 0) {
      console.log(`  Category exists: ${name} (ID: ${existing[0].id})`);
      return existing[0].id;
    }
  } catch {}
  const { data } = await api.post("products/categories", { name, slug });
  console.log(`  Created category: ${name} (ID: ${data.id})`);
  return data.id;
}

async function importProduct(p, categoryId) {
  const images = p.images.slice(0, 4).map(img => ({ src: img.src.split("?")[0] }));
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 1000);
  const basePrice = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";

  // Filter attributes: keep only non-custom, multi-option attributes
  const validOptions = p.options.filter(opt => {
    if (opt.values.length <= 1 && opt.values[0] === "Default Title") return false;
    if (isCustomAttribute({ name: opt.name, options: opt.values })) return false;
    return true;
  });

  const isSimple = validOptions.length === 0;

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
    return { id: data.id, type: "simple", vars: 0 };
  }

  // Variable product
  const attributes = validOptions.map((opt, position) => ({
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

  // Only create variations that use valid (non-custom) options
  const validOptionNames = new Set(validOptions.map(o => o.name));

  // Get unique valid variant combinations
  const variantsToCreate = p.variants.filter(v => {
    // Check that this variant only uses valid options
    return p.options.every((opt, i) => {
      if (!validOptionNames.has(opt.name)) return true; // skip checking custom opts
      return validOptions.find(vo => vo.name === opt.name)?.values.includes(v[`option${i+1}`]);
    });
  });

  // De-duplicate by valid option combination
  const seen = new Set();
  const uniqueVariants = [];
  for (const v of variantsToCreate) {
    const key = validOptions.map((opt, i) => {
      const originalIdx = p.options.findIndex(o => o.name === opt.name);
      return v[`option${originalIdx + 1}`];
    }).join("|");
    if (!seen.has(key)) {
      seen.add(key);
      uniqueVariants.push({ v, key });
    }
  }

  let varsCreated = 0;
  for (const { v, key } of uniqueVariants.slice(0, 30)) {
    const varAttrs = validOptions.map((opt, i) => {
      const originalIdx = p.options.findIndex(o => o.name === opt.name);
      return { name: opt.name, option: v[`option${originalIdx + 1}`] };
    });
    const varPrice = v.price || basePrice;
    const varCompare = v.compare_at_price || "";
    try {
      await api.post(`products/${product.id}/variations`, {
        regular_price: varCompare || varPrice,
        sale_price: varCompare ? varPrice : "",
        sku: v.sku || "",
        attributes: varAttrs,
        status: "publish",
      });
      varsCreated++;
    } catch {}
  }

  return { id: product.id, type: "variable", vars: varsCreated };
}

// ─── COLLECTIONS TO IMPORT ───────────────────────────────────────
const JOBS = [
  { collection: "graduation-stole",        categoryId: 22, categoryName: "Graduation Stoles" },
  { collection: "doormat",                  categoryId: 17, categoryName: "Doormats" },
  { collection: "graduation-tassel-charm",  categoryId: null, categoryName: "Tassel Charms", slug: "tassel-charms" },
  { collection: "pocket-hug",              categoryId: 24, categoryName: "Pocket Hugs" },
  { collection: "beach-towels",            categoryId: 19, categoryName: "Beach Towels" },
];

const LIMIT = 4;

for (const job of JOBS) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Collection: ${job.collection} → ${job.categoryName}`);

  // Create category if needed
  if (!job.categoryId) {
    job.categoryId = await createCategoryIfNeeded(job.categoryName, job.slug);
  }

  // Fetch products
  let products;
  try {
    const data = await fetchJson(`https://macorner.co/collections/${job.collection}/products.json?limit=${LIMIT}`);
    products = data.products?.slice(0, LIMIT) || [];
  } catch (e) {
    console.log(`  ❌ Fetch failed: ${e.message}`);
    continue;
  }

  if (products.length === 0) {
    console.log("  No products found in collection.");
    continue;
  }

  console.log(`  Fetched ${products.length} products\n`);

  for (const p of products) {
    const validOpts = p.options.filter(o => {
      if (o.values.length <= 1 && o.values[0] === "Default Title") return false;
      if (isCustomAttribute({ name: o.name, options: o.values })) return false;
      return true;
    });

    const skippedOpts = p.options.filter(o =>
      o.values.length > 1 || o.values[0] !== "Default Title"
    ).filter(o => !validOpts.includes(o));

    console.log(`  ▸ ${p.title.substring(0, 55)}...`);
    if (validOpts.length) console.log(`    Keep: ${validOpts.map(o => `${o.name}(${o.values.length})`).join(", ")}`);
    if (skippedOpts.length) console.log(`    Skip: ${skippedOpts.map(o => o.name).join(", ")}`);

    try {
      const result = await importProduct(p, job.categoryId);
      const label = result.type === "simple" ? "simple" : `variable, ${result.vars} variations`;
      console.log(`    ✅ ID ${result.id} [${label}]`);
    } catch (e) {
      console.log(`    ❌ ${e?.response?.data?.message || e.message}`);
    }
  }
}

console.log("\n\n=== ALL DONE ===");
