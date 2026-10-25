// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // set this after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
