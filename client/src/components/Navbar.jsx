import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiShoppingBag, FiXCircle, FiStar, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { totalItems } = useCart();

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    return (
        <header className="w-full font-sans">
            {/* Top Black Announcement Bar */}
            <div className="bg-black text-white text-xs md:text-sm py-3 px-4 flex justify-between items-center">
                <div className="hidden md:block w-1/6"></div>
                <div className=" text-center flex items-center justify-center gap-2">
                    <span>Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</span>
                    <a href="#" className="font-bold underline hover:text-gray-300">ShopNow</a>
                </div>
                <div className=" w-1/6 text-right pr-4 md:pr-12">
                    <select className="bg-transparent text-white outline-none cursor-pointer text-sm">
                        <option className="text-black">English</option>
                    </select>
                </div>
            </div>

            {/* Main White Navbar */}
            <div className="border-b border-gray-200">
                <div className="max-w-[1140px] mx-auto px-4 py-5 flex justify-between items-center mt-2">

                    {/* Brand Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-wide text-black">
                        Exclusive
                    </Link>

                    {/* Center Navigation Links */}
                    <nav className="hidden lg:flex space-x-12 text-base font-medium text-black">
                        <Link to="/" className="hover:underline underline-offset-4">Home</Link>
                        <Link to="/contact" className="hover:underline underline-offset-4">Contact</Link>
                        <Link to="/about" className="hover:underline underline-offset-4">About</Link>
                        {/* Hide Sign Up if logged in */}
                        {!user && <Link to="/signup" className="hover:underline underline-offset-4">Sign Up</Link>}
                    </nav>

                    {/* Right Side: Search & Icons */}
                    <div className="flex items-center space-x-6 relative">

                        <div className="hidden md:flex items-center bg-[#F5F5F5] rounded-md px-4 py-2">
                            <input type="text" placeholder="What are you looking for?" className="bg-transparent outline-none text-xs w-48 placeholder-gray-500" />
                            <FiSearch className="text-lg text-black cursor-pointer" />
                        </div>

                        <div className="flex items-center space-x-5">
                            <Link to="/wishlist" className="relative hover:text-red-500 transition-colors">
                                <FiHeart className="text-2xl text-black hover:text-red-500" />
                            </Link>

                            {/* ✅ FIX 3: Re-added the dynamic cart badge */}
                            <Link to="/cart" className="relative hover:text-red-500 transition-colors">
                                <FiShoppingCart className="text-2xl text-black hover:text-red-500" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>

                            {/* USER DROPDOWN LOGIC */}
                            {user ? (
                                <div className="relative">
                                    <div
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className={`p-1.5 rounded-full cursor-pointer transition-colors ${dropdownOpen ? 'bg-red-500 text-white' : 'bg-transparent text-black hover:bg-red-500 hover:text-white'}`}
                                    >
                                        <FiUser className="text-2xl" />
                                    </div>

                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 bg-black/90 backdrop-blur-md text-white rounded-md shadow-2xl py-3 px-4 z-50 flex flex-col gap-3 text-sm">

                                            {/* 👑 NEW: The Admin Only Link */}
                                            {user.role === 'admin' && (
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors pb-2 border-b border-gray-700">
                                                    <FiGrid className="text-lg" /> Admin Dashboard
                                                </Link>
                                            )}

                                            <Link to="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 hover:text-gray-300 transition-colors">
                                                <FiUser className="text-lg" /> Manage My Account
                                            </Link>
                                            <Link to="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 hover:text-gray-300 transition-colors">
                                                <FiShoppingBag className="text-lg" /> My Order
                                            </Link>
                                            <Link to="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 hover:text-gray-300 transition-colors">
                                                <FiXCircle className="text-lg" /> My Cancellations
                                            </Link>
                                            <Link to="/account" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 hover:text-gray-300 transition-colors">
                                                <FiStar className="text-lg" /> My Reviews
                                            </Link>
                                            <button onClick={handleLogout} className="flex items-center gap-3 hover:text-gray-300 transition-colors text-left">
                                                <FiLogOut className="text-lg" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : null}

                        </div>
                    </div>
                </div>
            </div> {/* ✅ FIX 2: Added missing closing div for the border-b container */}
        </header>
    );
};

export default Navbar;