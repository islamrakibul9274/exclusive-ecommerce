import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosSecure from '../api/axiosSecure';
import toast from 'react-hot-toast';

// ⚠️ SENIOR DEV NOTE: In a real production app, you would put this key in a .env.local file!
// But for this project, we will hardcode it here so it works instantly.
const IMGBB_API_KEY = "beb67fd8b573fc739cbc277a903dc4cc";

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'addProduct'
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add Product State
    const [isAdding, setIsAdding] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(''); // To tell the user what's happening

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const res = await axiosSecure.get('/orders');
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await axiosSecure.patch(`/orders/${orderId}/status`, { status: newStatus });

            if (res.status === 200) {
                toast.success(`Order marked as ${newStatus}`);
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error(error);
        }
    };

    // 🚀 THE UPGRADED SUBMIT FUNCTION
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsAdding(true);
        const form = e.target;

        try {
            // --- STEP 1: Upload Image to ImgBB ---
            setUploadStatus('Uploading image to ImgBB...');
            const imageFile = form.image.files[0];
            const formData = new FormData();
            formData.append('image', imageFile);

            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });
            const imgbbData = await imgbbResponse.json();

            if (!imgbbData.success) {
                throw new Error("Failed to upload image to ImgBB.");
            }

            // Extract the live URL from ImgBB's response
            const liveImageUrl = imgbbData.data.display_url;

            // --- STEP 2: Save Product to Database ---
            setUploadStatus('Saving product to database...');
            const newProduct = {
                name: form.name.value,
                price: form.price.value,
                oldPrice: form.oldPrice.value || null,
                category: form.category.value,
                stock: form.stock.value,
                image: liveImageUrl // 👈 We use the ImgBB URL here!
            };

            const res = await axiosSecure.post('/products', newProduct);
            
            if (res.status === 201) {
                toast.success("Product Added Successfully!");
                form.reset(); 
                setActiveTab('orders'); 
            }
        } catch (error) {
            toast.error(error.message || error.response?.data?.message || "Failed to add product");
        } finally {
            setIsAdding(false);
            setUploadStatus(''); // Clear the status text
        }
    };

    return (
        <div className="max-w-[1140px] mx-auto px-4 py-12 font-sans">
            <div className="text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">Admin Dashboard</span>
            </div>

            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-medium tracking-wide text-black">Control Panel</h1>
                
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-red-500 text-white' : 'bg-[#F5F5F5] text-black hover:bg-gray-200'}`}
                    >
                        Manage Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('addProduct')}
                        className={`px-6 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'addProduct' ? 'bg-red-500 text-white' : 'bg-[#F5F5F5] text-black hover:bg-gray-200'}`}
                    >
                        + Add Product
                    </button>
                </div>
            </div>

            {/* --- ORDERS TAB --- */}
            {activeTab === 'orders' && (
                loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded-md">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#F5F5F5] text-black text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium border-b border-gray-200">Order ID</th>
                                    <th className="p-4 font-medium border-b border-gray-200">Customer</th>
                                    <th className="p-4 font-medium border-b border-gray-200">Date</th>
                                    <th className="p-4 font-medium border-b border-gray-200">Total</th>
                                    <th className="p-4 font-medium border-b border-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                                        <td className="p-4 font-mono text-xs">{order._id}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-black">{order.billingDetails?.firstName}</p>
                                            <p className="text-xs text-gray-500">{order.billingDetails?.email}</p>
                                        </td>
                                        <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-black">${order.totalAmount}</td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium outline-none cursor-pointer border ${
                                                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                    'bg-green-100 text-green-800 border-green-200'
                                                }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">No orders found in the database.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* --- ADD PRODUCT TAB --- */}
            {activeTab === 'addProduct' && (
                <div className="max-w-3xl mx-auto bg-white shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded-md p-8 md:p-12 relative">
                    
                    {/* Loading Overlay */}
                    {isAdding && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-md">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                            <p className="text-black font-medium">{uploadStatus}</p>
                        </div>
                    )}

                    <h2 className="text-xl font-medium text-red-500 mb-8">Upload New Inventory</h2>

                    <form onSubmit={handleAddProduct} className="space-y-6">
                        <div>
                            <label className="block text-sm text-black mb-2">Product Name *</label>
                            <input name="name" type="text" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-red-500 text-black" placeholder="e.g., Sony PlayStation 5" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full">
                                <label className="block text-sm text-black mb-2">Selling Price ($) *</label>
                                <input name="price" type="number" required min="1" className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-red-500 text-black" placeholder="499" />
                            </div>
                            <div className="w-full">
                                <label className="block text-sm text-black mb-2">Old Price (Optional) </label>
                                <input name="oldPrice" type="number" min="1" className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-red-500 text-black" placeholder="Leave blank if no discount" />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full">
                                <label className="block text-sm text-black mb-2">Category *</label>
                                <select name="category" required className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-red-500 text-black cursor-pointer">
                                    <option value="">Select a Category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Gaming">Gaming</option>
                                    <option value="Men's Fashion">Men's Fashion</option>
                                    <option value="Woman's Fashion">Woman's Fashion</option>
                                    <option value="Home & Lifestyle">Home & Lifestyle</option>
                                    <option value="Computers">Computers</option>
                                </select>
                            </div>
                            <div className="w-full">
                                <label className="block text-sm text-black mb-2">Stock Quantity *</label>
                                <input name="stock" type="number" required min="1" defaultValue="10" className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-red-500 text-black" />
                            </div>
                        </div>

                        {/* 🚀 THE NEW FILE UPLOAD FIELD */}
                        <div>
                            <label className="block text-sm text-black mb-2">Product Image *</label>
                            <input 
                                name="image" 
                                type="file" 
                                accept="image/*" 
                                required 
                                className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-500 hover:file:bg-red-100 cursor-pointer" 
                            />
                        </div>

                        <div className="flex justify-end pt-6">
                            <button type="submit" disabled={isAdding} className="bg-red-500 text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-red-300">
                                Save Product to Database
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;