// src/components/ErrorBoundary/ApiErrorBoundary.tsx
import React, { Component, ErrorInfo } from 'react';
import { APIError } from '../../services/api/types';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('API Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      if (error instanceof APIError) {
        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-800">
              Erro na operação
            </h3>
            <p className="mt-2 text-sm text-red-700">
              {error.message}
            </p>
            {error.code && (
              <p className="mt-1 text-xs text-red-600">
                Código: {error.code}
              </p>
            )}
          </div>
        );
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h3 className="text-lg font-medium text-red-800">
            Erro inesperado
          </h3>
          <p className="mt-2 text-sm text-red-700">
            Ocorreu um erro ao processar sua solicitação.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}