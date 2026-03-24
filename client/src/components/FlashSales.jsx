import React from 'react';
import ProductCard from './ProductCard';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const FlashSales = () => {
  // Hardcoded data matching your PDF
  const flashProducts = [
    { id: 1, name: "HAVIT HV-G92 Gamepad", price: 120, oldPrice: 160, discount: 40, rating: 5, reviews: 88, image: "/gamepad.png" },
    { id: 2, name: "AK-900 Wired Keyboard", price: 960, oldPrice: 1160, discount: 35, rating: 4, reviews: 75, image: "/keyboard.png" },
    { id: 3, name: "IPS LCD Gaming Monitor", price: 370, oldPrice: 400, discount: 30, rating: 5, reviews: 99, image: "/monitor.png" },
    { id: 4, name: "S-Series Comfort Chair", price: 375, oldPrice: 400, discount: 25, rating: 4.5, reviews: 99, image: "/chair.png" },
    { id: 5, name: "S-Series Comfort Chair", price: 375, oldPrice: 400, discount: 25, rating: 4.5, reviews: 99, image: "/chair.png" },
  ];

  return (
    <section className="mt-24 border-b border-gray-200 pb-12 font-sans">
      
      {/* Section Header (The Red Box & Title) */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
        <h3 className="text-red-500 font-bold text-base">Today's</h3>
      </div>

      {/* Title, Timer, and Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="flex items-end gap-12 text-black">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-wider">Flash Sales</h2>
          
          {/* Countdown Timer */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex flex-col"><span className="text-xs font-medium">Days</span><span className="text-3xl font-bold tracking-widest">03</span></div>
            <span className="text-red-500 text-3xl font-bold mb-1">:</span>
            <div className="flex flex-col"><span className="text-xs font-medium">Hours</span><span className="text-3xl font-bold tracking-widest">23</span></div>
            <span className="text-red-500 text-3xl font-bold mb-1">:</span>
            <div className="flex flex-col"><span className="text-xs font-medium">Minutes</span><span className="text-3xl font-bold tracking-widest">19</span></div>
            <span className="text-red-500 text-3xl font-bold mb-1">:</span>
            <div className="flex flex-col"><span className="text-xs font-medium">Seconds</span><span className="text-3xl font-bold tracking-widest">56</span></div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
            <FiArrowLeft className="text-xl" />
          </div>
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
            <FiArrowRight className="text-xl" />
          </div>
        </div>
      </div>

      {/* Product Row */}
      <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-14 flex justify-center">
        <button className="bg-red-500 text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">
          View All Products
        </button>
      </div>
      
    </section>
  );
};

export default FlashSales;