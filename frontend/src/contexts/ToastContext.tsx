// src/contexts/ToastContext.tsx
import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "../components/ui/toast";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

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

// Exportar o contexto para poder ser usado no hook
export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />
};

export const ToastContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(({ type, title, message, duration = 5000 }: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = {
      id,
      type,
      title,
      message,
      duration,
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);

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
          >
            <div className="flex gap-3">
              {TOAST_ICONS[toast.type]}
              <div className="grid gap-1">
                {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
};