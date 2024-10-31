// src/services/api/types.ts
import { AxiosInstance } from 'axios';

export interface ApiConfig {
  baseURL: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  [key: string]: any;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export interface BaseService {
  api: AxiosInstance;
  handleError: (error: any) => APIError;
}