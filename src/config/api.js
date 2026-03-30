import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Conexión Dinámica Nube/Local
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Guardaremos el JWT en localStorage al hacer Login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
