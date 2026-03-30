import axios from 'axios';

// Configuración central de Axios para apuntar al backend de NodeJS
// En Vite (el motor detrás de nuestra app React), las variables de entorno públicas
// SIEMPRE deben empezar con el prefijo "VITE_".
// Abajo le pedimos que intente leer la variable de producción, o que use localhost por defecto.
//
// IMPORTANTE: Asegúrate de que la URL que guardes en Vercel NO tenga un slash (/) al final.
// Si tu VITE_API_URL = "https://mi-backend.onrender.com/api/" (con slash al final)
// y nosotros hacemos api.get('/users'), terminará formándose "https://mi-backend.onrender.com/api//users".
// Ese doble slash (//) confundirá a tu servidor en Render y te dará un error 404 (Not Found).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api', // Conexión Dinámica Nube/Local
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
