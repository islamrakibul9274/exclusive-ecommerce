import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    subtotal: Number,
    discountAmount: { type: Number, default: 0 },
    shippingAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: String,
    billingDetails: {
      firstName: { type: String, required: true },
      streetAddress: { type: String, required: true },
      city: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      country: String,
      postalCode: String,
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    paymentIntentId: { type: String, unique: true, sparse: true },
    paymentStatus: { type: String, default: "pending" },
    checkoutRequestId: { type: String, unique: true, sparse: true },
    inventoryReserved: { type: Boolean, default: false },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true },
);
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
