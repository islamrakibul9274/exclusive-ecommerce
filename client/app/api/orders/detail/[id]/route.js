import mongoose from "mongoose";
import { requireUser } from "../../../../../src/lib/auth";
import { api, ApiError } from "../../../../../src/lib/http";
import Order from "../../../../../src/lib/models/Order";
export const runtime = "nodejs";
export const GET = api(async (request, { params }) => {
  const user = await requireUser(request);
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError("Order not found.", 404);
  const order = await Order.findById(id).lean();
  if (
    !order ||
    (String(order.userId) !== String(user._id) && user.role !== "admin")
  )
    throw new ApiError("Order not found.", 404);
  return Response.json(order);
});
