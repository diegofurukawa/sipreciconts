// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import { APIError } from '../services/api/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  loadingInitial?: boolean;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options.loadingInitial ?? false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(...args);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof APIError ? err : new Error('Erro inesperado');
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  return { execute, data, loading, error };
}