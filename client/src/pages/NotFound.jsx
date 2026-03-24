import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-[1170px] mx-auto px-4 py-20 font-sans text-center h-[60vh] flex flex-col items-center justify-center">
      <div className="text-sm text-gray-500 absolute top-40 left-4 md:left-auto md:w-full md:max-w-[1170px] text-left">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">404 Error</span>
      </div>

      <h1 className="text-6xl md:text-8xl font-medium tracking-widest text-black mb-8">404 Not Found</h1>
      <p className="text-gray-600 mb-16">Your visited page not found. You may go home page.</p>
      
      <Link to="/" className="bg-red-500 text-white px-12 py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors">
        Back to home page
      </Link>
    </div>
  );
};

export default NotFound;