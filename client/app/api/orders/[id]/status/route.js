import mongoose from "mongoose";
import { requireUser } from "../../../../../src/lib/auth";
import { api, body, ApiError } from "../../../../../src/lib/http";
import Order from "../../../../../src/lib/models/Order";
import Product from "../../../../../src/lib/models/Product";
export const runtime = "nodejs";
export const PATCH = api(async (request, { params }) => {
  const user = await requireUser(request);
  const { id } = await params;
  const { status } = await body(request);
  if (!mongoose.isValidObjectId(id))
    throw new ApiError("Order not found.", 404);
  const session = await mongoose.startSession();
  let updated;
  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);
      if (!order) throw new ApiError("Order not found.", 404);
      const owner = String(order.userId) === String(user._id);
      if (
        user.role !== "admin" &&
        (!owner ||
          status !== "Cancelled" ||
          order.status !== "Pending" ||
          order.paymentStatus === "paid" ||
          order.paymentMethod === "Credit Card")
      )
        throw new ApiError(
          "This order cannot be changed. Please contact support.",
          403,
        );
      const transitions = {
        Pending: ["Shipped", "Cancelled"],
        Paid: ["Shipped"],
        Shipped: ["Delivered"],
        Delivered: [],
        Cancelled: [],
      };
      if (!transitions[order.status]?.includes(status))
        throw new ApiError("That status change is not available.");
      if (status === "Cancelled") {
        if (
          order.paymentStatus === "paid" ||
          order.paymentMethod === "Credit Card"
        )
          throw new ApiError(
            "Paid orders need a refund arranged through support before cancellation.",
          );
        // Orders imported from the previous app did not reserve inventory.
        if (order.inventoryReserved) {
          for (const item of order.items) {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: item.quantity } },
              { session },
            );
          }
          order.inventoryReserved = false;
        }
      }
      order.status = status;
      await order.save({ session });
      updated = order;
    });
  } finally {
    await session.endSession();
  }
  return Response.json({ message: "Order updated.", order: updated });
});
