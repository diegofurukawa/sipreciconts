// src/services/api/instance.ts
import axios from 'axios';
import { API_CONFIG } from './config';
import type { CustomRequestHeaders } from '../../types/api.types';

export const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});