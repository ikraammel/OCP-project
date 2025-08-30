import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
});

// Interceptor pour ajouter le token JWT
axiosInstance.interceptors.request.use((config) => {
  // Récupération directe du token depuis le localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
