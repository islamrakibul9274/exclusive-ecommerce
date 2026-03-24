import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosPublic from '../api/axiosPublic';
import toast from 'react-hot-toast';
const Login = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const res = await axiosPublic.post('/users/login', { email, password });

            if (res.status === 200) {
                // 1. Save the "VIP Wristband" (Token) and User Data
                localStorage.setItem('ecommerce-token', res.data.token);
                localStorage.setItem('ecommerce-user', JSON.stringify(res.data.user));

                toast.success("Welcome back!");

                // 2. Send them to the homepage or account page
                navigate('/');

                // Quick reload to update the Navbar state (we'll make this smoother with Context later)
                window.location.reload();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1140px] mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10 lg:gap-24 font-sans">
            <div className="w-full md:w-1/2 bg-[#CBE4E8] rounded-r-md overflow-hidden flex justify-center items-center pt-10">
                <img src="/auth-image.png" alt="Login" className="w-[80%] object-contain" />
            </div>

            <div className="w-full md:w-1/2 max-w-md">
                <h1 className="text-3xl lg:text-4xl font-medium tracking-wide mb-4 text-black">Log in to Exclusive</h1>
                <p className="text-gray-600 mb-10">Enter your details below</p>

                <form onSubmit={handleLogin} className="space-y-8 flex flex-col">
                    <input name="email" type="text" placeholder="Email or Phone Number" className="w-full border-b border-gray-400 py-2 outline-none focus:border-red-500 transition-colors" required />
                    <input name="password" type="password" placeholder="Password" className="w-full border-b border-gray-400 py-2 outline-none focus:border-red-500 transition-colors" required />

                    <div className="flex items-center justify-between mt-8">
                        <button type="submit" disabled={loading} className=" cursor-pointer bg-red-500 text-white px-12 py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors">
                            {loading ? "Logging In..." : "Log In"}
                        </button>
                        <Link to="/" className="text-red-500 text-sm font-medium hover:underline">
                            Forget Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;