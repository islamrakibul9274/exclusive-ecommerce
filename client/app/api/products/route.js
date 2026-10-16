import connectToDatabase from "../../../src/lib/db";
import { requireUser } from "../../../src/lib/auth";
import { api, body } from "../../../src/lib/http";
import { presentProduct } from "../../../src/lib/catalog";
import { productInput } from "../../../src/lib/product-input";
import Product from "../../../src/lib/models/Product";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = api(async (request) => {
  const all = new URL(request.url).searchParams.get("all") === "true";
  if (all) await requireUser(request, true);
  await connectToDatabase();
  const products = await Product.find(all ? {} : { active: { $ne: false } })
    .sort({ createdAt: -1 })
    .lean();
  return Response.json(products.map(presentProduct));
});
export const POST = api(async (request) => {
  await requireUser(request, true);
  const input = productInput(await body(request));
  const product = await Product.create(input);
  return Response.json(
    { message: "Product added.", product: presentProduct(product.toObject()) },
    { status: 201 },
  );
});
