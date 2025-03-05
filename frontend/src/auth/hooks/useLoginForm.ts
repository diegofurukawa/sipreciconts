// src/auth/hooks/useLoginForm.ts
import { useState } from 'react';
import { useAuth } from './useAuth';
import { loginCredentialsSchema, type LoginFormData } from '@/auth/utils/authValidators';
import { isSessionExpiredRedirect, cleanupUrlParams } from '@/auth/utils/authHelpers';

interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  serverError: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  resetForm: () => void;
}

/**
 * Hook for managing login form state and submission
 */
export const useLoginForm = (): UseLoginFormReturn => {
  const { signIn, error: authError } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({ 
    login: '', 
    password: '' 
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use auth context error for server errors
  const serverError = authError;

  /**
   * Validates form data using Zod schema
   */
  const validateForm = (): boolean => {
    try {
      // Validate with Zod schema
      loginCredentialsSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      // Extract and format Zod errors
      const formattedErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
      }
      
      setErrors(formattedErrors);
      return false;
    }
  };

  /**
   * Handles input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check for session expired redirect and clean URL
    if (isSessionExpiredRedirect()) {
      cleanupUrlParams();
    }
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await signIn({
        login: formData.login.trim(),
        password: formData.password
      });
      
      // Form will be reset on successful redirect
    } catch (error) {
      console.error('Login form submission error:', error);
      
      // Keep password for UX - some login systems require exact password retry
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Resets form state
   */
  const resetForm = () => {
    setFormData({ login: '', password: '' });
    setErrors({});
    setIsSubmitting(false);
  };

  return {
    formData,
    errors,
    isSubmitting,
    serverError,
    handleChange,
    handleSubmit,
    resetForm
  };
};

export default useLoginForm;