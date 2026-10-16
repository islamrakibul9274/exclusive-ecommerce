import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    subscribed: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", schema);
