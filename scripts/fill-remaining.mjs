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
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(new Error("parse fail")); } });
    }).on("error", reject);
  });
}

async function fetchFromMacorner(slugCandidates, limit = 4) {
  for (const slug of slugCandidates) {
    try {
      const data = await fetchJson(`https://macorner.co/collections/${slug}/products.json?limit=${limit}`);
      if (data.products?.length > 0) {
        console.log(`    ✓ Found in /${slug}`);
        return data.products.slice(0, limit);
      }
    } catch {}
  }
  return null;
}

const CUSTOM_KEYWORDS = ["personali","custom","name","text","photo","upload","note","message","engrav","monogram","initial","font","preview","enter","type","your pet","number of","add-on"];
function isCustomAttr(attr) { return CUSTOM_KEYWORDS.some(k => attr.name.toLowerCase().includes(k)); }

async function importProduct(p, categoryId) {
  const images = p.images.slice(0, 4).map(img => ({ src: img.src.split("?")[0] }));
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 800);
  const basePrice = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";
  const validOptions = p.options.filter(o => !(o.values.length === 1 && o.values[0] === "Default Title") && !isCustomAttr({ name: o.name }));

  if (validOptions.length === 0) {
    const { data } = await api.post("products", {
      name: p.title, type: "simple", status: "publish", description: desc,
      short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
      regular_price: comparePrice || basePrice, sale_price: comparePrice ? basePrice : "",
      categories: [{ id: categoryId }], images,
    });
    return { id: data.id, type: "simple", vars: 0 };
  }

  const attributes = validOptions.map((opt, position) => ({ name: opt.name, position, visible: true, variation: true, options: opt.values }));
  const { data: product } = await api.post("products", {
    name: p.title, type: "variable", status: "publish", description: desc,
    short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
    categories: [{ id: categoryId }], images, attributes,
  });

  const seen = new Set();
  let varsCreated = 0;
  for (const v of p.variants.slice(0, 30)) {
    const varAttrs = validOptions.map(opt => {
      const idx = p.options.findIndex(o => o.name === opt.name);
      return { name: opt.name, option: v[`option${idx + 1}`] };
    });
    const key = varAttrs.map(a => a.option).join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    const vp = v.price || basePrice; const vc = v.compare_at_price || "";
    try {
      await api.post(`products/${product.id}/variations`, {
        regular_price: vc || vp, sale_price: vc ? vp : "", sku: v.sku || "", attributes: varAttrs, status: "publish",
      });
      varsCreated++;
    } catch {}
  }
  return { id: product.id, type: "variable", vars: varsCreated };
}

const JOBS = [
  { id: 25, name: "Night Lights",  slugs: ["3d-night-light", "night-light-lamp", "personalized-3d-night-light", "moon-lamp", "neon-sign", "led-night-light"] },
  { id: 28, name: "For Bestie",    slugs: ["friendship", "best-friend", "bestie", "bff-gift", "friend-gift", "gifts-for-friends"] },
  { id: 30, name: "For Sibling",   slugs: ["sibling", "brother", "sister", "brother-gift", "sister-gift", "gift-for-brother-sister"] },
  { id: 31, name: "For Pet Lover", slugs: ["dog-lover", "cat-lover", "pet-gift", "dog-gift", "dog-mom", "pet-memorial"] },
  { id: 35, name: "For Kids",      slugs: ["for-kids", "kids", "children", "baby", "newborn", "toddler", "kid-gift"] },
];

for (const job of JOBS) {
  console.log(`\n${"─".repeat(55)}`);
  console.log(`[${job.name}] — trying ${job.slugs.length} slugs...`);
  const products = await fetchFromMacorner(job.slugs, 4);
  if (!products) { console.log("  ⚠️  Still not found. Skipping."); continue; }

  for (const p of products) {
    const validOpts = p.options.filter(o => !(o.values.length === 1 && o.values[0] === "Default Title") && !isCustomAttr({ name: o.name }));
    process.stdout.write(`  ▸ ${p.title.substring(0, 50)}... `);
    if (validOpts.length) process.stdout.write(`[${validOpts.map(o=>`${o.name}(${o.values.length})`).join(",")}] `);
    try {
      const r = await importProduct(p, job.id);
      console.log(`→ ✅ ID ${r.id} [${r.type === "simple" ? "simple" : `${r.vars} vars`}]`);
    } catch (e) {
      console.log(`→ ❌ ${e?.response?.data?.message || e.message}`);
    }
  }
}
console.log("\n=== Done ===");
