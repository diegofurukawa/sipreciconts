// src/auth/context/AuthProvider.tsx
import { useEffect } from 'react';
import { AuthProvider as BaseAuthProvider } from './AuthContext';
import { useAuthState } from '../hooks/useAuthState';
import { logAuthActivity } from '../utils/authHelpers';

/**
 * Extended AuthProvider with initialization logic
 * This component wraps the base AuthProvider and handles:
 * - Initializing auth state from storage
 * - Setting up event listeners for auth events
 * - Automatic token refresh
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  useEffect(() => {
    logAuthActivity('AuthProvider mounted');
    
    return () => {
      logAuthActivity('AuthProvider unmounted');
    };
  }, []);

  return (
    <BaseAuthProvider>
      <AuthStateManager>
        {children}
      </AuthStateManager>
    </BaseAuthProvider>
  );
};

/**
 * Internal component to manage auth state
 * This is separated to avoid re-rendering the whole AuthProvider
 */
const AuthStateManager: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { initializeAuth } = useAuthState();
  
  // Initialize auth state when component mounts
  useEffect(() => {
    logAuthActivity('AuthStateManager - Initializing auth state');
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
};