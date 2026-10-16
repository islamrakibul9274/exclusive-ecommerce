import { ApiError } from "./http.js";
export function verifyPayment(intent, quote, userId) {
  if (
    intent.status !== "succeeded" ||
    intent.amount_received !== Math.round(quote.totalAmount * 100) ||
    intent.currency !== "usd" ||
    intent.metadata?.userId !== String(userId) ||
    intent.metadata?.cartHash !== quote.cartHash
  )
    throw new ApiError(
      "The payment could not be verified. Please contact support.",
    );
  return true;
}
