// src/api.js
import axios from "axios";

export const API_ORIGIN = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${API_ORIGIN}/api`,
});

export const getAssetUrl = (assetPath) => {
  if (!assetPath) return null;
  if (/^https?:\/\//i.test(assetPath)) return assetPath;
  return `${API_ORIGIN}/${assetPath.replace(/^\/+/, "")}`;
};

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // set this after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
