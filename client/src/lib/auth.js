import jwt from "jsonwebtoken";
import connectToDatabase from "./db";
import User from "./models/User";
import { ApiError } from "./http";
export function readAuth(request) {
  const header = request.headers.get("authorization");
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith("exclusive-session="));
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : cookie?.slice("exclusive-session=".length);
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}
export async function requireUser(request, admin = false) {
  const payload = readAuth(request);
  if (!payload?.id) throw new ApiError("Please sign in to continue.", 401);
  await connectToDatabase();
  const user = await User.findById(payload.id);
  if (!user) throw new ApiError("Please sign in again.", 401);
  if (admin && user.role !== "admin")
    throw new ApiError("Admin access is required.", 403);
  return user;
}
export function sessionCookie(token, maxAge = 604800) {
  return `exclusive-session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}
export function userDetails(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address || {},
  };
}
