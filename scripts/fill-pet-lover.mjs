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
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on("error", reject);
  });
}

const CUSTOM_KEYWORDS = ["personali","custom","name","text","photo","upload","note","message","engrav","monogram","initial","font","preview","enter","type","your pet","number of","add-on"];
function isCustomAttr(attr) { return CUSTOM_KEYWORDS.some(k => attr.name.toLowerCase().includes(k)); }

// Try pet-related collections
const slugsToTry = [
  "dog-mom-gift", "cat-mom-gift", "dog-lover", "cat-lover",
  "dog-gifts", "cat-gifts", "pet-gifts", "fur-mom",
  "dog-mom", "dog-dad", "pet-lover"
];

let found = null;
for (const slug of slugsToTry) {
  try {
    const data = await fetchJson(`https://macorner.co/collections/${slug}/products.json?limit=4`);
    if (data.products?.length > 0) {
      console.log(`✓ Found in /${slug}: ${data.products.length} products`);
      found = { slug, products: data.products.slice(0, 4) };
      break;
    }
  } catch {}
}

if (!found) {
  // Fall back: fetch general products and pick pet-related ones
  console.log("Trying general products search for pet-related...");
  const data = await fetchJson("https://macorner.co/products.json?limit=250");
  const petProducts = data.products.filter(p =>
    p.title.toLowerCase().match(/\b(dog|cat|pet|paw|fur|puppy|kitten|feline|canine)\b/)
  ).slice(0, 4);
  if (petProducts.length > 0) {
    console.log(`✓ Found ${petProducts.length} pet-related products from /products.json`);
    found = { slug: "products", products: petProducts };
  }
}

if (!found) { console.log("❌ No pet products found."); process.exit(1); }

const CAT_ID = 31; // For Pet Lover

for (const p of found.products) {
  const images = p.images.slice(0, 4).map(img => ({ src: img.src.split("?")[0] }));
  const desc = (p.body_html || "").replace(/<[^>]+>/g, "").trim().substring(0, 800);
  const basePrice = p.variants[0]?.price || "29.95";
  const comparePrice = p.variants[0]?.compare_at_price || "";
  const validOpts = p.options.filter(o => !(o.values.length === 1 && o.values[0] === "Default Title") && !isCustomAttr({ name: o.name }));

  process.stdout.write(`▸ ${p.title.substring(0, 55)}... `);
  if (validOpts.length) process.stdout.write(`[${validOpts.map(o=>`${o.name}(${o.values.length})`).join(",")}] `);

  try {
    if (validOpts.length === 0) {
      const { data } = await api.post("products", {
        name: p.title, type: "simple", status: "publish", description: desc,
        short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
        regular_price: comparePrice || basePrice, sale_price: comparePrice ? basePrice : "",
        categories: [{ id: CAT_ID }], images,
      });
      console.log(`→ ✅ ID ${data.id} [simple]`);
    } else {
      const attributes = validOpts.map((opt, i) => ({ name: opt.name, position: i, visible: true, variation: true, options: opt.values }));
      const { data: product } = await api.post("products", {
        name: p.title, type: "variable", status: "publish", description: desc,
        short_description: `Personalized ${p.title.split(" - ")[0].trim()} — made just for you.`,
        categories: [{ id: CAT_ID }], images, attributes,
      });
      const seen = new Set(); let varsCreated = 0;
      for (const v of p.variants.slice(0, 30)) {
        const varAttrs = validOpts.map(opt => { const idx = p.options.findIndex(o => o.name === opt.name); return { name: opt.name, option: v[`option${idx+1}`] }; });
        const key = varAttrs.map(a => a.option).join("|");
        if (seen.has(key)) continue; seen.add(key);
        const vp = v.price || basePrice; const vc = v.compare_at_price || "";
        try { await api.post(`products/${product.id}/variations`, { regular_price: vc||vp, sale_price: vc?vp:"", sku: v.sku||"", attributes: varAttrs, status: "publish" }); varsCreated++; } catch {}
      }
      console.log(`→ ✅ ID ${product.id} [${varsCreated} vars]`);
    }
  } catch (e) { console.log(`→ ❌ ${e?.response?.data?.message || e.message}`); }
}

console.log("\n=== Done ===");
