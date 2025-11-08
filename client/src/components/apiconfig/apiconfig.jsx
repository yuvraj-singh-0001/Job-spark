import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080/api",
  withCredentials: true, // set true if you use cookies
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // Optional: handle 401 globally
    return Promise.reject(err);
  }
);

export default api;
