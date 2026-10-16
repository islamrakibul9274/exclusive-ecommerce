import Stripe from "stripe";
import { requireUser } from "../../../../src/lib/auth";
import { api, body } from "../../../../src/lib/http";
import { quoteCart } from "../../../../src/lib/commerce";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const user = await requireUser(request);
  const data = await body(request);
  const quote = await quoteCart(data.items, data.couponCode);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(quote.totalAmount * 100),
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { userId: String(user._id), cartHash: quote.cartHash },
  });
  return Response.json({ clientSecret: intent.client_secret, quote });
});
