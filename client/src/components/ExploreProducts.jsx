import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import axiosPublic from '../api/axiosPublic'; // 👈 Import your API bridge

const ExploreProducts = () => {
  // 1. Create a state to hold your database products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data when the component loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // This calls your GET /api/products route!
        const res = await axiosPublic.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array means "only run this once when the page loads"

  return (
    <section className="mt-20 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-5 h-10 bg-red-500 rounded-sm"></div>
        <h3 className="text-red-500 font-bold text-base">Our Products</h3>
      </div>

      <div className="flex justify-between items-end mb-10">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-wider text-black">
          Explore Our Products
        </h2>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
            <FiArrowLeft className="text-xl" />
          </div>
          <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500 hover:text-white transition-colors">
            <FiArrowRight className="text-xl" />
          </div>
        </div>
      </div>

      {/* 3. Render the Database Products */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            // Note: MongoDB automatically assigns '_id', not 'id'
            <ProductCard key={product._id} product={product} /> 
          ))}
        </div>
      )}

      <div className="mt-16 mb-20 flex justify-center">
        <button className="bg-red-500 text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">
          View All Products
        </button>
      </div>
    </section>
  );
};

export default ExploreProducts;