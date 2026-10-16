import { text, ApiError } from "./http";
export function productInput(data) {
  const price = Number(data.price),
    stock = Number(data.stock),
    oldPrice = data.oldPrice ? Number(data.oldPrice) : null;
  if (
    !Number.isFinite(price) ||
    price <= 0 ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < price))
  )
    throw new ApiError(
      "Check the price, compare-at price, and stock quantity.",
    );
  const image = text(data.image, "image URL", { max: 2048 });
  if (!image.startsWith("/") && !image.startsWith("https://"))
    throw new ApiError("Use a local image or an HTTPS image URL.");
  return {
    name: text(data.name, "product name", { max: 150 }),
    price,
    oldPrice,
    stock,
    category: text(data.category, "category", { max: 100 }),
    image,
    description: String(data.description || "")
      .trim()
      .slice(0, 3000),
    discount:
      oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0,
  };
}
