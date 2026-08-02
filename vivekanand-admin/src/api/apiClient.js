import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api/v1' : '');

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required to send cookies
});

// Add a request interceptor to append tokens if needed (though cookies are used)
apiClient.interceptors.request.use((config) => {
  // If we decide to use localStorage instead of cookies for tokens
  // const token = localStorage.getItem('token');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Add a response interceptor to handle 401s and token refreshes
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   try {
    //     await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
    //     return apiClient(originalRequest);
    //   } catch (e) {
    //     // Handle refresh token failure (e.g., logout)
    //   }
    // }
    return Promise.reject(error);
  }
);
