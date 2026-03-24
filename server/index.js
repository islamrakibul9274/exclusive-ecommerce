const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Import it at the top with your other routes
const paymentRoutes = require('./routes/paymentRoutes');

// 2. Use it down below
app.use('/api/payments', paymentRoutes);

// Import the routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ ExclusiveDB Connected Successfully!"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Basic Route to test the server
app.get('/', (req, res) => {
  res.send('Exclusive E-Commerce API is running!');
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server is running on port: ${port}`);
});