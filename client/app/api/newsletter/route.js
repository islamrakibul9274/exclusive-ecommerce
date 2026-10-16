import { api, body, email } from "../../../src/lib/http";
import connectToDatabase from "../../../src/lib/db";
import Subscriber from "../../../src/lib/models/Subscriber";
export const POST = api(async (request) => {
  const data = await body(request);
  const address = email(data.email);
  await connectToDatabase();
  await Subscriber.updateOne(
    { email: address },
    { $set: { subscribed: true }, $setOnInsert: { email: address } },
    { upsert: true },
  );
  return Response.json({
    message: "You’re on the list. Thanks for joining Exclusive.",
  });
});
