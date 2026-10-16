import { ApiError } from "./http.js";
export function normalizeItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50)
    throw new ApiError("Your bag is empty or contains too many items.");
  const grouped = new Map();
  for (const item of items) {
    const id = String(item.productId || item._id || "");
    const quantity = Number(item.quantity);
    if (
      !/^[a-f\d]{24}$/i.test(id) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 10
    )
      throw new ApiError(
        "Please use valid products and quantities between 1 and 10.",
      );
    grouped.set(id, (grouped.get(id) || 0) + quantity);
    if (grouped.get(id) > 10)
      throw new ApiError("A maximum of 10 of each product can be ordered.");
  }
  return Array.from(grouped, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}
