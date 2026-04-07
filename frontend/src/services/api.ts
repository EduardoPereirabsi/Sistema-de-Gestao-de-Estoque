import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (status === 403) {
      toast.error('Acesso negado. Você não tem permissão para esta ação.');
    } else if (status === 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.');
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
