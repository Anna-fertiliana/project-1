import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://library-backend-production-b9cf.up.railway.app",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);