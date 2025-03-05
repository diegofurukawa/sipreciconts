// src/auth/hooks/useAuthState.ts
import { useCallback, useEffect, useContext, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/auth/context/AuthContext';
import { authService } from '@/auth/services/authService';
import { tokenService } from '@/auth/services/tokenService';
import { sessionService } from '@/auth/services/sessionService';
import { useToast } from '@/hooks/useToast';
import { cleanupUrlParams, isSessionExpiredRedirect, logAuthActivity } from '@/auth/utils/authHelpers';

/**
 * Hook to manage auth state internals
 * This handles the nitty-gritty details of auth state management
 */
export const useAuthState = () => {
  const context = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }

  const { dispatch } = context;
  
  // Flag to track if auth has been initialized
  const authInitialized = useRef(false);
  
  // Session expiry handling
  const sessionExpiryRef = useRef({
    isHandling: false,
    lastNotified: 0,
    minInterval: 5000 // 5 seconds between notifications
  });

  /**
   * Initializes authentication state from storage
   */
  const initializeAuth = useCallback(async () => {
    if (authInitialized.current) {
      console.log('⏩ useAuthState - Auth already initialized, skipping');
      return;
    }
    
    authInitialized.current = true;
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('🔍 useAuthState - Initializing auth state from storage');
      
      // Check for existing tokens and session
      const token = tokenService.getAccessToken();
      const session = sessionService.getSession();
      
      if (!token || !session) {
        console.log('⚠️ useAuthState - No valid auth data in storage');
        dispatch({ type: 'RESET_AUTH' });
        return;
      }
      
      // Check if the token is valid
      if (!tokenService.isTokenValid(token)) {
        console.log('⚠️ useAuthState - Stored token is invalid or expired, attempting refresh');
        
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          console.log('⚠️ useAuthState - No refresh token available');
          dispatch({ type: 'RESET_AUTH' });
          return;
        }
        
        try {
          // Try to refresh the token
          const response = await authService.refreshToken(refreshToken);
          tokenService.setAccessToken(response.access);
          
          if (response.refresh) {
            tokenService.setRefreshToken(response.refresh);
          }
          
          console.log('✅ useAuthState - Token refreshed successfully');
        } catch (error) {
          console.error('❌ useAuthState - Token refresh failed:', error);
          dispatch({ type: 'RESET_AUTH' });
          return;
        }
      }
      
      // Validate with the server
      const { is_valid, user } = await authService.validate();
      
      if (!is_valid || !user) {
        console.warn('⚠️ useAuthState - Auth validation failed');
        dispatch({ type: 'RESET_AUTH' });
        return;
      }
      
      console.log('✅ useAuthState - Auth validation successful');
      
      // Setup auth state with validated data
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_TOKEN', payload: token });
      dispatch({ type: 'SET_COMPANY_ID', payload: user.company_id });
      dispatch({ type: 'SET_SESSION_ID', payload: session.sessionId });
      
      // If the user object from validation is different, update session
      if (JSON.stringify(user) !== JSON.stringify(session.user)) {
        sessionService.updateSession({ user });
      }
      
      logAuthActivity('Auth initialized successfully', { 
        userId: user.id, 
        companyId: user.company_id 
      });
    } catch (error) {
      console.error('❌ useAuthState - Error initializing auth:', error);
      dispatch({ type: 'RESET_AUTH' });
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao inicializar autenticação' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);
  
  /**
   * Handles session expired events
   */
  const handleSessionExpired = useCallback(() => {
    const now = Date.now();
    const { isHandling, lastNotified, minInterval } = sessionExpiryRef.current;
    
    // Prevent multiple notifications in quick succession
    if (isHandling || (now - lastNotified) < minInterval) {
      return;
    }
    
    console.log('🔄 useAuthState - Handling session expired event');
    
    // Update control state
    sessionExpiryRef.current = {
      ...sessionExpiryRef.current,
      isHandling: true,
      lastNotified: now
    };
    
    // Clear auth data
    authService.clearAuthData();
    dispatch({ type: 'RESET_AUTH' });
    
    // Show notification if not already on login page
    if (location.pathname !== '/login') {
      showToast({
        type: 'warning',
        title: 'Sessão expirada',
        message: 'Sua sessão expirou. Por favor, faça login novamente.'
      });
      
      // Redirect to login page with expired session parameter
      navigate('/login?session=expired', { replace: true });
    }
    
    // Release lock after processing
    setTimeout(() => {
      sessionExpiryRef.current.isHandling = false;
    }, 500);
  }, [dispatch, navigate, location.pathname, showToast]);
  
  /**
   * Sets up event listeners for auth-related events
   */
  useEffect(() => {
    console.log('🔄 useAuthState - Setting up auth event listeners');
    
    // Listen for session expired events
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    
    // Check for session expired in URL
    if (location.pathname === '/login' && isSessionExpiredRedirect()) {
      console.log('🔍 useAuthState - Detected session expired parameter in URL');
      cleanupUrlParams();
      
      const now = Date.now();
      if ((now - sessionExpiryRef.current.lastNotified) > sessionExpiryRef.current.minInterval) {
        sessionExpiryRef.current.lastNotified = now;
        
        showToast({
          type: 'warning',
          title: 'Sessão expirada',
          message: 'Sua sessão expirou. Por favor, faça login novamente.'
        });
      }
    }
    
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, [handleSessionExpired, location.pathname, showToast]);
  
  /**
   * Sets up token refresh timer
   */
  useEffect(() => {
    // Only setup refresh timer if we're authenticated
    const token = tokenService.getAccessToken();
    if (!token) return;
    
    // Don't bother with refresh timer if the token is already invalid
    if (!tokenService.isTokenValid(token)) return;
    
    console.log('🔄 useAuthState - Setting up token refresh timer');
    
    // Get token expiration
    const tokenExp = tokenService.getTokenExpiration(token);
    if (!tokenExp) return;
    
    // Calculate time until refresh (5 minutes before expiration)
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes in ms
    const now = new Date();
    
    // Time until refresh = (expiration time - now) - buffer
    let timeUntilRefresh = tokenExp.getTime() - now.getTime() - refreshBuffer;
    
    // If the token is about to expire (or already expired), refresh immediately
    if (timeUntilRefresh < 0) {
      timeUntilRefresh = 0;
    }
    
    console.log(`⏰ useAuthState - Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);
    
    // Set up timer for token refresh
    const refreshTimer = setTimeout(async () => {
      console.log('⏰ useAuthState - Token refresh timer triggered');
      
      try {
        const refreshToken = tokenService.getRefreshToken();
        if (refreshToken) {
          const response = await authService.refreshToken(refreshToken);
          tokenService.setAccessToken(response.access);
          
          if (response.refresh) {
            tokenService.setRefreshToken(response.refresh);
          }
          
          dispatch({ type: 'SET_TOKEN', payload: response.access });
          console.log('✅ useAuthState - Token refreshed automatically');
        }
      } catch (error) {
        console.error('❌ useAuthState - Automatic token refresh failed:', error);
        handleSessionExpired();
      }
    }, timeUntilRefresh);
    
    // Clean up timer when component unmounts
    return () => {
      clearTimeout(refreshTimer);
    };
  }, [dispatch, handleSessionExpired]);

  return {
    initializeAuth
  };
};