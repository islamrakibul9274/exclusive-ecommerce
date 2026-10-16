import mongoose from "mongoose";
import connectToDatabase from "../../../../src/lib/db";
import { requireUser } from "../../../../src/lib/auth";
import { api, body, ApiError } from "../../../../src/lib/http";
import { presentProduct } from "../../../../src/lib/catalog";
import { productInput } from "../../../../src/lib/product-input";
import Product from "../../../../src/lib/models/Product";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function productId(params) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError("Product not found.", 404);
  return id;
}
export const GET = api(async (_request, { params }) => {
  await connectToDatabase();
  const product = await Product.findOne({
    _id: await productId(params),
    active: { $ne: false },
  }).lean();
  if (!product) throw new ApiError("Product not found.", 404);
  return Response.json(presentProduct(product));
});
export const PATCH = api(async (request, { params }) => {
  await requireUser(request, true);
  const data = await body(request);
  const update =
    typeof data.active === "boolean" && Object.keys(data).length === 1
      ? { active: data.active }
      : productInput(data);
  const product = await Product.findByIdAndUpdate(
    await productId(params),
    { $set: update },
    { new: true, runValidators: true },
  ).lean();
  if (!product) throw new ApiError("Product not found.", 404);
  return Response.json(presentProduct(product));
});
