// src/pages/Login/components/LoginForm.tsx
import { SimpleAlert } from '../../../components/ui/simplealert';
import type { UseLoginFormReturn } from '../types';

interface LoginFormProps {
  form: UseLoginFormReturn;
}

export const LoginForm = ({ form }: LoginFormProps) => {
  const { formData, errors, isSubmitting, error, handleChange, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <SimpleAlert variant="destructive">
          {error}
        </SimpleAlert>
      )}

      <div>
        <label htmlFor="login" className="block text-sm font-medium text-gray-700">
          Usuário
        </label>
        <div className="mt-1">
          <input
            id="login"
            name="login"
            type="text"
            value={formData.login}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.login ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
          />
          {errors.login && (
            <p className="mt-1 text-sm text-red-600">{errors.login}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`appearance-none block w-full px-3 py-2 border ${
              errors.password ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg 
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Entrando...
          </div>
        ) : (
          'Entrar'
        )}
      </button>
    </form>
  );
};

export default LoginForm;