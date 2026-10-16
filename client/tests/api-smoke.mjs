import assert from "node:assert/strict";
import fs from "node:fs";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3004";
let checks = 0;
async function request(path, status, options) {
  const response = await fetch(base + path, options);
  assert.equal(response.status, status, `${options?.method || "GET"} ${path}`);
  checks++;
  return response;
}
const products = await (await request("/api/products", 200)).json();
assert.ok(Array.isArray(products) && products.length > 0);
for (const p of products) {
  assert.match(p._id, /^[a-f\d]{24}$/i);
  assert.ok(Number.isFinite(p.price));
  assert.ok(p.stock >= 0);
  if (p.image.startsWith("/images/"))
    assert.ok(fs.existsSync("public" + p.image));
}
const p = products.find((p) => p.stock > 0);
const post = (data) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
const quote = await (
  await request(
    "/api/cart/quote",
    200,
    post({
      items: [{ productId: p._id, quantity: 1, price: 0.01 }],
      couponCode: "WELCOME10",
    }),
  )
).json();
assert.equal(
  quote.items[0].price,
  p.price,
  "The browser cannot override product prices",
);
assert.equal(quote.subtotal, p.price);
assert.ok(quote.totalAmount > 0);
await request(
  "/api/cart/quote",
  400,
  post({ items: [{ productId: p._id, quantity: 0 }] }),
);
await request(
  "/api/cart/quote",
  400,
  post({ items: [{ productId: p._id, quantity: 1 }], couponCode: "FAKE100" }),
);
await request("/api/products/not-an-id", 404);
for (const path of [
  "/api/users/me",
  "/api/orders",
  "/api/contact",
  "/api/products?all=true",
  `/api/orders/detail/${p._id}`,
])
  await request(path, 401);
for (const path of [
  "/api/orders",
  "/api/payments/create-payment-intent",
  "/api/products",
  "/api/uploads/image",
])
  await request(path, 401, post({}));
await request("/api/newsletter", 400, post({ email: "not-an-email" }));
await request(
  "/api/contact",
  400,
  post({ name: "A", email: "invalid", subject: "Test", message: "invalid" }),
);
await request(
  "/api/users/signup",
  400,
  post({ name: "Test", email: "not-an-email", password: "123" }),
);
for (const path of [
  "/",
  "/shop",
  "/shop?category=Gaming&q=controller",
  "/wishlist",
  "/cart",
  "/checkout",
  "/about",
  "/contact",
  "/help",
  "/policies",
  "/credits",
  "/login",
  "/signup",
  "/account",
  `/product/${p._id}`,
])
  await request(path, 200);
for (const file of fs
  .readdirSync("public/images")
  .filter((p) => p.endsWith(".webp")))
  await request("/images/" + file, 200);
console.log(
  `${checks} read-only HTTP checks passed. Catalog: ${products.length} products. No records created, orders placed, or payments made.`,
);
