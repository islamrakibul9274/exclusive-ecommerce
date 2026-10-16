import { api, body, text, email, ApiError } from "../../../src/lib/http";
import { requireUser } from "../../../src/lib/auth";
import connectToDatabase from "../../../src/lib/db";
import Message from "../../../src/lib/models/Message";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const data = await body(request);
  if (data.website) throw new ApiError("Please try again.");
  const input = {
    name: text(data.name, "name", { max: 100 }),
    email: email(data.email),
    subject: text(data.subject, "subject", { max: 150 }),
    message: text(data.message, "message", { min: 10, max: 4000 }),
  };
  await connectToDatabase();
  const recent = await Message.countDocuments({
    email: input.email,
    createdAt: { $gte: new Date(Date.now() - 3600000) },
  });
  if (recent >= 5)
    throw new ApiError(
      "You have sent several messages. Please try again in an hour.",
      429,
    );
  await Message.create(input);
  return Response.json(
    { message: "Your message has been saved in our support inbox." },
    { status: 201 },
  );
});
export const GET = api(async (request) => {
  await requireUser(request, true);
  return Response.json(
    await Message.find().sort({ createdAt: -1 }).limit(100).lean(),
  );
});
