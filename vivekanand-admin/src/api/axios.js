import axios from 'axios';
import { getApiBaseUrl } from '@/api/config';

const baseURL = getApiBaseUrl();

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(
        error.response?.data || { success: false, message: error.message || 'Request failed' }
      );
    }

    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh-token');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await api.post('/auth/refresh-token', { refresh_token: refreshToken });
        if (res.data?.access_token) {
          localStorage.setItem('access_token', res.data.access_token);
        }
        if (res.data?.refresh_token) {
          localStorage.setItem('refresh_token', res.data.refresh_token);
        }
        
        // Update the original request's authorization header
        if (originalRequest.headers && res.data?.access_token) {
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(
          refreshError.response?.data || { success: false, message: 'Unauthenticated' }
        );
      }
    }

    return Promise.reject(
      error.response?.data || { success: false, message: error.message || 'Request failed' }
    );
  }
);

export const apiClient = api;
