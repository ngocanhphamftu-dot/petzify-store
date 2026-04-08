import Pkg from "@woocommerce/woocommerce-rest-api";
const WC = Pkg.default || Pkg;
import http from "http";
const orig = http.request.bind(http);
http.request = (opts, cb) => { if(opts?.hostname?.includes('petzifyco')){opts.hostname='127.0.0.1';opts.port=10004;} return orig(opts,cb); };
const api = new WC({url:"http://petzifyco.local",consumerKey:"ck_83d2cdf16249cd6a4e6225cbc2c0b651cb0d1669",consumerSecret:"cs_7c3c899a003116929f0e83b927aea60639e402aa",version:"wc/v3"});

const {data} = await api.get("products", {slug:"if-friends-were-flowers-id-pick-you-personalized-jewelry-dish-gift-for-friend"});
const p = data[0];
console.log("type:", p.type);
p.attributes?.forEach(a => console.log(`"${a.name}" options (${a.options?.length}): [${a.options?.join(", ")}]`));

// Also check variations
const {data: vars} = await api.get(`products/${p.id}/variations`, {per_page:20});
console.log(`\nVariations (${vars.length}):`);
vars.forEach(v => console.log(`  ${v.attributes.map(a=>a.option).join("/")} | $${v.sale_price || v.regular_price}`));
