import Pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = Pkg.default || Pkg;
import http from "http";
import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Patch http.request for LocalWP
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

const WP_URL = "http://127.0.0.1:10004";
const WP_USER = "admin";
// WordPress Application Password - need to set this
const WP_APP_PASS = process.env.WP_APP_PASS || "";

// Fetch JSON from URL
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

// Download image buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
    }).on("error", reject);
  });
}

// Upload image to WordPress Media via REST API using Basic Auth with app password
function uploadImageToWP(imageUrl, filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const { buffer, contentType } = await downloadImage(imageUrl);
      const auth = Buffer.from(`${WP_USER}:${WP_APP_PASS}`).toString("base64");

      const options = {
        hostname: "127.0.0.1",
        port: 10004,
        path: "/wp-json/wp/v2/media",
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Type": contentType,
          "Content-Length": buffer.length,
        },
      };

      const req = original(options, (res) => {
        let data = "";
        res.on("data", (c) => data += c);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.id) resolve(json);
            else reject(new Error(JSON.stringify(json)));
          } catch (e) { reject(e); }
        });
      });
      req.on("error", reject);
      req.write(buffer);
      req.end();
    } catch (e) { reject(e); }
  });
}

// === MAIN ===
const COLLECTION = "jewelry-dish";
const CATEGORY_ID = 21;  // Jewelry Dishes
const LIMIT = 4;

console.log(`Fetching ${LIMIT} products from macorner.co/${COLLECTION}...\n`);

const data = await fetchJson(`https://macorner.co/collections/${COLLECTION}/products.json?limit=${LIMIT}`);
const products = data.products;

console.log(`Found ${products.length} products:\n`);
products.forEach((p, i) => {
  console.log(`${i+1}. ${p.title}`);
  console.log(`   Price: $${p.variants[0]?.price}`);
  console.log(`   Images: ${p.images.length}`);
});

if (!WP_APP_PASS) {
  console.log("\n⚠️  WP_APP_PASS not set — skipping upload.");
  console.log("Run: WP_APP_PASS=xxxx node scripts/fetch-and-create-products.mjs");
  console.log("\nProduct data collected. Here are the image URLs to use:");
  products.forEach((p, i) => {
    console.log(`\nProduct ${i+1}: ${p.title}`);
    p.images.slice(0, 4).forEach((img, j) => console.log(`  Image ${j+1}: ${img.src}`));
  });
  process.exit(0);
}

console.log("\nUploading images and creating products...\n");

for (const product of products) {
  console.log(`\nProcessing: ${product.title}`);

  const imageIds = [];
  const imgs = product.images.slice(0, 4);

  for (let i = 0; i < imgs.length; i++) {
    const imgUrl = imgs[i].src.split("?")[0]; // remove query params
    const ext = imgUrl.split(".").pop() || "jpg";
    const filename = `${product.handle}-${i+1}.${ext}`;
    try {
      process.stdout.write(`  Uploading image ${i+1}/${imgs.length}... `);
      const media = await uploadImageToWP(imgUrl, filename);
      imageIds.push(media.id);
      console.log(`✅ (ID: ${media.id})`);
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
  }

  if (imageIds.length === 0) {
    console.log("  No images uploaded, skipping product.");
    continue;
  }

  const desc = product.body_html?.replace(/<[^>]+>/g, "").substring(0, 500) || "";
  const price = product.variants[0]?.price || "29.95";

  try {
    const { data: created } = await api.post("products", {
      name: product.title,
      status: "publish",
      description: desc,
      short_description: `Personalized ${product.title}`,
      regular_price: price,
      categories: [{ id: CATEGORY_ID }],
      images: imageIds.map(id => ({ id })),
    });
    console.log(`  ✅ Product created: ${created.name} (ID: ${created.id})`);
  } catch (e) {
    console.log(`  ❌ Product creation failed: ${e?.response?.data?.message || e.message}`);
  }
}

console.log("\n=== Done ===");
