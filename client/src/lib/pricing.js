import { ApiError } from "./http.js";
export function calculateTotals(subtotalCents, coupon = "") {
  const code = String(coupon || "")
    .trim()
    .toUpperCase();
  if (code && code !== "WELCOME10")
    throw new ApiError("That offer code is not valid. Try WELCOME10.");
  const discountCents =
    code === "WELCOME10" ? Math.min(5000, Math.round(subtotalCents * 0.1)) : 0;
  const shippingCents = subtotalCents >= 15000 ? 0 : 900;
  return {
    subtotal: subtotalCents / 100,
    discountAmount: discountCents / 100,
    shippingAmount: shippingCents / 100,
    totalAmount: (subtotalCents - discountCents + shippingCents) / 100,
    couponCode: code,
  };
}
