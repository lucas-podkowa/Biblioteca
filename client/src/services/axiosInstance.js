import axios from "axios";

// URL base de la API desde variable de entorno
// En Vite, las variables de entorno deben tener el prefijo VITE_
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  // 5 segundos de timeout
});

export default axiosInstance;
