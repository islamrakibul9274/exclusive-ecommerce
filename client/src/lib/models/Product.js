import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: Number,
    discount: Number,
    image: { type: String, required: true },
    images: [String],
    description: String,
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    stock: { type: Number, default: 10, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
