import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import http from "http";

// LocalWP patch: redirect petzifyco.local → 127.0.0.1:10004
// Only active in development when using LocalWP
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_WORDPRESS_URL?.includes("petzifyco.local")) {
  const original = http.request.bind(http);
  // @ts-ignore
  http.request = function (opts, cb) {
    if (
      typeof opts === "object" &&
      opts !== null &&
      "hostname" in opts &&
      typeof opts.hostname === "string" &&
      opts.hostname.includes("petzifyco")
    ) {
      opts.hostname = "127.0.0.1";
      opts.port = 10004;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (original as any)(opts, cb);
  };
}

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || "http://petzifyco.local",
  consumerKey: process.env.WC_CONSUMER_KEY || "",
  consumerSecret: process.env.WC_CONSUMER_SECRET || "",
  version: "wc/v3",
});

export default api;
