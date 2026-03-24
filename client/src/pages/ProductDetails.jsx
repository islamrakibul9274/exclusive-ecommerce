import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiHeart, FiMinus, FiPlus } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import { TfiReload } from 'react-icons/tfi';
import axiosPublic from '../api/axiosPublic';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams(); // 👈 Grabs the ID from the URL
  const { addToCart } = useCart(); // 👈 Bring in the cart logic

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive UI State
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedSize, setSelectedSize] = useState('M');
  const [mainImage, setMainImage] = useState('');

  // Fetch the specific product from the database
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosPublic.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.image); // Set the default large image
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
    if (type === 'inc') setQuantity(quantity + 1);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-2xl font-medium">Product not found.</div>;
  }

  // Since our seed data only has 1 image per product right now, we'll duplicate it for the thumbnail mockups
  const thumbnails = [product.image, product.image, product.image, product.image];

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-10 font-sans">
      
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-10">
        <Link to="/" className="hover:text-black">Home</Link> / <Link to="/" className="hover:text-black">{product.category || 'Category'}</Link> / <span className="text-black font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 mb-20">
        
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 lg:w-3/5">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible no-scrollbar">
            {thumbnails.map((img, index) => (
              <div 
                key={index} 
                onClick={() => setMainImage(img)}
                className={`w-24 h-24 bg-[#F5F5F5] rounded flex items-center justify-center cursor-pointer border-2 transition-all ${mainImage === img ? 'border-red-500' : 'border-transparent'}`}
              >
                <img src={img} alt={`Thumbnail ${index}`} className="w-3/4 h-3/4 object-contain" />
              </div>
            ))}
          </div>
          
          <div className="bg-[#F5F5F5] rounded flex-1 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
            <img src={mainImage} alt={product.name} className="w-3/4 h-3/4 object-contain" />
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:w-2/5 flex flex-col justify-center">
          <h1 className="text-2xl font-semibold tracking-wide mb-2 text-black">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="flex text-yellow-400 text-sm">
              {renderStars(product.rating || 5)}
            </div>
            <span className="text-gray-400 text-sm">({product.reviews || 0} Reviews)</span>
            <span className="text-gray-400">|</span>
            <span className="text-green-500 text-sm font-medium">In Stock</span>
          </div>

          <p className="text-2xl font-medium tracking-wide mb-4 text-black">${product.price}.00</p>
          
          <p className="text-sm text-black leading-relaxed mb-6 pb-6 border-b border-gray-300">
            Premium quality product from our exclusive collection. Designed for comfort, durability, and a sleek aesthetic.
          </p>

          {/* Colours & Sizes (Static UI for now) */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-lg font-medium text-black">Colours:</span>
            <div className="flex gap-2">
              <button onClick={() => setSelectedColor('blue')} className={`w-5 h-5 rounded-full bg-blue-300 border-2 ring-2 transition-all ${selectedColor === 'blue' ? 'ring-black border-white' : 'ring-transparent border-transparent'}`}></button>
              <button onClick={() => setSelectedColor('red')} className={`w-5 h-5 rounded-full bg-red-500 border-2 ring-2 transition-all ${selectedColor === 'red' ? 'ring-black border-white' : 'ring-transparent border-transparent'}`}></button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-lg font-medium text-black">Size:</span>
            <div className="flex gap-3">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 flex items-center justify-center border rounded text-xs font-medium transition-colors ${selectedSize === size ? 'bg-red-500 text-white border-red-500' : 'border-gray-400 text-black hover:border-red-500 hover:text-red-500'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center border border-gray-400 rounded h-11">
              <button onClick={() => handleQuantity('dec')} className="px-4 h-full border-r border-gray-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"><FiMinus /></button>
              <span className="w-16 text-center font-medium text-black">{quantity}</span>
              <button onClick={() => handleQuantity('inc')} className="px-4 h-full border-l border-gray-400 bg-red-500 text-white border-red-500 hover:bg-red-600 transition-colors"><FiPlus /></button>
            </div>

            {/* 👈 Pass the product and quantity to the cart! */}
            <button 
              onClick={() => addToCart({ ...product, quantity })}
              className="flex-1 bg-red-500 text-white h-11 rounded font-medium hover:bg-red-600 transition-colors"
            >
              Add to Cart
            </button>

            <button className="w-11 h-11 flex items-center justify-center border border-gray-400 rounded hover:bg-gray-50 transition-colors">
              <FiHeart className="text-xl text-black" />
            </button>
          </div>

          {/* Delivery Info */}
          <div className="border border-gray-400 rounded flex flex-col">
            <div className="flex items-center gap-4 p-4 border-b border-gray-400">
              <TbTruckDelivery className="text-4xl text-black" />
              <div>
                <h4 className="font-medium text-black">Free Delivery</h4>
                <p className="text-xs font-medium underline text-black mt-1 cursor-pointer">Enter your postal code for Delivery Availability</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <TfiReload className="text-4xl text-black" />
              <div>
                <h4 className="font-medium text-black">Return Delivery</h4>
                <p className="text-xs text-black mt-1 font-medium">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;