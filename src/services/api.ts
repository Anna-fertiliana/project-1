import axios from "axios";

export const api = axios.create({
  baseURL: "YOUR_API_URL_HERE",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});