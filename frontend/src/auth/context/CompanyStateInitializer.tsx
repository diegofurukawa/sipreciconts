// src/auth/context/CompanyStateInitializer.tsx
import { useEffect } from 'react';
import { useCompany } from '../hooks/useCompany';
import { useAuth } from '../hooks/useAuth';
import { logAuthActivity } from '../utils/authHelpers';

/**
 * Component that initializes company state
 * This is used inside the CompanyProvider to initialize state when the app loads
 */
export const CompanyStateInitializer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loadCompanies, loading: companyLoading } = useCompany();
  
  // Initialize company state when authentication is ready
  useEffect(() => {
    const initializeCompanyState = async () => {
      if (isAuthenticated && !authLoading && !companyLoading) {
        logAuthActivity('Initializing company state');
        await loadCompanies();
      }
    };
    
    initializeCompanyState();
  }, [isAuthenticated, authLoading, companyLoading, loadCompanies]);
  
  return <>{children}</>;
};

export default CompanyStateInitializer;