// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { ApiError, ErrorCallbacks } from '../services/api/types';

interface UseApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options?: {
    onSuccess?: (data: T) => void;
    errorCallbacks?: ErrorCallbacks;
    immediate?: boolean;
    initialData?: T;
  }
): UseApiResponse<T> {
  const [data, setData] = useState<T | null>(options?.initialData || null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = (error: ApiError) => {
    if (options?.errorCallbacks) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          options.errorCallbacks.onUnauthorized?.();
          break;
        case 'FORBIDDEN':
          options.errorCallbacks.onForbidden?.();
          break;
        case 'NOT_FOUND':
          options.errorCallbacks.onNotFound?.();
          break;
        case 'VALIDATION_ERROR':
          options.errorCallbacks.onValidationError?.(error.details);
          break;
        case 'SERVER_ERROR':
          options.errorCallbacks.onServerError?.();
          break;
        case 'NETWORK_ERROR':
          options.errorCallbacks.onNetworkError?.();
          break;
        default:
          options.errorCallbacks.onDefault?.(error);
      }
    }
  };

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        options?.onSuccess?.(result);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        handleError(apiError);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(options?.initialData || null);
    setError(null);
    setLoading(false);
  }, [options?.initialData]);

  return { data, error, loading, execute, reset };
}