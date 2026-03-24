import React from 'react';
import ProductCard from '../components/ProductCard'; // Reusing our homepage card
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Wishlist = () => {
  // Mock data for Wishlist items
  const wishlistItems = [
    { id: 17, name: "Gucci duffle bag", price: 960, oldPrice: 1160, discount: 35, image: "/bag.png" },
    { id: 18, name: "RGB liquid CPU Cooler", price: 1960, image: "/cooler.png" },
    { id: 19, name: "GP11 Shooter USB Gamepad", price: 550, image: "/gamepad-black.png" },
    { id: 20, name: "Quilted Satin Jacket", price: 750, image: "/jacket.png" },
  ];

  // Mock data for "Just For You"
  const justForYou = [
    { id: 11, name: "ASUS FHD Gaming Laptop", price: 960, oldPrice: 1160, rating: 5, reviews: 65, discount: 35, image: "/laptop.png" },
    { id: 3, name: "IPS LCD Gaming Monitor", price: 1160, rating: 5, reviews: 65, image: "/monitor.png" },
    { id: 1, name: "HAVIT HV-G92 Gamepad", price: 560, rating: 5, reviews: 65, image: "/gamepad.png" },
    { id: 2, name: "AK-900 Wired Keyboard", price: 200, rating: 5, reviews: 65, image: "/keyboard.png" },
  ];

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-12 font-sans">
      
      {/* --- WISHLIST SECTION --- */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-medium text-black">Wishlist ({wishlistItems.length})</h2>
        <button className="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          Move All To Bag
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col group cursor-pointer">
            
            {/* Top Image Container (Modified for Wishlist) */}
            <div className="relative bg-[#F5F5F5] rounded-md h-[250px] flex items-center justify-center overflow-hidden">
              {item.discount && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded">
                  -{item.discount}%
                </span>
              )}
              
              {/* Trash Icon */}
              <div className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors duration-300">
                <FiTrash2 className="text-lg" />
              </div>
              
              <img src={item.image} alt={item.name} className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500" />
              
              {/* Add To Cart Button - Always visible on Wishlist */}
              <button className="absolute bottom-0 w-full bg-black text-white flex items-center justify-center gap-2 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                <FiShoppingCart className="text-lg" /> Add To Cart
              </button>
            </div>

            {/* Bottom Text Container */}
            <div className="mt-4 flex flex-col gap-1.5">
              <h3 className="font-medium text-base text-black truncate">{item.name}</h3>
              <div className="flex items-center gap-3">
                <span className="text-red-500 font-medium">${item.price}</span>
                {item.oldPrice && <span className="text-gray-400 line-through font-medium">${item.oldPrice}</span>}
              </div>
            </div>
            
          </div>
        ))}
      </div>

      {/* --- JUST FOR YOU SECTION --- */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
          <h3 className="text-black font-medium text-xl">Just For You</h3>
        </div>
        <button className="border border-gray-400 px-8 py-3 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {justForYou.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
    </div>
  );
};

export default Wishlist;