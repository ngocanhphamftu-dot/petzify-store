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

// Fetch all products in Jewelry Dishes category (ID 21)
const { data: products } = await api.get("products", { category: 21, per_page: 20 });

for (const p of products) {
  console.log(`\nID ${p.id} [${p.type}]: ${p.name.substring(0, 60)}...`);
  if (p.attributes?.length) {
    p.attributes.forEach(a => {
      console.log(`  Attr: "${a.name}" | variation: ${a.variation} | options: [${a.options?.join(", ")}]`);
    });
  } else {
    console.log("  No attributes");
  }
  if (p.type === "variable") {
    const { data: vars } = await api.get(`products/${p.id}/variations`, { per_page: 20 });
    console.log(`  Variations (${vars.length}):`);
    vars.forEach(v => console.log(`    - ${v.attributes.map(a => `${a.name}:${a.option}`).join(" / ")} | $${v.regular_price}`));
  }
}
