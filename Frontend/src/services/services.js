import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {

  },
});

// request interceptor for debugging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  console.log('API Request:', config.method, config.url);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token added to request');
  } else {
    console.log('No token found');
  }
  return config;
});

//response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      console.log('Token expired or invalid');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;