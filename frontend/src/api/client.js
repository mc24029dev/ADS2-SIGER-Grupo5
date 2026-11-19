import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/siger/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// INTERCEPTOR DE PETICIONES
api.interceptors.request.use(
  (config) => {
    const authBase64 = localStorage.getItem("siger_auth");
    
    if (authBase64) {
      config.headers.Authorization = `Basic ${authBase64}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPUESTAS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("siger_auth");
      window.location.href = "/login";
    }
    
    const mensaje = error.response?.data?.mensaje || error.response?.data?.message || "Error de conexión";
    return Promise.reject(new Error(mensaje));
  }
);

export default api;