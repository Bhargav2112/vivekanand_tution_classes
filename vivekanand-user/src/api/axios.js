import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1' : '');

export const api = axios.create({
  baseURL,
  withCredentials: true, // Send cookies for JWT auth
});

// Add interceptors
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    // If it's a 401 and we haven't retried yet, and it's not the login or refresh endpoints itself
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the token using the refresh_token cookie
        await axios.post(`${baseURL}/auth/refresh-token`, {}, { withCredentials: true });
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, let the error fall through (will trigger logout in AuthContext if needed)
        return Promise.reject(error.response?.data || { message: error.message });
      }
    }
    
    return Promise.reject(error.response?.data || { message: error.message });
  }
);
