const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number }, // e.g., $1160 crossed out
  discount: { type: Number }, // e.g., 35 for a -35% badge
  image: { type: String, required: true }, // ImgBB URL
  category: { type: String, required: true },
  rating: { type: Number, default: 0 }, // 1 to 5 stars
  reviews: { type: Number, default: 0 }, // Total number of reviews
  stock: { type: Number, default: 10 } // To prevent ordering out-of-stock items
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);