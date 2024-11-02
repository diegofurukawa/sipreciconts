// src/contexts/CompanyContext.tsx (Novo)
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Company } from '@/pages/Company/types';
import { api } from '@/services/api';

interface CompanyContextData {
  currentCompany: Company | null;
  loading: boolean;
  error: string | null;
  refreshCompany: () => Promise<void>;
}

const CompanyContext = createContext<CompanyContextData>({} as CompanyContextData);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCompany = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Company>('/companies/current');
      setCurrentCompany(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados da empresa');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCompany();
  }, []);

  return (
    <CompanyContext.Provider 
      value={{ 
        currentCompany, 
        loading, 
        error, 
        refreshCompany 
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => useContext(CompanyContext);