// src/contexts/ToastContext.tsx
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

// Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextData {
  showToast: (data: Omit<ToastData, 'id'>) => void;
}

// Context
const ToastContext = createContext<ToastContextData>({} as ToastContextData);

// Constants
const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />
} as const;

const DEFAULT_DURATION = 5000;

// Provider Component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(({ 
    type, 
    title, 
    message, 
    duration = DEFAULT_DURATION 
  }: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const newToast: ToastData = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Automatically remove toast after duration
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToastProvider>
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.type}
            duration={toast.duration}
            className="flex items-start gap-3"
          >
            <div className="flex w-full gap-3">
              <div className="flex-shrink-0">
                {TOAST_ICONS[toast.type]}
              </div>
              <div className="flex-1 grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
            <ToastClose className="flex-shrink-0" />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};

// Custom Hook
export const useToast = (): ToastContextData => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

// Exports
export { ToastContext };
export default ToastProvider;