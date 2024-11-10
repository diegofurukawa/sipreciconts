// src/contexts/CompanyContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '@/pages/Company/types';
import { apiService as api } from '@/services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/useToast';

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
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const refreshCompany = async () => {
    // Se não estiver autenticado ou não tiver company_id, não faz a chamada
    if (!isAuthenticated || !user?.company_id) {
      setCurrentCompany(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Usando o company_id do usuário autenticado
      const { data } = await api.get<Company>(`/companies/${user.company_id}/`);
      
      if (!data) {
        throw new Error('Empresa não encontrada');
      }
      
      setCurrentCompany(data);
    } catch (err) {
      console.error('Erro ao carregar dados da empresa:', err);
      setError('Erro ao carregar dados da empresa');
      setCurrentCompany(null);
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os dados da empresa'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.company_id) {
      refreshCompany();
    } else {
      setCurrentCompany(null);
      setLoading(false);
    }
  }, [isAuthenticated, user?.company_id]); // Depende da autenticação e do company_id

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

export { useCompany, CompanyProvider };