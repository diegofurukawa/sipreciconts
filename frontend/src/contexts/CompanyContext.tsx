// src/contexts/CompanyContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '@/pages/Company/types';
import { apiService as api } from '@/services/api';
import { useAuth } from "@/core/auth";
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
    if (!isAuthenticated || !user?.company_id) {
      setCurrentCompany(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 1. Garante que o company_id está em lowercase
      const companyId = user.company_id.toLowerCase();
      
      // 2. Corrige a URL para incluir /api
      const { data } = await api.get<Company>(`/companies/${companyId}/`);
      
      if (!data) {
        throw new Error('Empresa não encontrada');
      }
      
      setCurrentCompany(data);
    } catch (err: any) {
      console.error('Erro ao carregar dados da empresa:', err);
      
      // 3. Melhor tratamento de erro
      let errorMessage = 'Não foi possível carregar os dados da empresa';
      
      if (err.response?.status === 404) {
        errorMessage = 'Empresa não encontrada';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      setError(errorMessage);
      setCurrentCompany(null);
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: errorMessage
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
  }, [isAuthenticated, user?.company_id]);

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