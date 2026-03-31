import axios from "axios";

const API = axios.create({
  baseURL: "https://smartspend-backend-tt84.onrender.com",
});

// ✅ FIXED INTERCEPTOR
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers = req.headers || {};   // 🔥 IMPORTANT LINE
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;