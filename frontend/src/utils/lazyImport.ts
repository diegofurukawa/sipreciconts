// src/utils/lazyImport.ts
import * as React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingState } from '@/components/feedback/LoadingState';

/**
 * Utilitário para importação lazy de componentes default com tratamento de erros
 */
export function lazyImportDefault<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const LazyComponent = React.lazy(factory);

  function LazyWrapper(props: React.ComponentProps<T>) {
    return React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        React.Suspense,
        { fallback: React.createElement(LoadingState, null) },
        React.createElement(LazyComponent, props)
      )
    );
  }

  return LazyWrapper;
}

/**
 * Utilitário para importação lazy com tratamento de erros e carregamento
 */
export function lazyImport<
  T extends React.ComponentType<any>,
  I extends { [K in keyof I]: T },
  K extends keyof I
>(factory: () => Promise<I>, name: K) {
  const LazyComponent = React.lazy(() =>
    factory().then(module => ({
      default: module[name] as unknown as React.ComponentType<any>,
    }))
  );

  function LazyWrapper(props: React.ComponentProps<I[K]>) {
    return React.createElement(
      ErrorBoundary,
      null,
      React.createElement(
        React.Suspense,
        { fallback: React.createElement(LoadingState, null) },
        React.createElement(LazyComponent, props)
      )
    );
  }

  return LazyWrapper;
}

export default {
  lazyImport,
  lazyImportDefault,
};