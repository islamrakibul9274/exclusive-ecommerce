import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../../src/lib/models/User";
import connectToDatabase from "../../../../src/lib/db";
import { api, body, email, ApiError } from "../../../../src/lib/http";
import { sessionCookie, userDetails } from "../../../../src/lib/auth";
export const runtime = "nodejs";
export const POST = api(async (request) => {
  const data = await body(request);
  const address = email(data.email);
  if (typeof data.password !== "string" || data.password.length > 200)
    throw new ApiError("Enter your password.");
  await connectToDatabase();
  const user = await User.findOne({ email: address });
  if (!user || !(await bcrypt.compare(data.password, user.password)))
    throw new ApiError("The email or password is incorrect.", 401);
  const token = jwt.sign(
    { id: String(user._id), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
  return Response.json(
    { user: userDetails(user) },
    { headers: { "Set-Cookie": sessionCookie(token) } },
  );
});
