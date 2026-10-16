import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../src/lib/models/User.js";

// Every run owns a new database. Never write test orders into the live catalog.
assert.ok(process.env.MONGODB_URI, "Configure MONGODB_URI in .env.local first.");
const database = `E2E_${randomUUID().replaceAll("-", "")}`;
const uri = new URL(process.env.MONGODB_URI);
uri.pathname = `/${database}`;
const port = Number(process.env.E2E_PORT || 3005);
const base = `http://127.0.0.1:${port}`;
let server;
let checks = 0;
const password = `Test-${randomUUID()}`;
const credentials = { email: "shopper@example.invalid", password };
const delivery = {
  firstName: "Test Shopper",
  streetAddress: "1 Integration Test Street",
  city: "Dhaka",
  country: "Bangladesh",
  phone: "01000000000",
  email: credentials.email,
};

async function request(path, status, { method = "GET", data, cookie } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(data && { "Content-Type": "application/json" }),
      ...(cookie && { Cookie: cookie }),
    },
    ...(data && { body: JSON.stringify(data) }),
  });
  const payload = await response.json();
  assert.equal(response.status, status, `${method} ${path}: ${payload.message || ""}`);
  checks++;
  return { payload, cookie: response.headers.get("set-cookie")?.split(";")[0] };
}

try {
  await mongoose.connect(uri.toString());
  assert.equal(mongoose.connection.name, database);
  await User.create({
    name: "Test Administrator",
    email: "admin@example.invalid",
    password: await bcrypt.hash(password, 12),
    role: "admin",
  });
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", String(port), "--hostname", "127.0.0.1"], {
    env: { ...process.env, MONGODB_URI: uri.toString() },
    stdio: "ignore",
  });
  server.on("error", () => {});
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error("The isolated Next.js server exited.");
    try {
      ready = (await fetch(base)).ok;
      if (ready) break;
    } catch { /* Wait for the local server to bind its port. */ }
    await delay(250);
  }
  assert.ok(ready, "The isolated Next.js server did not become ready.");
  await request("/api/users/signup", 201, { method: "POST", data: { ...credentials, name: "Test Shopper", role: "admin" } });
  const { cookie: shopper, payload: login } = await request("/api/users/login", 200, { method: "POST", data: credentials });
  assert.equal(login.user.role, "user", "Signup cannot grant administrator access.");
  const { cookie: admin } = await request("/api/users/login", 200, { method: "POST", data: { email: "admin@example.invalid", password } });
  await request("/api/products", 403, { method: "POST", cookie: shopper, data: {} });
  await request("/api/products?all=true", 403, { cookie: shopper });
  await request("/api/contact", 403, { cookie: shopper });
  const productInput = { name: "Test Keyboard", category: "Gaming", price: 100, stock: 5, image: "/images/keyboard.webp", description: "An isolated integration test product." };
  const { payload: created } = await request("/api/products", 201, { method: "POST", cookie: admin, data: productInput });
  const id = created.product._id;
  await request(`/api/products/${id}`, 200, { method: "PATCH", cookie: admin, data: { ...productInput, stock: 6 } });
  const { payload: profile } = await request("/api/users/me", 200, { method: "PATCH", cookie: shopper, data: { name: "Updated Shopper", address: delivery } });
  assert.equal(profile.name, "Updated Shopper");
  assert.equal(profile.address.city, delivery.city);
  assert.equal(profile.password, undefined);
  const { payload: quote } = await request("/api/cart/quote", 200, { method: "POST", data: { items: [{ productId: id, quantity: 2, price: 0.01 }], couponCode: "WELCOME10" } });
  assert.equal(quote.subtotal, 200);
  assert.equal(quote.discountAmount, 20);
  assert.equal(quote.totalAmount, 180);
  const orderInput = { checkoutRequestId: randomUUID(), items: [{ productId: id, quantity: 2, price: 0.01 }], couponCode: "WELCOME10", billingDetails: delivery, paymentMethod: "cod" };
  const { payload: placed } = await request("/api/orders", 201, { method: "POST", cookie: shopper, data: orderInput });
  assert.equal(placed.order.totalAmount, 180);
  assert.equal(placed.order.inventoryReserved, true);
  const { payload: repeated } = await request("/api/orders", 200, { method: "POST", cookie: shopper, data: orderInput });
  assert.equal(repeated.order._id, placed.order._id);
  const { payload: stockAfterOrder } = await request(`/api/products/${id}`, 200);
  assert.equal(stockAfterOrder.stock, 4, "A repeated checkout reserves stock only once.");
  const { payload: history } = await request("/api/orders?mine=true", 200, { cookie: shopper });
  assert.equal(history.length, 1);
  await request(`/api/orders/detail/${placed.order._id}`, 200, { cookie: shopper });
  await request(`/api/orders/${placed.order._id}/status`, 200, { method: "PATCH", cookie: shopper, data: { status: "Cancelled" } });
  const { payload: restored } = await request(`/api/products/${id}`, 200);
  assert.equal(restored.stock, 6);
  await request(`/api/orders/${placed.order._id}/status`, 403, { method: "PATCH", cookie: shopper, data: { status: "Cancelled" } });
  const { payload: shippingOrder } = await request("/api/orders", 201, { method: "POST", cookie: shopper, data: { ...orderInput, checkoutRequestId: randomUUID() } });
  await request(`/api/orders/${shippingOrder.order._id}/status`, 403, { method: "PATCH", cookie: shopper, data: { status: "Shipped" } });
  for (const status of ["Shipped", "Delivered"])
    await request(`/api/orders/${shippingOrder.order._id}/status`, 200, { method: "PATCH", cookie: admin, data: { status } });
  await request("/api/users/signup", 201, { method: "POST", data: { email: "other@example.invalid", password, name: "Other Shopper" } });
  const { cookie: other } = await request("/api/users/login", 200, { method: "POST", data: { email: "other@example.invalid", password } });
  await request(`/api/orders/detail/${shippingOrder.order._id}`, 404, { cookie: other });
  await request("/api/orders", 400, { method: "POST", cookie: shopper, data: { ...orderInput, checkoutRequestId: randomUUID(), paymentMethod: "card" } });
  await request("/api/cart/quote", 400, { method: "POST", data: { items: [{ productId: id, quantity: 10 }] } });
  await request("/api/contact", 201, { method: "POST", data: { name: delivery.firstName, email: delivery.email, subject: "Integration test", message: "Testing the isolated support inbox." } });
  const { payload: messages } = await request("/api/contact", 200, { cookie: admin });
  assert.equal(messages.length, 1);
  const { payload: read } = await request(`/api/contact/${messages[0]._id}`, 200, { method: "PATCH", cookie: admin, data: {} });
  assert.equal(read.read, true);
  for (let i = 0; i < 2; i++) await request("/api/newsletter", 200, { method: "POST", data: { email: credentials.email } });
  assert.equal(await mongoose.connection.collection("subscribers").countDocuments(), 1);
  await request(`/api/products/${id}`, 200, { method: "PATCH", cookie: admin, data: { active: false } });
  await request(`/api/products/${id}`, 404);
  const { payload: catalog } = await request("/api/products", 200);
  assert.equal(catalog.length, 0);
  await request("/api/users/me", 400, { method: "PATCH", cookie: shopper, data: { currentPassword: "incorrect", newPassword: password + "-new" } });
  await request("/api/users/me", 200, { method: "PATCH", cookie: shopper, data: { currentPassword: password, newPassword: password + "-new" } });
  await request("/api/users/login", 401, { method: "POST", data: credentials });
  await request("/api/users/login", 200, { method: "POST", data: { ...credentials, password: password + "-new" } });
  const { cookie: logout } = await request("/api/users/logout", 200, { method: "POST", cookie: shopper });
  assert.equal(logout, "exclusive-session=");
  console.log(`${checks} authenticated integration checks passed in an isolated database. No live catalog changes or payments.`);
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.name === database)
      await mongoose.connection.dropDatabase();
  } finally {
    await mongoose.disconnect();
  }
}
