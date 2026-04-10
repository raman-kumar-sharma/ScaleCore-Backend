import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api/users' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (formData) => api.post('/register', formData);
export const login = (data) => api.post('/login', data);
export const forgotPassword = (email) => api.post('/forgot-password', { email });
export const resetPassword = (data) => api.post('/reset-password', data);
export const getProfile = () => api.get('/profile');
export const updateProfile = (formData) => api.put('/profile', formData);
export const updateUsername = (username) => api.patch('/profile/username', { username });
export const updateEmail = (email) => api.patch('/profile/email', { email });
export const updatePassword = (data) => api.patch('/profile/password', data);
