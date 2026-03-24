import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import axiosPublic from '../api/axiosPublic';
import toast from 'react-hot-toast';
const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        try {
            const res = await axiosPublic.post('/users/signup', { name, email, password });

            if (res.status === 201) {
                toast.success("Account created successfully!");
                navigate('/login'); // Send them to log in!
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="max-w-[1140px] mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10 lg:gap-24 font-sans">
            {/* Left Image */}
            <div className="w-full md:w-1/2 bg-[#CBE4E8] rounded-r-md overflow-hidden flex justify-center items-center pt-10">
                {/* Placeholder for the shopping cart/phone illustration */}
                <img src="/auth-image.png" alt="Sign Up" className="w-[80%] object-contain" />
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 max-w-md">
                <h1 className="text-3xl lg:text-4xl font-medium tracking-wide mb-4 text-black">Create an account</h1>
                <p className="text-gray-600 mb-10">Enter your details below</p>

                <form onSubmit={handleSignUp} className="space-y-8 flex flex-col">
                    <input name="name" type="text" placeholder="Name" className="w-full border-b border-gray-400 py-2 outline-none focus:border-red-500 transition-colors" required />
                    <input name="email" type="text" placeholder="Email or Phone Number" className="w-full border-b border-gray-400 py-2 outline-none focus:border-red-500 transition-colors" required />
                    <input name="password" type="password" placeholder="Password" className="w-full border-b border-gray-400 py-2 outline-none focus:border-red-500 transition-colors" required />

                    <button type="submit" disabled={loading} className="w-full cursor-pointer bg-red-500 text-white py-4 rounded text-sm font-medium hover:bg-red-600 transition-colors mt-4">
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    <button type="button" className="w-full border border-gray-400 py-4 rounded text-sm font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
                        <FcGoogle className="text-xl" /> Sign up with Google
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        Already have account? <Link to="/login" className="text-black font-medium hover:underline underline-offset-4 ml-2">Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;