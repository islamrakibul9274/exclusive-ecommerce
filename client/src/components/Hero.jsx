import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';
import { FaApple } from 'react-icons/fa'; // Using FontAwesome for the Apple logo

const Hero = () => {
  // Hardcoded categories matching your PDF design
  const categories = [
    { name: "Woman's Fashion", hasDropdown: true },
    { name: "Men's Fashion", hasDropdown: true },
    { name: "Electronics", hasDropdown: false },
    { name: "Home & Lifestyle", hasDropdown: false },
    { name: "Medicine", hasDropdown: false },
    { name: "Sports & Outdoor", hasDropdown: false },
    { name: "Baby's & Toys", hasDropdown: false },
    { name: "Groceries & Pets", hasDropdown: false },
    { name: "Health & Beauty", hasDropdown: false },
  ];

  return (
    <div className="flex justify-between pt-10 font-sans">
      
      {/* Left Sidebar - Categories */}
      <div className="hidden lg:flex flex-col w-1/4 border-r border-gray-200 pr-6 gap-4 text-base font-medium text-black">
        {categories.map((category, index) => (
          <Link key={index} to="/" className="flex justify-between items-center hover:text-red-500 transition-colors">
            {category.name}
            {category.hasDropdown && <FiChevronRight className="text-xl" />}
          </Link>
        ))}
      </div>

      {/* Right Banner - Hero Slider */}
      <div className="w-full lg:w-3/4 lg:pl-10 mt-6 lg:mt-0">
        <div className="bg-black text-white p-10 md:p-16 flex items-center justify-between h-auto md:h-[344px] relative overflow-hidden">
          
          {/* Text Content */}
          <div className="z-10 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <FaApple className="text-4xl" />
              <span className="text-sm tracking-widest">iPhone 14 Series</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-wider">
              Up to 10% <br /> off Voucher
            </h1>
            <Link to="/" className="flex items-center gap-2 underline underline-offset-8 font-medium mt-4 hover:text-gray-300">
              Shop Now <FiChevronRight className="text-xl" />
            </Link>
          </div>

          {/* Placeholder for the phone image */}
          {/* Pro-tip: Save a transparent PNG of an iPhone in your public folder as 'hero-phone.png' */}
          <img 
            src="/hero-phone.png" 
            alt="iPhone Promotion" 
            className="z-10 w-[250px] md:w-[350px] object-contain absolute right-17 md:right-10 bottom-0 md:bottom-8 opacity-50 md:opacity-100" 
          />

          {/* Slider Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            <div className="w-3 h-3 rounded-full bg-gray-500 cursor-pointer hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500 cursor-pointer hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500 cursor-pointer hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-gray-500 cursor-pointer hover:bg-red-500 transition-colors"></div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Hero;