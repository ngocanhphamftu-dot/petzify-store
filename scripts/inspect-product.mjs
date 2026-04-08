import https from "https";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    }).on("error", reject);
  });
}

const data = await fetchJson("https://macorner.co/collections/jewelry-dish/products.json?limit=4");

data.products.forEach((p, i) => {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`Product ${i+1}: ${p.title}`);
  console.log(`Handle: ${p.handle}`);
  console.log(`Price: $${p.variants[0]?.price} / Compare: $${p.variants[0]?.compare_at_price}`);
  console.log(`\nOptions (${p.options.length}):`);
  p.options.forEach(o => {
    console.log(`  - ${o.name}: ${o.values.join(", ")}`);
  });
  console.log(`\nVariants (${p.variants.length} total, showing first 3):`);
  p.variants.slice(0, 3).forEach(v => {
    console.log(`  - ${v.title} | price: $${v.price} | sku: ${v.sku}`);
  });
  console.log(`\nImages: ${p.images.length}`);
});
