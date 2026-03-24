import axios from "axios";

const axiosPublic = axios.create({
  baseURL: 'https://exclusive-api-028c.onrender.com/api', // Points directly to your Express server
});

export default axiosPublic;