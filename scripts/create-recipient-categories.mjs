import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";

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

const categories = [
  { name: "For Bestie",    slug: "for-bestie" },
  { name: "For Partner",   slug: "for-partner" },
  { name: "For Sibling",   slug: "for-sibling" },
  { name: "For Pet Lover", slug: "for-pet-lover" },
  { name: "For Family",    slug: "for-family" },
  { name: "For Mom",       slug: "for-mom" },
  { name: "For Dad",       slug: "for-dad" },
  { name: "For Kid & Baby",slug: "for-kids" },
];

console.log("Creating recipient categories...\n");

const results = [];

for (const cat of categories) {
  try {
    const { data } = await api.post("products/categories", {
      name: cat.name,
      slug: cat.slug,
    });
    results.push({ name: data.name, slug: data.slug, id: data.id });
    console.log(`✅ Created: ${data.name} (ID: ${data.id}, slug: ${data.slug})`);
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    if (msg && msg.includes("already exists")) {
      try {
        const { data: list } = await api.get("products/categories", { slug: cat.slug });
        if (list.length > 0) {
          results.push({ name: list[0].name, slug: list[0].slug, id: list[0].id });
          console.log(`⚠️  Already exists: ${list[0].name} (ID: ${list[0].id})`);
        }
      } catch {}
    } else {
      console.error(`❌ Failed: ${cat.name} — ${msg}`);
    }
  }
}

console.log("\n=== Done ===");
results.forEach(r => console.log(`  ID ${r.id} | ${r.slug} | ${r.name}`));
