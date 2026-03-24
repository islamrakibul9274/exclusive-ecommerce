import axios from "axios";

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Intercept every outgoing request and attach the token automatically
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecommerce-token'); // 👈 Grab the VIP wristband
  
  if (token) {
    // Attach it to the Authorization header
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosSecure;