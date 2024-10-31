// src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContextProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { ApiErrorBoundary } from './components/ErrorBoundary/ApiErrorBoundary';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ApiErrorBoundary>
        <ToastContextProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <AppRoutes />
            </div>
          </AuthProvider>
        </ToastContextProvider>
      </ApiErrorBoundary>
    </BrowserRouter>
  );
};

export default App;