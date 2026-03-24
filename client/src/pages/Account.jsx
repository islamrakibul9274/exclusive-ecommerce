import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import axiosPublic from '../api/axiosPublic';
// Remove: import axiosPublic from '../api/axiosPublic';
import axiosSecure from '../api/axiosSecure'; // 👈 Use the secure version

const Account = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'
  const [loading, setLoading] = useState(false);

  // Fetch orders when the component loads (if the user is logged in)
  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await axiosSecure.get(`/orders/${user.id}`);
          setOrders(res.data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-[1170px] mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-2xl font-medium mb-4">Please log in to view your account.</h2>
        <Link to="/login" className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600 transition-colors">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1170px] mx-auto px-4 py-12 font-sans">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex justify-between items-center mb-16">
        <div className="text-sm text-gray-500">
          <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">My Account</span>
        </div>
        <div className="text-sm">
          Welcome! <span className="text-red-500 font-medium">{user.name}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-20">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-1/4">
          <div className="mb-6">
            <h3 className="font-medium text-black mb-4">Manage My Account</h3>
            <ul className="flex flex-col gap-2 pl-6 text-sm text-gray-500">
              <li 
                onClick={() => setActiveTab('profile')}
                className={`cursor-pointer transition-colors ${activeTab === 'profile' ? 'text-red-500 font-medium' : 'hover:text-black'}`}
              >
                My Profile
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">Address Book</li>
              <li className="hover:text-black cursor-pointer transition-colors">My Payment Options</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-black mb-4">My Orders</h3>
            <ul className="flex flex-col gap-2 pl-6 text-sm text-gray-500">
              <li 
                onClick={() => setActiveTab('orders')}
                className={`cursor-pointer transition-colors ${activeTab === 'orders' ? 'text-red-500 font-medium' : 'hover:text-black'}`}
              >
                Order History ({orders.length})
              </li>
              <li className="hover:text-black cursor-pointer transition-colors">My Returns</li>
              <li className="hover:text-black cursor-pointer transition-colors">My Cancellations</li>
            </ul>
          </div>
        </div>

        {/* Right Area: Dynamic Content based on Active Tab */}
        <div className="w-full md:w-3/4 bg-white shadow-[0px_1px_13px_rgba(0,0,0,0.05)] rounded p-8 md:p-12">
          
          {activeTab === 'profile' ? (
            // --- PROFILE FORM ---
            <>
              <h2 className="text-xl font-medium text-red-500 mb-8">Edit Your Profile</h2>
              <form className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full">
                    <label className="block text-sm text-black mb-2">Name</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-gray-600" />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm text-black mb-2">Email</label>
                    <input type="email" defaultValue={user.email} className="w-full bg-[#F5F5F5] rounded px-4 py-3 outline-none focus:ring-1 focus:ring-gray-300 text-gray-600" readOnly />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end items-center gap-6 pt-6">
                  <button type="button" className="text-sm font-medium text-black hover:text-red-500 transition-colors">Cancel</button>
                  <button type="button" className="bg-red-500 text-white px-10 py-3.5 rounded text-sm font-medium hover:bg-red-600 transition-colors">Save Changes</button>
                </div>
              </form>
            </>
          ) : (
            // --- ORDER HISTORY ---
            <>
              <h2 className="text-xl font-medium text-red-500 mb-8">Your Order History</h2>
              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-200 rounded p-6">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order ID: <span className="text-black">{order._id}</span></p>
                          <p className="text-sm text-gray-500">Date: <span className="text-black">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total: <span className="text-red-500 font-medium">${order.totalAmount}</span></p>
                          <p className="text-sm text-gray-500">Status: <span className="text-green-500 font-medium">{order.status}</span></p>
                        </div>
                      </div>
                      
                      {/* Items in this order */}
                      <div className="flex flex-col gap-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-[#F5F5F5] p-1 rounded" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-black">{item.name}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Account;