// src/pages/Login/index.tsx
import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState('');

  // Pega a rota de redirecionamento da navegação ou usa a home como padrão
  const from = location.state?.from || '/';

  // Verificar se há um parâmetro de sessão expirada na URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionExpired = params.get('session') === 'expired';
    
    if (sessionExpired) {
      showToast({
        type: 'warning',
        title: 'Sessão expirada',
        message: 'Sua sessão expirou. Por favor, faça login novamente.'
      });
      
      // Limpar o parâmetro da URL para evitar mensagens repetidas em refreshes
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search, showToast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const formData = new FormData(event.currentTarget);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    if (!login || !password) {
      setError('Preencha todos os campos');
      return;
    }
    
    try {
      await signIn({ login, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Erro de login:', err);
      
      // Tratamento detalhado do erro
      let errorMessage = 'Erro ao realizar login';
      
      if (err.response?.status === 401) {
        errorMessage = 'Usuário ou senha inválidos';
      } else if (err.response?.status === 403) {
        errorMessage = 'Usuário sem permissão de acesso';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo ou Imagem */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">SiPreciConts</h2>
          <p className="mt-2 text-sm text-gray-600">Sistema de Precificação e Contratos</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="login" className="sr-only">Usuário</label>
              <input
                id="login"
                name="login"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Usuário"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-emerald-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
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
  );
};

// Também exportamos como default para suportar lazy loading se necessário
export default LoginPage;