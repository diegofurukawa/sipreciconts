// src/components/ui/file-input.tsx
import * as React from "react";

export interface FileInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  id?: string;
  accept?: string;
  error?: string;
  hideLabel?: boolean;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className = "", label, id, accept, error, hideLabel = false, ...props }, ref) => {
    // Gera um ID único se não fornecido
    const inputId = id || `file-input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className="space-y-2">
        {label && !hideLabel && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type="file"
          className={`
            ${className}
            ${hideLabel ? 'sr-only' : ''}
            file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
            file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700
            hover:file:bg-gray-200 focus:outline-none
            ${error ? 'border-red-500' : 'border-gray-200'}
          `}
          accept={accept}
          aria-label={hideLabel && label ? label : undefined}
          title={hideLabel && label ? label : undefined}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = "FileInput";

export { FileInput };