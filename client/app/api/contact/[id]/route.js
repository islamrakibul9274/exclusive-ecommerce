import { requireUser } from "../../../../src/lib/auth";
import { api, ApiError } from "../../../../src/lib/http";
import Message from "../../../../src/lib/models/Message";
import mongoose from "mongoose";
export const PATCH = api(async (request, { params }) => {
  await requireUser(request, true);
  const { id } = await params;
  if (!mongoose.isValidObjectId(id))
    throw new ApiError("Message not found.", 404);
  const message = await Message.findByIdAndUpdate(
    id,
    { read: true },
    { new: true },
  );
  if (!message) throw new ApiError("Message not found.", 404);
  return Response.json(message);
});
