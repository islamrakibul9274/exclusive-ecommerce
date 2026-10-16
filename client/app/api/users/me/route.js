import bcrypt from "bcryptjs";
import { requireUser, userDetails } from "../../../../src/lib/auth";
import { api, body, text, ApiError } from "../../../../src/lib/http";
export const runtime = "nodejs";
export const GET = api(async (request) =>
  Response.json(userDetails(await requireUser(request))),
);
export const PATCH = api(async (request) => {
  const user = await requireUser(request);
  const data = await body(request);
  if (data.name !== undefined)
    user.name = text(data.name, "name", { max: 100 });
  if (data.address)
    user.address = {
      streetAddress: String(data.address.streetAddress || "").slice(0, 250),
      city: String(data.address.city || "").slice(0, 100),
      country: String(data.address.country || "").slice(0, 80),
      postalCode: String(data.address.postalCode || "").slice(0, 20),
      phone: String(data.address.phone || "").slice(0, 30),
    };
  if (data.newPassword) {
    if (
      String(data.newPassword).length < 8 ||
      String(data.newPassword).length > 72
    )
      throw new ApiError("Choose a password between 8 and 72 characters.");
    if (
      !data.currentPassword ||
      !(await bcrypt.compare(data.currentPassword, user.password))
    )
      throw new ApiError("Your current password is incorrect.");
    user.password = await bcrypt.hash(data.newPassword, 12);
  }
  await user.save();
  return Response.json(userDetails(user));
});
