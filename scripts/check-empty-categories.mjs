import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";

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

const { data: cats } = await api.get("products/categories", { per_page: 50, hide_empty: false });

console.log("Category product counts:");
for (const c of cats) {
  if (c.slug === "uncategorized") continue;
  console.log(`  [${c.count === 0 ? "EMPTY" : `${c.count} products`}] ID ${c.id} | ${c.slug} | ${c.name}`);
}
