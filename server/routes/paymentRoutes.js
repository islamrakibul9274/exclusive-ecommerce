const express = require('express');
const router = express.Router();
// Initialize Stripe with your secret key from the .env file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { price } = req.body;
    
    // Stripe expects the price in cents! (e.g., $50.00 = 5000 cents)
    const amount = parseInt(price * 100); 

    if (!price || amount < 1) {
        return res.status(400).json({ message: "Invalid price amount" });
    }

    // Tell Stripe to prepare for a payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card'] // We are accepting credit cards
    });

    // Send the secret code back to the React frontend
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment intent", error: error.message });
  }
});

module.exports = router;