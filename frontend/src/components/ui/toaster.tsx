// src/components/ui/toaster.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { createPortal } from 'react-dom';

// Define a store for toast messages
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration?: number;
}

// Create our toasts store
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

// Functions to manage toasts
const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  
  // Notify listeners that the toasts array has changed
  listeners.forEach(listener => listener([...toasts]));
  
  // Auto-dismiss after duration
  setTimeout(() => {
    removeToast(id);
  }, toast.duration || 5000);
  
  return id;
};

const removeToast = (id: string) => {
  toasts = toasts.filter(toast => toast.id !== id);
  listeners.forEach(listener => listener([...toasts]));
};

// Hook to subscribe to toast changes
const useToasts = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>(toasts);
  
  useEffect(() => {
    listeners.push(setCurrentToasts);
    return () => {
      listeners = listeners.filter(listener => listener !== setCurrentToasts);
    };
  }, []);
  
  return currentToasts;
};

// External API to be used in other components
export const toast = {
  success: (message: string, options?: { title?: string; duration?: number }) => 
    addToast({ message, type: 'success', ...options }),
  error: (message: string, options?: { title?: string; duration?: number }) => 
    addToast({ message, type: 'error', ...options }),
  info: (message: string, options?: { title?: string; duration?: number }) => 
    addToast({ message, type: 'info', ...options }),
  warning: (message: string, options?: { title?: string; duration?: number }) => 
    addToast({ message, type: 'warning', ...options }),
};

// Toast component styling
const toastVariants = cva(
  "relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      }
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

// Individual Toast component
const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const IconComponent = iconMap[toast.type];

  return (
    <div 
      className={toastVariants({ variant: toast.type })}
      style={{ 
        animation: `slideIn 0.2s ease-out, fadeOut 0.2s ease-in forwards ${(toast.duration || 5000) - 300}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <IconComponent className="h-5 w-5" />
        <div>
          {toast.title && (
            <div className="font-medium">{toast.title}</div>
          )}
          <div className="text-sm">{toast.message}</div>
        </div>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="absolute top-2 right-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Main Toaster component
export const Toaster: React.FC = () => {
  const toasts = useToasts();

  // Create portal to render toasts
  const portalRoot = typeof document !== 'undefined' ? document.body : null;
  
  if (!portalRoot || toasts.length === 0) {
    return null;
  }

  return createPortal(
    <div
      className="fixed bottom-0 right-0 z-50 flex flex-col items-end gap-2 p-4 max-h-screen overflow-hidden pointer-events-none"
      style={{ maxWidth: '420px' }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>,
    portalRoot
  );
};

export default Toaster;