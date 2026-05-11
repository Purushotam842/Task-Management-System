import axios from 'axios';

const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://task-management-system-313k.onrender.com/api/v1';

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

