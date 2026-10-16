import bcrypt from "bcryptjs";
import User from "../../../../src/lib/models/User";
import connectToDatabase from "../../../../src/lib/db";
import { api, body, email, text, ApiError } from "../../../../src/lib/http";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const data = await body(request);
  const name = text(data.name, "name", { max: 100 });
  const address = email(data.email);
  if (
    typeof data.password !== "string" ||
    data.password.length < 8 ||
    data.password.length > 72
  )
    throw new ApiError("Choose a password between 8 and 72 characters.");
  await connectToDatabase();
  if (await User.exists({ email: address }))
    throw new ApiError("An account already exists with this email.", 409);
  await User.create({
    name,
    email: address,
    password: await bcrypt.hash(data.password, 12),
  });
  return Response.json(
    { message: "Your account is ready. Sign in to start shopping." },
    { status: 201 },
  );
});
