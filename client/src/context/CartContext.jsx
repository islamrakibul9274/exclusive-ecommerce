import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('ecommerce-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('ecommerce-cart', JSON.stringify(cart));
  }, [cart]);

  // 1. Add to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;
      const existingItem = prevCart.find(item => (item._id || item.id) === productId);

      if (existingItem) {
        return prevCart.map(item =>
          (item._id || item.id) === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  // 2. NEW: Remove specific item from Cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => (item._id || item.id) !== productId));
    toast.success("Item removed from cart");
  };

  // 3. NEW: Update quantity manually
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent setting quantity to 0 or negative
    
    setCart((prevCart) => prevCart.map(item =>
      (item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    // Make sure to expose the new functions here!
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);