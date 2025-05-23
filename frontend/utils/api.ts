// utils/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

// 1. Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://oceanic-servernz.vercel.app/', // Keep the trailing slash
  withCredentials: true,
  timeout: 10000,
});

// 2. Request queue and refresh state
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

// 3. Request interceptor to attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 4. Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        // Use full URL for refresh token endpoint
        const { data } = await axios.get('https://oceanic-servernz.vercel.app/api/v1/users/refreshToken', {
          withCredentials: true
        });
        
        const { accessToken } = data;
        localStorage.setItem('accessToken', accessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        failedRequestsQueue.forEach(({ resolve }) => resolve(accessToken));
        failedRequestsQueue = [];
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        failedRequestsQueue.forEach(({ reject }) => reject(refreshError));
        failedRequestsQueue = [];
        
        toast.error('Session expired. Please login again.');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Error handling for non-401 errors
    if (error.response) {
      const errorMessage = (error.response.data as { message?: string })?.message || 'Request failed';
      if (error.response.status !== 401) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error('Request failed - please try again');
    }

    return Promise.reject(error);
  }
);

export default api;