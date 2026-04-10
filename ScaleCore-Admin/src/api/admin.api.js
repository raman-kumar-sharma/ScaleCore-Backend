import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth (admin logs in via same user login endpoint)
export const login = (data) => api.post('/users/login', data);

// Admin endpoints
export const getUsers = () => api.get('/admin/users');
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/status`);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
