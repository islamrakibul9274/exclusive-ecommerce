import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiX } from 'react-icons/fi';

const Cart = () => {
  // Pull our new functions from the context!
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // Calculate the total cost dynamically
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-[1140px] mx-auto px-4 py-20 text-center font-sans h-[50vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-medium mb-6">Your cart is currently empty.</h2>
        <Link to="/" className="bg-red-500 text-white px-10 py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors">
          Return To Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-12 font-sans">
      <div className="text-sm text-gray-500 mb-12">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">Cart</span>
      </div>

      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-4 gap-4 py-6 px-10 shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded mb-10 text-black font-medium">
        <div>Product</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Subtotal</div>
      </div>

      {/* Cart Items List */}
      <div className="flex flex-col gap-10 mb-10">
        {cart.map((item) => {
          const productId = item._id || item.id;
          return (
            <div key={productId} className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 py-6 px-4 md:px-10 shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded relative">
              
              {/* Product Info & Remove Button */}
              <div className="flex items-center gap-4 relative">
                <button 
                  onClick={() => removeFromCart(productId)}
                  className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm"
                  title="Remove Item"
                >
                  <FiX size={14} />
                </button>
                <img src={item.image} alt={item.name} className="w-14 h-14 object-contain" />
                <span className="text-black text-sm md:text-base truncate pr-2">{item.name}</span>
              </div>

              {/* Price */}
              <div className="text-black md:text-center mt-2 md:mt-0">
                <span className="md:hidden text-gray-500 mr-2">Price:</span>
                ${item.price}
              </div>

              {/* Quantity Input */}
              <div className="flex justify-start md:justify-center mt-2 md:mt-0">
                 <span className="md:hidden text-gray-500 mr-2 items-center flex">Qty:</span>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(productId, parseInt(e.target.value) || 1)}
                  className="w-16 border border-gray-300 rounded px-2 py-1.5 outline-none focus:border-red-500 text-center"
                />
              </div>

              {/* Subtotal */}
              <div className="text-black font-medium md:text-right mt-2 md:mt-0">
                <span className="md:hidden text-gray-500 mr-2">Subtotal:</span>
                ${item.price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-20">
        <Link to="/" className="border border-gray-400 text-black px-8 md:px-12 py-4 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          Return To Shop
        </Link>
        {/* The cart updates automatically via State, so this button is just aesthetic per the design! */}
        <button className="border border-gray-400 text-black px-8 md:px-12 py-4 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          Update Cart
        </button>
      </div>

      {/* Cart Total Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        
        {/* Coupon Code */}
        <div className="w-full lg:w-1/2 flex gap-4">
          <input type="text" placeholder="Coupon Code" className="w-full md:w-[300px] border border-gray-800 rounded px-6 py-4 outline-none focus:border-red-500" />
          <button className="bg-red-500 text-white px-8 py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors whitespace-nowrap">
            Apply Coupon
          </button>
        </div>

        {/* Cart Total Card */}
        <div className="w-full lg:w-[470px] border border-gray-800 rounded p-8">
          <h3 className="text-xl font-medium text-black mb-6">Cart Total</h3>
          
          <div className="flex justify-between border-b border-gray-300 pb-4 mb-4">
            <span className="text-black">Subtotal:</span>
            <span className="text-black">${subtotal}</span>
          </div>
          
          <div className="flex justify-between border-b border-gray-300 pb-4 mb-4">
            <span className="text-black">Shipping:</span>
            <span className="text-black">Free</span>
          </div>
          
          <div className="flex justify-between mb-8">
            <span className="text-black">Total:</span>
            <span className="text-black font-medium">${subtotal}</span>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-red-500 text-white py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Process to checkout
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;