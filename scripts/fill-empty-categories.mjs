/**
 * Auto-fill all empty WooCommerce categories with products from macorner.co
 */

import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";
import https from "https";

const original = http.request.bind(http);
http.request = function (opts, cb) {
  if (typeof opts === "object" && opts !== null && "hostname" in opts &&
      typeof opts.hostname === "string" && opts.hostname.includes("petzifyco")) {
    opts.hostname = "127.0.0.1"; opts.port = 10004;
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
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(new Error("JSON parse failed")); } });
    }).on("error", reject);
  });
}

// Try multiple collection slugs, return first that has products
async function fetchFromMacorner(slugCandidates, limit = 4) {
  for (const slug of slugCandidates) {
    try {
      const data = await fetchJson(`https://macorner.co/collections/${slug}/products.json?limit=${limit}`);
      if (data.products?.length > 0) {
        console.log(`    ✓ Found ${data.products.length} products in /${slug}`);
        return { slug, products: data.products.slice(0, limit) };
      }
    } catch {}
  }
  return null;
}

// Skip personalization/custom attributes
const CUSTOM_KEYWORDS = [
  "personali", "custom", "name", "text", "photo", "upload", "note",
  "message", "engrav", "monogram", "initial", "font", "preview",
  "enter", "type", "your pet", "number of", "add-on",
];
function isCustomAttr(attr) {
  const n = attr.name.toLowerCase();
  return CUSTOM_KEYWORDS.some(k => n.includes(k));
}

async function importProduct(p, categoryId) {
  const images = p.images.slice(0, 4).map(img => ({ src: img.src.split("?")[0] }));
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 800);
  const basePrice = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";

  const validOptions = p.options.filter(o =>
    !(o.values.length === 1 && o.values[0] === "Default Title") && !isCustomAttr({ name: o.name })
  );

  if (validOptions.length === 0) {
    // Simple product
    const { data } = await api.post("products", {
      name: p.title, type: "simple", status: "publish",
      description: desc,
      short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
      regular_price: comparePrice || basePrice,
      sale_price: comparePrice ? basePrice : "",
      categories: [{ id: categoryId }], images,
    });
    return { id: data.id, type: "simple", vars: 0 };
  }

  // Variable product
  const attributes = validOptions.map((opt, position) => ({
    name: opt.name, position, visible: true, variation: true, options: opt.values,
  }));

  const { data: product } = await api.post("products", {
    name: p.title, type: "variable", status: "publish",
    description: desc,
    short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
    categories: [{ id: categoryId }], images, attributes,
  });

  // Create unique variant combinations
  const seen = new Set();
  let varsCreated = 0;
  for (const v of p.variants.slice(0, 30)) {
    const varAttrs = validOptions.map((opt) => {
      const idx = p.options.findIndex(o => o.name === opt.name);
      return { name: opt.name, option: v[`option${idx + 1}`] };
    });
    const key = varAttrs.map(a => a.option).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const vp = v.price || basePrice;
    const vc = v.compare_at_price || "";
    try {
      await api.post(`products/${product.id}/variations`, {
        regular_price: vc || vp, sale_price: vc ? vp : "",
        sku: v.sku || "", attributes: varAttrs, status: "publish",
      });
      varsCreated++;
    } catch {}
  }
  return { id: product.id, type: "variable", vars: varsCreated };
}

// ─── MAPPING: WC category slug → macorner collection candidates ──────────────
const JOBS = [
  // Product categories
  { id: 16, name: "Shirts",          slugs: ["shirt", "hawaiian-shirt", "apparel"] },
  { id: 18, name: "Mugs",            slugs: ["mug", "personalized-mug", "coffee-mug"] },
  { id: 20, name: "Whiskey Glasses", slugs: ["whiskey-glass", "personalized-whiskey-glass", "drink-barware"] },
  { id: 23, name: "Belts",           slugs: ["belt", "personalized-belt", "cowhide-belt"] },
  { id: 25, name: "Night Lights",    slugs: ["night-light", "personalized-night-light", "lamp"] },
  { id: 26, name: "Cutting Boards",  slugs: ["cutting-board", "personalized-cutting-board"] },
  { id: 27, name: "Garden Stakes",   slugs: ["garden-stake", "metal-garden-stake", "garden-metal-stake", "garden-decor"] },
  // Recipient categories
  { id: 28, name: "For Bestie",      slugs: ["bestie-gift", "gift-for-bestie", "personalized-gifts-for-best-friends", "friendship-gift"] },
  { id: 29, name: "For Partner",     slugs: ["gift-for-couple", "couple-gift", "husband-wife-gift", "couple"] },
  { id: 30, name: "For Sibling",     slugs: ["sibling-gift", "brother-sister-gift", "gift-for-brother", "gift-for-sister"] },
  { id: 31, name: "For Pet Lover",   slugs: ["pet-lover-gift", "dog-lover-gift", "cat-lover-gift", "pet-lover"] },
  { id: 32, name: "For Family",      slugs: ["family-gift", "gift-for-family", "family"] },
  { id: 33, name: "For Mom",         slugs: ["gift-for-mom", "mothers-day", "mother-s-day", "gift-for-mother"] },
  { id: 34, name: "For Dad",         slugs: ["gift-for-dad", "fathers-day", "father-s-day", "gift-for-father"] },
  { id: 35, name: "For Kids",        slugs: ["gift-for-kids", "kids-gift", "children-gift", "baby-gift"] },
];

const LIMIT = 4;

console.log(`Starting import for ${JOBS.length} empty categories...\n`);
let totalImported = 0;

for (const job of JOBS) {
  console.log(`\n${"─".repeat(55)}`);
  console.log(`[${job.name}] ID ${job.id}`);
  console.log(`  Trying: ${job.slugs.slice(0, 3).join(", ")}...`);

  const result = await fetchFromMacorner(job.slugs, LIMIT);
  if (!result) {
    console.log(`  ⚠️  No collection found. Skipping.`);
    continue;
  }

  for (const p of result.products) {
    const validOpts = p.options.filter(o =>
      !(o.values.length === 1 && o.values[0] === "Default Title") && !isCustomAttr({ name: o.name })
    );
    const skippedOpts = p.options.filter(o => isCustomAttr({ name: o.name }));

    process.stdout.write(`  ▸ ${p.title.substring(0, 50)}... `);
    if (validOpts.length) process.stdout.write(`[${validOpts.map(o=>`${o.name}(${o.values.length})`).join(",")}] `);
    if (skippedOpts.length) process.stdout.write(`(skip: ${skippedOpts.map(o=>o.name).join(",")}) `);

    try {
      const r = await importProduct(p, job.id);
      const label = r.type === "simple" ? "simple" : `${r.vars} vars`;
      console.log(`→ ✅ ID ${r.id} [${label}]`);
      totalImported++;
    } catch (e) {
      console.log(`→ ❌ ${e?.response?.data?.message || e.message}`);
    }
  }
}

console.log(`\n${"═".repeat(55)}`);
console.log(`DONE — Imported ${totalImported} products across ${JOBS.length} categories`);
