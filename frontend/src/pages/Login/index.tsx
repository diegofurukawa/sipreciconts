// src/pages/Login/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface LoginFormData {
  login: string;
  password: string;
}

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.login, data.password);
      // O redirecionamento será feito pelo AuthContext
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Erro no login',
        message: error instanceof Error ? error.message : 'Erro ao realizar login'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-emerald-600">
          SiPreciConts
        </h1>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Entre na sua conta
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Login
              </label>
              <div className="mt-1">
                <input
                  id="login"
                  type="text"
                  autoComplete="username"
                  {...register('login', { 
                    required: 'Login é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Login deve ter pelo menos 3 caracteres'
                    }
                  })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors.login
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
                {errors.login && (
                  <p className="mt-2 text-sm text-red-600" id="login-error">
                    {errors.login.message}
                  </p>
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
                  type="password"
                  autoComplete="current-password"
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter pelo menos 6 caracteres'
                    }
                  })}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
                    errors.password
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;