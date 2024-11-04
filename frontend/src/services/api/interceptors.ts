// src/services/api/interceptors.ts
import { AxiosInstance } from 'axios';
import { TokenService } from './token';
import { handleApiError } from './utils';

export const setupInterceptors = (api: AxiosInstance) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = TokenService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(handleApiError(error))
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          const refreshToken = TokenService.getRefreshToken();
          if (refreshToken) {
            const response = await api.post('/token/refresh/', {
              refresh: refreshToken,
            });
            
            const { access } = response.data;
            TokenService.setAccessToken(access);
            
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          TokenService.clearAll();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(handleApiError(error));
    }
  );

  return api;
};