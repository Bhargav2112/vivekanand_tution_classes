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
  (error) => {
    return Promise.reject(
      error.response?.data || { success: false, message: error.message || 'Request failed' }
    );
  }
);

export const apiClient = api;
