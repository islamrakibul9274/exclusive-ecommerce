import React from 'react';
import { Link } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-6 font-sans mt-20">
      <div className="max-w-[1140px] mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-16">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-wide">Exclusive</h2>
          <h3 className="text-lg font-medium mt-2">Subscribe</h3>
          <p className="text-sm font-light text-gray-200">Get 10% off your first order</p>
          <div className="relative mt-2 border border-white rounded w-full max-w-[250px]">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent text-sm p-3 w-full outline-none placeholder-gray-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-gray-300">
              <FiSend className="text-xl" />
            </button>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Support</h3>
          <p className="text-sm font-light text-gray-200 leading-relaxed max-w-[200px]">
            111 Bijoy sarani, Dhaka, <br /> DH 1515, Bangladesh.
          </p>
          <p className="text-sm font-light text-gray-200">exclusive@gmail.com</p>
          <p className="text-sm font-light text-gray-200">+88015-88888-9999</p>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Account</h3>
          <Link to="/account" className="text-sm font-light text-gray-200 hover:underline">My Account</Link>
          <Link to="/login" className="text-sm font-light text-gray-200 hover:underline">Login / Register</Link>
          <Link to="/cart" className="text-sm font-light text-gray-200 hover:underline">Cart</Link>
          <Link to="/wishlist" className="text-sm font-light text-gray-200 hover:underline">Wishlist</Link>
          <Link to="/" className="text-sm font-light text-gray-200 hover:underline">Shop</Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Quick Link</h3>
          <Link to="/" className="text-sm font-light text-gray-200 hover:underline">Privacy Policy</Link>
          <Link to="/" className="text-sm font-light text-gray-200 hover:underline">Terms Of Use</Link>
          <Link to="/" className="text-sm font-light text-gray-200 hover:underline">FAQ</Link>
          <Link to="/contact" className="text-sm font-light text-gray-200 hover:underline">Contact</Link>
        </div>

        {/* Column 5 */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Download App</h3>
          <p className="text-xs font-medium text-gray-400">Save $3 with App New User Only</p>
          <div className="flex items-center gap-2 mt-1">
            <img src="/qr-code.png" alt="QR Code" className="w-20 h-20 object-cover bg-white p-1" />
            <div className="flex flex-col gap-2">
              <img src="/google-play.png" alt="Google Play" className="w-28 cursor-pointer hover:opacity-80" />
              <img src="/app-store.png" alt="App Store" className="w-28 cursor-pointer hover:opacity-80" />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 text-xl">
            <FaFacebookF className="cursor-pointer hover:text-gray-300" />
            <FaTwitter className="cursor-pointer hover:text-gray-300" />
            <FaInstagram className="cursor-pointer hover:text-gray-300" />
            <FaLinkedinIn className="cursor-pointer hover:text-gray-300" />
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 pt-6 text-center">
        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
          <span>&copy;</span> Copyright Rimel 2022. All right reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;