import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for JWT Access Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login/', { username, password });
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
    }
    return res.data;
  },
  register: async (username, email, password) => {
    const res = await api.post('/auth/register/', { username, email, password });
    if (res.data.tokens) {
      localStorage.setItem('access_token', res.data.tokens.access);
      localStorage.setItem('refresh_token', res.data.tokens.refresh);
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  },
  getMe: async () => {
    const res = await api.get('/auth/me/');
    return res.data;
  }
};

export const problemService = {
  getProblems: async (params = {}) => {
    const res = await api.get('/problems/', { params });
    return res.data;
  },
  getProblemDetail: async (id) => {
    const res = await api.get(`/problems/${id}/`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/problems/stats/');
    return res.data;
  },
  runCode: async (data) => {
    const res = await api.post('/run/', data);
    return res.data;
  },
  submitCode: async (data) => {
    const res = await api.post('/submit/', data);
    return res.data;
  }
};

export const userService = {
  getDashboard: async () => {
    const res = await api.get('/dashboard/');
    return res.data;
  },
  getSubmissions: async () => {
    const res = await api.get('/submissions/');
    return res.data;
  }
};

export default api;
