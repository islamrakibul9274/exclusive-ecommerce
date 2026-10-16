import { api, body } from "../../../../src/lib/http";
import connectToDatabase from "../../../../src/lib/db";
import { quoteCart } from "../../../../src/lib/commerce";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const data = await body(request);
  await connectToDatabase();
  return Response.json(await quoteCart(data.items, data.couponCode));
});
