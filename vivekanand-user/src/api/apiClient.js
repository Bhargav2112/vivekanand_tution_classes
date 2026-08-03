import axios from 'axios';
import { getApiBaseUrl } from '@/api/config';

const API_URL = getApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    return Promise.reject(error.response?.data || { success: false, message: error.message || 'Request failed' });
  }
);
