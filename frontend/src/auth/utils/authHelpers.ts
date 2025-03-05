// src/auth/utils/authHelpers.ts
import { AuthUser } from '@/auth/types/auth_types';

/**
 * Helper functions for authentication related operations
 */

/**
 * Gets the display name for a user
 * @param user User object
 * @returns Formatted display name
 */
export const getUserDisplayName = (user: AuthUser | null): string => {
  if (!user) return '';
  
  return user.user_name || user.name || user.login;
};

/**
 * Extracts and returns query parameters from URL
 * @param paramName Name of the parameter to extract
 * @returns Value of the parameter or null
 */
export const getQueryParam = (paramName: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
};

/**
 * Checks if the current URL indicates a session expiry
 * @returns True if URL indicates expired session
 */
export const isSessionExpiredRedirect = (): boolean => {
  return getQueryParam('session') === 'expired';
};

/**
 * Cleans up URL by removing query parameters
 */
export const cleanupUrlParams = (): void => {
  // Replace current URL without query parameters
  if (window.history && window.location.search) {
    const newUrl = window.location.pathname + window.location.hash;
    window.history.replaceState({}, document.title, newUrl);
  }
};

/**
 * Gets redirect URL from query parameters
 * @param defaultRedirect Default path to redirect to
 * @returns URL to redirect to
 */
export const getRedirectUrl = (defaultRedirect: string = '/'): string => {
  const redirect = getQueryParam('redirect');
  if (redirect) {
    // Ensure the redirect URL is relative to prevent open redirect vulnerability
    try {
      const url = new URL(redirect, window.location.origin);
      if (url.origin === window.location.origin) {
        return url.pathname + url.search + url.hash;
      }
    } catch (e) {
      // If the URL is invalid, use the redirect as a path directly
      // as long as it doesn't start with http/https
      if (!redirect.match(/^https?:\/\//i)) {
        return redirect;
      }
    }
  }
  
  return defaultRedirect;
};

/**
 * Formats an error message for display
 * @param error Error object or string
 * @returns Formatted error message
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  
  if (error?.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Ocorreu um erro. Tente novamente.';
};

/**
 * Logs user authentication related activity
 * @param action Action being performed
 * @param details Additional details
 */
export const logAuthActivity = (action: string, details?: Record<string, any>): void => {
  console.log(`🔐 Auth activity - ${action}`, details || {});
  
  // In development, you might want to persist these logs
  if (process.env.NODE_ENV === 'development') {
    const existingLogs = JSON.parse(localStorage.getItem('auth_logs') || '[]');
    const newLog = {
      timestamp: new Date().toISOString(),
      action,
      details: details || {}
    };
    
    existingLogs.push(newLog);
    
    // Keep only the last 50 logs
    if (existingLogs.length > 50) {
      existingLogs.shift();
    }
    
    localStorage.setItem('auth_logs', JSON.stringify(existingLogs));
  }
};