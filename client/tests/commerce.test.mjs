import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotals } from "../src/lib/pricing.js";
import { normalizeItems } from "../src/lib/cart-validation.js";
import { verifyPayment } from "../src/lib/payment-validation.js";
const id = "69c24513314037ad9ed52f8a";
test("shipping threshold is based on original subtotal and welcome discount is capped", () => {
  assert.deepEqual(calculateTotals(14999, " welcome10 "), {
    subtotal: 149.99,
    discountAmount: 15,
    shippingAmount: 9,
    totalAmount: 143.99,
    couponCode: "WELCOME10",
  });
  assert.equal(calculateTotals(15000, "WELCOME10").shippingAmount, 0);
  assert.equal(calculateTotals(100000, "WELCOME10").discountAmount, 50);
  assert.equal(calculateTotals(12001).totalAmount, 129.01);
});
test("invalid coupons are rejected instead of silently altering the price", () =>
  assert.throws(() => calculateTotals(10000, "FREE100")));
test("cart quantities are merged and never accepted from malformed records", () => {
  assert.deepEqual(
    normalizeItems([
      { productId: id, quantity: 2 },
      { _id: id, quantity: 3 },
    ]),
    [{ productId: id, quantity: 5 }],
  );
  for (const quantity of [0, -1, 1.5, 11, Infinity, "invalid"])
    assert.throws(() => normalizeItems([{ productId: id, quantity }]));
  assert.throws(() => normalizeItems([{ productId: "fake", quantity: 1 }]));
  assert.throws(() => normalizeItems([]));
  assert.throws(() =>
    normalizeItems([
      { productId: id, quantity: 6 },
      { productId: id, quantity: 6 },
    ]),
  );
});
test("a paid order requires a matching amount, customer, cart fingerprint, and currency", () => {
  const quote = { totalAmount: 120.5, cartHash: "verified-cart" };
  const valid = {
    status: "succeeded",
    amount_received: 12050,
    currency: "usd",
    metadata: { userId: "customer", cartHash: "verified-cart" },
  };
  assert.equal(verifyPayment(valid, quote, "customer"), true);
  for (const patch of [
    { status: "processing" },
    { amount_received: 1 },
    { currency: "eur" },
    { metadata: { userId: "other", cartHash: "verified-cart" } },
    { metadata: { userId: "customer", cartHash: "changed-cart" } },
    { metadata: null },
  ])
    assert.throws(() =>
      verifyPayment({ ...valid, ...patch }, quote, "customer"),
    );
});
