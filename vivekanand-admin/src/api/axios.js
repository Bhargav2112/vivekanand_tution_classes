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
        await api.post('/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
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
