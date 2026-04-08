/**
 * Convert simple products in a category to variable with Buy More Save More quantities.
 * Pricing tiers follow macorner.co jewelry dish structure.
 */

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

// Buy More Save More pricing tiers (price per order, not per piece)
// Based on macorner.co jewelry dish pricing at $29.95 base
const QUANTITY_TIERS = [
  { option: "1PC",  regular_price: "39.95", sale_price: "29.95" },
  { option: "2PCS", regular_price: "59.90", sale_price: "55.90" },
  { option: "3PCS", regular_price: "89.85", sale_price: "71.85" },
  { option: "4PCS", regular_price: "119.80", sale_price: "101.80" },
  { option: "5PCS", regular_price: "149.75", sale_price: "119.75" },
  { option: "6PCS", regular_price: "179.70", sale_price: "139.70" },
];

const ATTR_NAME = "Buy More Save More";

// Product IDs to update (simple → variable)
const PRODUCT_IDS = [69, 74, 79];

console.log(`Updating ${PRODUCT_IDS.length} simple products to variable...\n`);

for (const productId of PRODUCT_IDS) {
  try {
    // 1. Get current product
    const { data: p } = await api.get(`products/${productId}`);
    console.log(`\nProduct ID ${productId}: ${p.name.substring(0, 60)}...`);
    console.log(`  Current type: ${p.type}`);

    // 2. Convert to variable + add attribute
    const { data: updated } = await api.put(`products/${productId}`, {
      type: "variable",
      // Keep sale price at product level showing base price
      regular_price: "",
      sale_price: "",
      price: "",
      attributes: [
        {
          name: ATTR_NAME,
          position: 0,
          visible: true,
          variation: true,
          options: QUANTITY_TIERS.map(t => t.option),
        },
      ],
    });
    console.log(`  ✅ Converted to variable, attributes set`);

    // 3. Create variations
    let created = 0;
    for (const tier of QUANTITY_TIERS) {
      try {
        await api.post(`products/${productId}/variations`, {
          regular_price: tier.regular_price,
          sale_price: tier.sale_price,
          status: "publish",
          attributes: [
            { name: ATTR_NAME, option: tier.option },
          ],
        });
        created++;
      } catch (e) {
        console.log(`    ⚠️  Variation ${tier.option} failed: ${e?.response?.data?.message || e.message}`);
      }
    }
    console.log(`  ✅ Created ${created} variations`);

  } catch (e) {
    console.log(`  ❌ Failed: ${e?.response?.data?.message || e.message}`);
  }
}

console.log("\n=== Done ===");
