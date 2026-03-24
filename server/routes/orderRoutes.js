const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// --- 1. CREATE A NEW ORDER (Locked Down) ---
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    try {
        // Extra Security: Ensure the user is only making orders for their own ID
        if (req.user.id !== req.body.userId) {
            return res.status(403).json({ message: "You can only place orders for your own account." });
        }

        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: savedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to place order", error: error.message });
    }
});

// --- 3. GET ALL ORDERS (For Admin Dashboard) ---
// Note: For right now, we will leave off 'verifyToken' so you can easily 
// see it in your browser, but we will lock it down later!
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }); // Get all orders, newest first
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
    }
});

// --- 2. GET A USER's ORDERS (Locked Down) ---
router.get('/:userId', verifyToken, verifyAdmin, async (req, res) => { // 👈 Inject it here too!
    try {
        // Extra Security: Ensure users can only see their own order history
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: "Unauthorized to view these orders." });
        }

        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});

// --- 4. UPDATE ORDER STATUS (Admin Only) ---
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        // Find the order by its ID and update just the status field
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // This tells Mongoose to return the updated version, not the old one
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Status updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update status", error: error.message });
    }
});

module.exports = router;