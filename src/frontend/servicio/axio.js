import axios from 'axios';

// Asegúrate de que la URL esté definida correctamente en tu archivo .env
const URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: URL, // Configura la URL base para las peticiones
});

// Interceptor para manejar las respuestas de la API
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, solo la retornamos
  (error) => {
    // Verificación de errores en la respuesta
    if (error.response?.status === 401) {
      // Si la respuesta es un error de autenticación, redirige al login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'; // Redirigir a la página de login si no está autenticado
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      console.error('Acceso prohibido');
    } else if (error.response?.status === 404) {
      console.error('Recurso no encontrado (404)');
    } else if (error.response?.status >= 500) {
      console.error('Error del servidor');
      alert('Error interno del servidor');
    }

    // Se rechaza la promesa y se maneja el error
    return Promise.reject(error);
  }
);

export default api;
