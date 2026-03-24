import React from 'react';
import ProductCard from './ProductCard';

const BestSelling = () => {
  // Mock data based on the PDF design
  const bestSellingProducts = [
    { id: 5, name: "The north coat", price: 260, oldPrice: 360, rating: 5, reviews: 65, image: "/coat.png" },
    { id: 6, name: "Gucci duffle bag", price: 960, oldPrice: 1160, rating: 4.5, reviews: 65, image: "/bag.png" },
    { id: 7, name: "RGB liquid CPU Cooler", price: 160, oldPrice: 170, rating: 4.5, reviews: 65, image: "/cooler.png" },
    { id: 8, name: "Small Bookself", price: 360, rating: 5, reviews: 65, image: "/bookshelf.png" },
  ];

  return (
    <section className="mt-20 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
        <h3 className="text-red-500 font-bold text-base">This Month</h3>
      </div>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wider text-black">
          Best Selling Products
        </h2>
        <button className="bg-red-500 text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {bestSellingProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSelling;