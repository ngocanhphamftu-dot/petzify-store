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

// Fetch by slug exactly like the Next.js page does
const { data } = await api.get("products", { slug: "god-says-i-am-name-letter-in-bible-toile-de-jouy-style-personalized-jewelry-dish" });
const p = data[0];
console.log("Type:", p.type);
console.log("Attributes from /products?slug= :");
p.attributes?.forEach(a => {
  console.log(`  "${a.name}" | variation: ${a.variation} | options (${a.options?.length}): [${a.options?.join(", ")}]`);
});
