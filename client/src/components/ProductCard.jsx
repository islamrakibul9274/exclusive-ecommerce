import React from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom'; // 👈 Import Link

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Safe check for MongoDB _id or hardcoded id
  const productId = product._id || product.id;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="flex flex-col group cursor-pointer font-sans min-w-[250px]">
      
      {/* Top Image Container */}
      <div className="relative bg-[#F5F5F5] rounded-md h-[250px] flex items-center justify-center overflow-hidden">
        {product.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-3 py-1 rounded">
            -{product.discount}%
          </span>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
          <div className="bg-white p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors duration-300">
            <FiHeart className="text-lg" />
          </div>
          <div className="bg-white p-1.5 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-colors duration-300">
            <FiEye className="text-lg" />
          </div>
        </div>

        {/* 👈 Wrap the image in a Link to the product details page */}
        <Link to={`/product/${productId}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-3/4 h-3/4 object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Hover "Add To Cart" Button */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // Prevents the link from clicking if they just want to add to cart
            addToCart(product);
          }}
          className="absolute bottom-0 w-full bg-black text-white py-2 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20"
        >
          Add To Cart
        </button>
      </div>

      {/* Bottom Text Container */}
      <div className="mt-4 flex flex-col gap-1.5">
        {/* 👈 Wrap the title in a Link as well */}
        <Link to={`/product/${productId}`}>
          <h3 className="font-medium text-base text-black truncate hover:text-red-500 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-red-500 font-medium">${product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 line-through font-medium">${product.oldPrice}</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <div className="flex gap-0.5">{renderStars(product.rating || 0)}</div>
          <span className="text-gray-400 font-medium ml-1">({product.reviews || 0})</span>
        </div>
      </div>
      
    </div>
  );
};

export default ProductCard;