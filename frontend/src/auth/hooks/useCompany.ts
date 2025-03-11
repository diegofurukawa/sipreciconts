// src/auth/hooks/useCompany.ts
import { useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompanyContext } from '@/auth/context';
import { Company } from '../types/company_types';
import { companyService } from '../services/companyService';
import { useToast } from '../../hooks/useToast';
import { useAuth } from './useAuth';

interface UseCompanyReturn {
  // State
  currentCompany: Company | null;
  // availableCompanies: Company[];
  loading: boolean;
  error: string | null;
  
  // Actions
  switchCompany: (companyId: string) => Promise<void>;
  loadCompanies: () => Promise<void>;
  refreshCompanyData: () => Promise<void>;
}

/**
 * Hook for managing company selection and state
 */
export const useCompany = (): UseCompanyReturn => {
  const context = useContext(CompanyContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  
  const { state, dispatch } = context;
  
  /**
   * Initialize company state on mount
   */
  useEffect(() => {
    const initializeCompany = async () => {
      if (isAuthenticated && !state.currentCompany && !state.loading) {
        await loadCompanies();
      }
    };
    
    initializeCompany();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  
  /**
   * Load available companies from API
   */
  const loadCompanies = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Get companies from API
      const response = await companyService.getCompanies();
      dispatch({ type: 'SET_AVAILABLE_COMPANIES', payload: response.results });
      
      // Initialize current company if not set
      if (!state.currentCompany && response.results.length > 0) {
        // Try to get from storage first
        const storedCompany = companyService.getCurrentCompany();
        
        if (storedCompany) {
          // Verify if stored company is in available companies
          const isAvailable = response.results.some(
            company => company.company_id === storedCompany.company_id
          );
          
          if (isAvailable) {
            dispatch({ type: 'SET_CURRENT_COMPANY', payload: storedCompany });
          } else {
            // If stored company is not available, use first available
            dispatch({ type: 'SET_CURRENT_COMPANY', payload: response.results[0] });
            companyService.setCurrentCompany(response.results[0]);
          }
        } else {
          // No stored company, use first available
          dispatch({ type: 'SET_CURRENT_COMPANY', payload: response.results[0] });
          companyService.setCurrentCompany(response.results[0]);
        }
      }
    } catch (error) {
      console.error('❌ useCompany - Error loading companies:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar empresas' });
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar a lista de empresas'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated, state.currentCompany, dispatch, showToast]);
  
  /**
   * Switch to a different company
   */
  const switchCompany = useCallback(async (companyId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Verify if company is in available companies
      // const isAvailable = state.availableCompanies.some(
      //   company => company.company_id === companyId
      // );
      
      if (!isAvailable) {
        throw new Error('Empresa não disponível');
      }
      
      // Switch company in API
      const company = await companyService.switchCompany(companyId);
      
      // Update state
      dispatch({ type: 'SET_CURRENT_COMPANY', payload: company });
      
      showToast({
        type: 'success',
        title: 'Empresa alterada',
        message: `Agora você está usando ${company.name}`
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (error) {
      console.error('❌ useCompany - Error switching company:', error);
      
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao trocar de empresa' });
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Não foi possível trocar de empresa'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, navigate, showToast]);
  
  /**
   * Refresh company data
   */
  const refreshCompanyData = useCallback(async () => {
    if (!state.currentCompany) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const company = await companyService.getCompanyById(state.currentCompany.company_id);
      dispatch({ type: 'SET_CURRENT_COMPANY', payload: company });
      
      // Also refresh available companies
      await loadCompanies();
    } catch (error) {
      console.error('❌ useCompany - Error refreshing company data:', error);
      
      showToast({
        type: 'error',
        title: 'Erro',
        message: 'Erro ao atualizar dados da empresa'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.currentCompany, dispatch, loadCompanies, showToast]);
  
  return {
    // State
    currentCompany: state.currentCompany,
    // availableCompanies: state.availableCompanies,
    loading: state.loading,
    error: state.error,
    
    // Actions
    switchCompany,
    loadCompanies,
    refreshCompanyData
  };
};