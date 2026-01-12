import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true, // 🔑 HttpOnly cookies
});

export default api;
