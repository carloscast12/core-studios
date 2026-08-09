import axios from 'axios'

// Creamos una instancia de axios con la URL base de nuestro backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:2345/api',
})

// Antes de cada petición, añadimos el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export default api;