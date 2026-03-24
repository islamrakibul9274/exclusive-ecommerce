import axios from "axios";

const axiosPublic = axios.create({
  baseURL: 'http://localhost:5000/api', // Points directly to your Express server
});

export default axiosPublic;