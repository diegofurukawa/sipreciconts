// src/components/ErrorBoundary/index.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Atualiza o estado para que a próxima renderização mostre a UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Você pode também registrar o erro em um serviço de relatório de erros
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Você pode renderizar qualquer UI customizada de fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Algo deu errado
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {this.state.error?.message || 'Ocorreu um erro inesperado ao renderizar este componente.'}
          </p>
          <Button 
            onClick={this.resetErrorBoundary}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Também podemos criar um wrapper para errros de API específicos
export const ApiErrorBoundary = ({ children, ...props }: Props) => {
  const fallback = (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Erro de comunicação com a API
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        Ocorreu um problema ao se comunicar com o servidor. Verifique sua conexão e tente novamente.
      </p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
        className="flex items-center"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Recarregar página
      </Button>
    </div>
  );

  return <ErrorBoundary fallback={fallback} {...props}>{children}</ErrorBoundary>;
};

export default ErrorBoundary;