// src/hooks/useToast.ts
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
import type { ToastType } from '../contexts/ToastContext';

interface ToastOptions {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastContextProvider');
  }

  return {
    showToast: (options: ToastOptions) => context.showToast(options)
  };
}