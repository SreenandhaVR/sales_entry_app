// src/services/commonAPI.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://5.189.180.8:8010", // backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor (optional: add auth token)
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: add token from localStorage if exists
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (log errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
