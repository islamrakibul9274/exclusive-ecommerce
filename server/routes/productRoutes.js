const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware'); // 👈 Import the security bouncers

// --- 1. GET ALL PRODUCTS ---
router.get('/', async (req, res) => {
  try {
    // 👈 Sort by newest first so newly added products appear at the top!
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// --- 2. SEED ROUTE (Quickly populate the database) ---
// Note: Moved this ABOVE the /:id route so Express doesn't confuse "data" for a product ID!
router.get('/data/seed', async (req, res) => {
  try {
    const seedProducts = [
      { name: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, discount: 40, rating: 5, reviews: 88, image: "/gamepad.png", category: "Gaming" },
      { name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, discount: 35, rating: 4, reviews: 75, image: "/keyboard.png", category: "Gaming" },
      { name: "IPS LCD Gaming Monitor", price: 370, oldPrice: 400, discount: 30, rating: 5, reviews: 99, image: "/monitor.png", category: "Computers" },
      { name: "S-Series Comfort Chair", price: 375, oldPrice: 400, discount: 25, rating: 4.5, reviews: 99, image: "/chair.png", category: "Home & Lifestyle" },
      { name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviews: 65, image: "/coat.png", category: "Men's Fashion" },
      { name: "Gucci duffle bag", price: 960, oldPrice: 1160, rating: 4.5, reviews: 65, image: "/bag.png", category: "Woman's Fashion" },
      { name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviews: 65, image: "/cooler.png", category: "Computers" },
      { name: "Small Bookself", price: 360, rating: 5, reviews: 65, image: "/bookshelf.png", category: "Home & Lifestyle" }
    ];

    await Product.deleteMany({}); 
    const createdProducts = await Product.insertMany(seedProducts);
    res.status(201).json({ message: "Database Seeded!", count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: "Seeding Failed", error: error.message });
  }
});

// --- 3. GET SINGLE PRODUCT BY ID ---
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// --- 4. NEW: ADD NEW PRODUCT (Admin Only) ---
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, price, oldPrice, image, category, stock } = req.body;

    // The Discount Math Engine! 🧮
    let calculatedDiscount = 0;
    if (oldPrice && Number(oldPrice) > Number(price)) {
      // e.g., ((100 - 80) / 100) * 100 = 20%
      calculatedDiscount = Math.round(((Number(oldPrice) - Number(price)) / Number(oldPrice)) * 100);
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      discount: calculatedDiscount, // Save the automatic math!
      image,
      category,
      stock: Number(stock) || 10, // Default to 10 if left blank
      rating: 0, 
      reviews: 0
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

module.exports = router;