// src/contexts/CompanyContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '@/pages/Company/types/company_types';

// Importação corrigida - importe a instância apiService, não a classe
import { apiService } from '@/services/apiMainService';

import { useAuth } from "@/auth/context/AuthContext";
import { useToast } from '@/hooks/useToast';

interface CompanyContextData {
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

interface CompanyProviderProps {
  children: ReactNode;
}

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
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
      
      const companyId = user.company_id;
      
      // Usando o método get da instância apiService
      const company = await apiService.get<Company>(`/companies/${companyId}/`);

      if (!company) {
        throw new Error('Empresa não encontrada');
      }
      
      setCurrentCompany(company);

    } catch (err: any) {
      console.error('Erro ao carregar dados da empresa:', err);
      
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

  const contextValue: CompanyContextData = {
    currentCompany,
    loading,
    error,
    refreshCompany
  };

  return (
    <CompanyContext.Provider value={contextValue}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextData => {
  const context = useContext(CompanyContext);
  
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  
  return context;
};

// Se precisar exportar o contexto para testes
export { CompanyContext };