import axios from 'axios';

// Configuración central de Axios para apuntar al backend de NodeJS
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Tu puerto del backend
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para inyectar automáticamente el Token JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Guardaremos el JWT en localStorage al hacer Login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
