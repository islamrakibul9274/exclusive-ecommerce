export const categoryGroups = [
  "All",
  "Gaming",
  "Tech & workspace",
  "Fashion",
  "Home & living",
];
export function groupCategory(category = "") {
  if (/gaming/i.test(category)) return "Gaming";
  if (/fashion|clothing|bag/i.test(category)) return "Fashion";
  if (/home|furniture|lifestyle/i.test(category)) return "Home & living";
  return "Tech & workspace";
}
const editorial = [
  [
    /playstation|ps5/i,
    "playstation",
    "Make room for your next adventure. A console that brings your gaming corner together, whether you’re exploring new worlds or unwinding with a favorite game.",
  ],
  [
    /keyboard/i,
    "keyboard",
    "A daily essential for a better desk. Give work, play, and everything in between a more comfortable place to land.",
  ],
  [
    /gamepad|controller/i,
    "controller",
    "Good games deserve a great companion. Refresh your gaming setup with a controller made for your next session.",
  ],
  [
    /monitor/i,
    "monitor",
    "A fresh perspective for your workspace. Keep your desk focused and your everyday tasks in view.",
  ],
  [
    /bag|duffle/i,
    "duffle",
    "Pack a little possibility. An everyday carry for weekend plans, busy mornings, and everything you want to bring along.",
  ],
  [
    /coat/i,
    "coat",
    "An easy layer with lasting appeal. Bring a little structure to your everyday wardrobe and make getting dressed feel simple.",
  ],
  [
    /chair/i,
    "chair",
    "Settle into your space. A considered addition to the corner where you work, create, and take a moment for yourself.",
  ],
  [
    /bookself|bookshelf|bookcase/i,
    "shelf",
    "A little order, a lot of character. Make a home for the books, objects, and small things that tell your story.",
  ],
  [
    /cooler/i,
    "cooler",
    "A finishing touch for your next build. Bring your components together and give your setup an upgrade.",
  ],
];
export function presentProduct(product) {
  const found = editorial.find(([pattern]) => pattern.test(product.name));
  const original = product.image || "";
  const legacyImage =
    (original.startsWith("/") && !original.startsWith("/images/")) ||
    /i\.ibb\.co/.test(original);
  const image =
    found && legacyImage
      ? `/images/${found[1]}.webp`
      : original || "/images/playstation.webp";
  return {
    ...product,
    _id: String(product._id),
    image,
    originalImage: original,
    description:
      product.description ||
      found?.[2] ||
      "A considered addition to your everyday. Explore this find from the Exclusive collection.",
    group: groupCategory(product.category),
    discount:
      product.oldPrice > product.price
        ? Math.round(
            ((product.oldPrice - product.price) / product.oldPrice) * 100,
          )
        : 0,
    representativeImage: !!(found && legacyImage),
  };
}
export function money(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number(amount) % 1 ? 2 : 0,
  }).format(Number(amount) || 0);
}
export function productId(product) {
  return String(product?._id || product?.id || "");
}
