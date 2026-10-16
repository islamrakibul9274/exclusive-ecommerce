import mongoose from "mongoose";
import Stripe from "stripe";
import { requireUser } from "../../../src/lib/auth";
import { api, body, ApiError } from "../../../src/lib/http";
import { quoteCart, billingDetails } from "../../../src/lib/commerce";
import Order from "../../../src/lib/models/Order";
import Product from "../../../src/lib/models/Product";
import { verifyPayment } from "../../../src/lib/payment-validation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = api(async (request) => {
  const user = await requireUser(request);
  const mine = new URL(request.url).searchParams.get("mine") === "true";
  if (!mine && user.role !== "admin")
    throw new ApiError("Admin access is required.", 403);
  return Response.json(
    await Order.find(mine ? { userId: user._id } : {})
      .sort({ createdAt: -1 })
      .lean(),
  );
});
export const POST = api(async (request) => {
  const user = await requireUser(request);
  const data = await body(request);
  const billing = billingDetails(data.billingDetails);
  if (
    typeof data.checkoutRequestId !== "string" ||
    !/^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(
      data.checkoutRequestId,
    )
  ) {
    throw new ApiError(
      "Your checkout session is invalid. Refresh the page and try again.",
    );
  }
  const existingRequest = await Order.findOne({
    checkoutRequestId: data.checkoutRequestId,
    userId: user._id,
  });
  if (existingRequest) return Response.json({ order: existingRequest });
  if (data.paymentIntentId) {
    const existing = await Order.findOne({
      paymentIntentId: data.paymentIntentId,
    });
    if (existing) {
      if (String(existing.userId) !== String(user._id))
        throw new ApiError("Payment belongs to another account.", 403);
      return Response.json({ order: existing });
    }
  }
  const quote = await quoteCart(data.items, data.couponCode);
  const card = data.paymentMethod === "card";
  if (card) {
    if (!data.paymentIntentId)
      throw new ApiError("Complete your card payment first.");
    const intent = await new Stripe(
      process.env.STRIPE_SECRET_KEY,
    ).paymentIntents.retrieve(data.paymentIntentId);
    verifyPayment(intent, quote, user._id);
  }
  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      for (const line of quote.items) {
        const result = await Product.updateOne(
          {
            _id: line.productId,
            stock: { $gte: line.quantity },
            active: { $ne: false },
          },
          { $inc: { stock: -line.quantity } },
          { session },
        );
        if (!result.modifiedCount)
          throw new ApiError(
            `${line.name} just sold out. Please update your bag.`,
            409,
          );
      }
      const { cartHash: _cartHash, ...totals } = quote;
      [order] = await Order.create(
        [
          {
            ...totals,
            userId: user._id,
            billingDetails: billing,
            paymentMethod: card ? "Credit Card" : "Cash on Delivery",
            paymentStatus: card ? "paid" : "pending",
            inventoryReserved: true,
            checkoutRequestId: data.checkoutRequestId,
            status: "Pending",
            ...(card ? { paymentIntentId: data.paymentIntentId } : {}),
          },
        ],
        { session },
      );
    });
  } finally {
    await session.endSession();
  }
  return Response.json(
    { message: "Your order is confirmed.", order },
    { status: 201 },
  );
});
