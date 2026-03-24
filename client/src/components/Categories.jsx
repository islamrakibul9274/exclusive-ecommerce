import React from 'react';
import { FiSmartphone, FiMonitor, FiWatch, FiCamera, FiHeadphones, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { IoGameControllerOutline } from 'react-icons/io5';

const Categories = () => {
  // Array of categories matching your PDF design
  const categories = [
    { name: "Phones", icon: <FiSmartphone className="text-4xl mb-4" /> },
    { name: "Computers", icon: <FiMonitor className="text-4xl mb-4" /> },
    { name: "SmartWatch", icon: <FiWatch className="text-4xl mb-4" /> },
    { name: "Camera", icon: <FiCamera className="text-4xl mb-4" />, active: true },
    { name: "HeadPhones", icon: <FiHeadphones className="text-4xl mb-4" /> },
    { name: "Gaming", icon: <IoGameControllerOutline className="text-4xl mb-4" /> },
  ];

  return (
    <section className="mt-20 border-b border-gray-200 pb-16 font-sans">
      
      {/* Section Header (The Red Box & Title) */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
        <h3 className="text-red-500 font-bold text-base">Categories</h3>
      </div>

      {/* Title and Arrows */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wider text-black">
          Browse By Category
        </h2>

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

      {/* Category Boxes */}
      <div className="flex justify-between gap-4 overflow-x-auto no-scrollbar pb-4">
        {categories.map((cat, index) => (
          <div 
            key={index} 
            className={`min-w-[170px] h-[145px] border rounded-md flex flex-col items-center justify-center cursor-pointer transition-all duration-300 
              ${cat.active 
                ? 'bg-red-500 text-white border-red-500 shadow-md' 
                : 'bg-transparent text-black border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-md'
              }`}
          >
            {cat.icon}
            <span className="font-medium">{cat.name}</span>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Categories;