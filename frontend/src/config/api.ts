// src/config/api.ts
import { ApiConfig } from '../services/api/types';

export const API_CONFIG: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
};