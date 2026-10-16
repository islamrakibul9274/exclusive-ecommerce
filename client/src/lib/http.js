export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}
export function api(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      const status =
        error.status ||
        (error.name === "ValidationError"
          ? 400
          : error.code === 11000
            ? 409
            : 500);
      if (status === 500) console.error("API request failed:", error.name);
      return Response.json(
        {
          message:
            status === 500
              ? "Something went wrong. Please try again."
              : error.code === 11000
                ? "This record already exists."
                : error.message,
        },
        { status },
      );
    }
  };
}
export async function body(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Please send valid form data.");
  }
}
export function text(value, name, { min = 1, max = 300 } = {}) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  )
    throw new ApiError(`Please enter a valid ${name}.`);
  return value.trim();
}
export function email(value) {
  const result = text(value, "email address", { max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result))
    throw new ApiError("Please enter a valid email address.");
  return result;
}
