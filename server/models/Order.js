const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Link to the User who made the purchase
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Array of items in their cart at the time of checkout
  items: [
    {
      productId: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
      image: { type: String }
    }
  ],
  
  totalAmount: { type: Number, required: true },
  
  // The shipping info from the checkout form
  billingDetails: {
    firstName: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true }
  },
  
  paymentMethod: { type: String, default: 'cash' },
  status: { type: String, default: 'Pending' } // Can be updated to 'Shipped' or 'Delivered' later
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);