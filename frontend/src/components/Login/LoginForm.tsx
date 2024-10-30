// src/components/Login/LoginForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  login: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();
  const { login } = useAuth();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.login, data.password);
    } catch (error) {
      setError('root', { message: 'Credenciais inválidas' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
      <div>
        <label className="block text-sm font-medium text-gray-700">Login</label>
        <input
          {...register('login', { required: 'Login é obrigatório' })}
          type="text"
          autoComplete="off"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.login && (
          <p className="mt-1 text-sm text-red-600">{errors.login.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          {...register('password', { required: 'Senha é obrigatória' })}
          type="password"
          autoComplete="new-password"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {errors.root && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-600">{errors.root.message}</p>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Entrar
      </button>
    </form>
  );
};