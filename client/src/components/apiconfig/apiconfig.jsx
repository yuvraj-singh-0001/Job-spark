import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5174/api",
  withCredentials: true, // cookies enabled
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Optional: handle 401 globally
    return Promise.reject(err);
  }
);

export default api;
