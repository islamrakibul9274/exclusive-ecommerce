import { requireUser } from "../../../../src/lib/auth";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

const maxUploadBytes = 3 * 1024 * 1024;

export async function POST(request) {
  try {
    await requireUser(request, true);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: error.status || 500 },
    );
  }

  try {
    const formData = await request.formData();
    const image = formData.get("image");
    if (!(image instanceof File) || !image.type.startsWith("image/")) {
      return Response.json(
        { message: "Choose a valid image file." },
        { status: 400 },
      );
    }
    if (image.size > maxUploadBytes) {
      return Response.json(
        { message: "Image must be 3 MB or smaller." },
        { status: 413 },
      );
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Missing required Cloudinary environment variables.");
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signature = createHash("sha1")
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest("hex");
    const payload = new FormData();
    payload.set(
      "file",
      `data:${image.type};base64,${Buffer.from(await image.arrayBuffer()).toString("base64")}`,
    );
    payload.set("timestamp", timestamp);
    payload.set("api_key", apiKey);
    payload.set("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: "POST",
        body: payload,
      },
    );
    const result = await response.json();
    if (!response.ok || !result.secure_url) {
      return Response.json(
        { message: "Image upload failed." },
        { status: 502 },
      );
    }

    return Response.json({ url: result.secure_url });
  } catch (error) {
    console.error("Image upload failed:", error.name);
    return Response.json(
      { message: "Unable to upload image." },
      { status: 500 },
    );
  }
}
