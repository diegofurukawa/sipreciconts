import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ApiError, ErrorCallbacks } from '../../types/api_types';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  errorCallbacks?: ErrorCallbacks;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: ApiError | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    if (error instanceof ApiError) {
      return {
        hasError: true,
        error,
      };
    }

    return {
      hasError: true,
      error: new ApiError({
        message: error.message || 'Um erro inesperado ocorreu',
        code: 'SERVER_ERROR'
      }),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (error instanceof ApiError && this.props.errorCallbacks) {
      switch (error.code) {
        case 'UNAUTHORIZED':
          this.props.errorCallbacks.onUnauthorized?.();
          break;
        case 'FORBIDDEN':
          this.props.errorCallbacks.onForbidden?.();
          break;
        case 'NOT_FOUND':
          this.props.errorCallbacks.onNotFound?.();
          break;
        case 'VALIDATION_ERROR':
          this.props.errorCallbacks.onValidationError?.(error.details);
          break;
        case 'SERVER_ERROR':
          this.props.errorCallbacks.onServerError?.();
          break;
        case 'NETWORK_ERROR':
          this.props.errorCallbacks.onNetworkError?.();
          break;
        default:
          this.props.errorCallbacks.onDefault?.(error);
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center p-6 max-w-sm mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Ops! Algo deu errado
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Um erro inesperado ocorreu'}
            </p>
            {this.state.error?.details && (
              <pre className="text-sm text-left bg-gray-100 p-4 rounded mb-4 overflow-auto">
                {JSON.stringify(this.state.error.details, null, 2)}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;