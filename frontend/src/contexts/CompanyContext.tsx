// src/contexts/CompanyContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '@/pages/Company/types';
import { api } from '@/services/api';
import { useAuth } from './AuthContext';

interface CompanyContextData {
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const refreshCompany = async () => {
    // Se não estiver autenticado, não faz a chamada
    if (!isAuthenticated) {
      setCurrentCompany(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get<Company>('/api/companies/current/');
      setCurrentCompany(data);
    } catch (err) {
      console.error('Erro ao carregar dados da empresa:', err);
      setError('Erro ao carregar dados da empresa');
      setCurrentCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Só busca a empresa se estiver autenticado
    if (isAuthenticated) {
      refreshCompany();
    } else {
      setCurrentCompany(null);
      setLoading(false);
    }
  }, [isAuthenticated]); // Agora depende da autenticação

  const value = {
    currentCompany,
    loading,
    error,
    refreshCompany
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};

const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

export {
  useCompany
  ,CompanyProvider
};