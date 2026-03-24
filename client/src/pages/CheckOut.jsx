import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosSecure from '../api/axiosSecure';
import toast from 'react-hot-toast';

import { CardElement, useElements, useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// 1. INITIALIZE STRIPE HERE (Paste your publishable key!)
const stripePromise = loadStripe('pk_test_51TEQ2gRqg3b6rhHt1Ci7tYEpQ6AbVXpKOgvC5yOxuByRJ6OCmkQiQ1Tgz7MavBPuWYR1IixW2GZVBZ33F8ESoe46003l0dxKNC');

const CheckoutForm = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  
  // 👈 NEW: State to track which payment method the user wants
  const [paymentMethod, setPaymentMethod] = useState('cod'); 

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 0; 
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) return toast.error("Your cart is empty!");
    if (!user) return toast.error("Please log in to place an order!");

    setLoading(true);
    const form = e.target;
    
    // Prepare the order data
    const orderData = {
      userId: user.id,
      items: cart.map(item => ({
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount: total,
      billingDetails: {
        firstName: form.firstName.value,
        streetAddress: form.streetAddress.value,
        city: form.city.value,
        phone: form.phone.value,
        email: form.email.value
      },
      // 👈 Set the method and status dynamically based on their choice!
      paymentMethod: paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery',
      status: paymentMethod === 'card' ? 'Paid' : 'Pending' 
    };

    try {
      // --- BRANCH A: CREDIT CARD LOGIC ---
      if (paymentMethod === 'card') {
        if (!stripe || !elements) return; // Safety check

        // Step 1: Get the Secret Code
        const intentRes = await axiosSecure.post('/payments/create-payment-intent', { price: total });
        const clientSecret = intentRes.data.clientSecret;

        // Step 2: Process the credit card
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: form.firstName.value,
              email: form.email.value,
            },
          },
        });

        if (paymentResult.error) {
          toast.error(paymentResult.error.message);
          setLoading(false);
          return; 
        }

        // Step 3: Save order to MongoDB
        if (paymentResult.paymentIntent.status === 'succeeded') {
          const res = await axiosSecure.post('/orders', orderData);
          if (res.status === 201) {
            toast.success("Payment Successful! Order Placed.");
            clearCart(); 
            navigate('/');
          }
        }
      } 
      // --- BRANCH B: CASH ON DELIVERY LOGIC ---
      else {
        const res = await axiosSecure.post('/orders', orderData);
        if (res.status === 201) {
          toast.success("Order Placed! You will pay upon delivery.");
          clearCart(); 
          navigate('/');
        }
      }
    } catch (error) {
      toast.error("Order failed to process. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-12 font-sans">
      <div className="text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">Checkout</span>
      </div>
      
      <h1 className="text-3xl font-medium tracking-wide mb-10 text-black">Billing Details</h1>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-24">
        {/* Left Side: The Form */}
        <div className="w-full lg:w-1/2">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">First Name*</label>
              <input name="firstName" type="text" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Street Address*</label>
              <input name="streetAddress" type="text" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Town/City*</label>
              <input name="city" type="text" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number*</label>
              <input name="phone" type="tel" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-black" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Email Address*</label>
              <input name="email" type="email" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-black" />
            </div>
          </form>
        </div>

        {/* Right Side: Order Summary & Payment */}
        <div className="w-full lg:w-[450px]">
          <div className="flex flex-col gap-6 mb-8">
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-contain" />
                  <span className="text-black text-sm">{item.name} <span className="text-gray-400 ml-1">x {item.quantity}</span></span>
                </div>
                <span className="text-black text-sm">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between border-b border-gray-300 pb-4 mb-4">
            <span className="text-black">Subtotal:</span>
            <span className="text-black">${subtotal}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-4 mb-4">
            <span className="text-black">Shipping:</span>
            <span className="text-green-500 font-medium">Free</span>
          </div>
          <div className="flex justify-between mb-8">
            <span className="text-black font-medium">Total:</span>
            <span className="text-black font-medium">${total}</span>
          </div>

          {/* 👈 NEW: PAYMENT METHOD TOGGLES */}
          <div className="mb-6 flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="cod" 
                checked={paymentMethod === 'cod'} 
                onChange={() => setPaymentMethod('cod')}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-black font-medium">Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                name="paymentMethod" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')}
                className="w-4 h-4 accent-red-500"
              />
              <span className="text-black font-medium">Credit / Debit Card</span>
            </label>
          </div>

          {/* THE STRIPE CREDIT CARD ELEMENT (Only shows if 'card' is selected!) */}
          {paymentMethod === 'card' && (
            <div className="mb-8">
              <div className="border border-gray-300 rounded px-4 py-3 bg-white">
                  <CardElement options={{
                    style: {
                      base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                      invalid: { color: '#9e2146' },
                    },
                  }}/>
              </div>
            </div>
          )}

          <button 
            form="checkout-form" 
            type="submit" 
            disabled={(paymentMethod === 'card' && !stripe) || loading} 
            className="w-full bg-red-500 text-white py-4 rounded font-medium hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            {loading ? "Processing..." : paymentMethod === 'card' ? `Pay $${total}` : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

// We wrap the form in the Elements provider right here!
const CheckOut = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default CheckOut;




// 1. INITIALIZE STRIPE HERE (Paste your publishable key!)
// const stripePromise = loadStripe('pk_test_51TEQ2gRqg3b6rhHt1Ci7tYEpQ6AbVXpKOgvC5yOxuByRJ6OCmkQiQ1Tgz7MavBPuWYR1IixW2GZVBZ33F8ESoe46003l0dxKNC');