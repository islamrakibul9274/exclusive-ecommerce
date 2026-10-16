import { createHash } from "node:crypto";
import Product from "./models/Product";
import { ApiError, text, email } from "./http";
import { presentProduct } from "./catalog";
import { calculateTotals } from "./pricing";
import { normalizeItems } from "./cart-validation";
export async function quoteCart(items, coupon) {
  const normalized = normalizeItems(items);
  const products = await Product.find({
    _id: { $in: normalized.map((i) => i.productId) },
    active: { $ne: false },
  }).lean();
  const lines = normalized.map((item) => {
    const product = products.find((p) => String(p._id) === item.productId);
    if (!product)
      throw new ApiError("A product in your bag is no longer available.");
    if (product.stock < item.quantity)
      throw new ApiError(
        `${product.name} has only ${product.stock} left in stock.`,
      );
    return {
      productId: item.productId,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: presentProduct(product).image,
    };
  });
  const subtotalCents = lines.reduce(
    (sum, i) => sum + Math.round(i.price * 100) * i.quantity,
    0,
  );
  const totals = calculateTotals(subtotalCents, coupon);
  const cartHash = createHash("sha256")
    .update(
      JSON.stringify({
        items: lines.map((i) => [i.productId, i.quantity, i.price]).sort(),
        total: totals.totalAmount,
        coupon: totals.couponCode,
      }),
    )
    .digest("hex");
  return { items: lines, ...totals, cartHash };
}
export function billingDetails(data) {
  return {
    firstName: text(data?.firstName, "full name", { max: 100 }),
    streetAddress: text(data?.streetAddress, "street address", { max: 250 }),
    city: text(data?.city, "city", { max: 100 }),
    phone: text(data?.phone, "phone number", { min: 6, max: 30 }),
    email: email(data?.email),
    country: text(data?.country || "Bangladesh", "country", { max: 80 }),
    postalCode: String(data?.postalCode || "").slice(0, 20),
  };
}
