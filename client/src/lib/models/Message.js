import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);
export default mongoose.models.Message || mongoose.model("Message", schema);
