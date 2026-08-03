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
  (response) => {
    const payload = response.data;
    if (payload && typeof payload === 'object' && 'success' in payload) {
      return { ...response, data: payload };
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config || {};
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        if (refreshResponse?.data?.success) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError?.response?.data || { success: false, message: 'Session expired' });
      }
    }

    return Promise.reject(error.response?.data || { success: false, message: error.message || 'Request failed' });
  }
);
