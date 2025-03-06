// src/auth/services/companyService.ts
import axios, { 
  AxiosInstance, 
  AxiosResponse, 
  AxiosError, 
  InternalAxiosRequestConfig 
} from 'axios';
import { 
  Company, 
  CompanyListParams, 
  PaginatedCompanyResponse 
} from '../types/company_types';
import { TokenService } from './TokenService';
import { UserSessionService } from './UserSessionService';
import { API_CONFIG } from '../../config/api_config';

/**
 * Service for company management operations
 */
class CompanyService {
  private api: AxiosInstance;
  private readonly baseUrl = '/companies';
  private readonly COMPANY_STORAGE_KEY = 'current_company';
  private readonly COMPANIES_STORAGE_KEY = 'available_companies';

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout
    });
    
    this.setupInterceptors();
  }

  /**
   * Sets up request and response interceptors
   */
  private setupInterceptors(): void {
    console.log('🔄 CompanyService - Setting up interceptors');
    
    // Request interceptor to add auth and company headers
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = TokenService.getAccessToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        const session = UserSessionService.load();
        if (session?.sessionId) {
          config.headers = config.headers || {};
          config.headers['X-Session-ID'] = session.sessionId;
        }
        
        return config;
      },
      (error: any) => {
        console.error('❌ CompanyService - Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        console.error('❌ CompanyService - API error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get list of companies for the current user
   */
  async getCompanies(params?: CompanyListParams): Promise<PaginatedCompanyResponse> {
    console.log('🔍 CompanyService - Fetching companies with params:', params);
    
    try {
      const response = await this.api.get<PaginatedCompanyResponse>(this.baseUrl, {
        params
      });
      
      console.log(`✅ CompanyService - Fetched ${response.data.results.length} companies`);
      
      // Cache available companies
      this.setAvailableCompanies(response.data.results);
      
      return response.data;
    } catch (error) {
      console.error('❌ CompanyService - Error fetching companies:', error);
      throw error;
    }
  }

  /**
   * Get a specific company by ID
   */
  async getCompanyById(companyId: string): Promise<Company> {
    console.log(`🔍 CompanyService - Fetching company with ID: ${companyId}`);
    
    try {
      const response = await this.api.get<Company>(`${this.baseUrl}/${companyId}`);
      console.log('✅ CompanyService - Fetched company details');
      return response.data;
    } catch (error) {
      console.error(`❌ CompanyService - Error fetching company ${companyId}:`, error);
      throw error;
    }
  }

  /**
   * Switch to a different company
   * This updates both local storage and the API
   */
  async switchCompany(companyId: string): Promise<Company> {
    console.log(`🔄 CompanyService - Switching to company: ${companyId}`);
    
    try {
      // First try to get the company details
      const company = await this.getCompanyById(companyId);
      
      // Update local storage
      this.setCurrentCompany(company);
      
      // Update session storage
      const session = UserSessionService.load();
      if (session) {
        session.switchCompany(company.company_id);
        UserSessionService.save(session);
      }
      
      // Optional: Call API to notify about company switch
      // This depends on your backend implementation
      try {
        await this.api.post('/auth/switch-company/', { company_id: companyId });
        console.log('✅ CompanyService - Notified API about company switch');
      } catch (switchError) {
        // Non-critical error, just log it
        console.warn('⚠️ CompanyService - Failed to notify API about company switch:', switchError);
      }
      
      console.log('✅ CompanyService - Successfully switched company');
      return company;
    } catch (error) {
      console.error(`❌ CompanyService - Error switching to company ${companyId}:`, error);
      throw error;
    }
  }

  /**
   * Get the current company from local storage
   */
  getCurrentCompany(): Company | null {
    const companyJson = localStorage.getItem(this.COMPANY_STORAGE_KEY);
    if (!companyJson) return null;
    
    try {
      return JSON.parse(companyJson) as Company;
    } catch (error) {
      console.error('❌ CompanyService - Error parsing current company from storage:', error);
      return null;
    }
  }

  /**
   * Set the current company in local storage
   */
  setCurrentCompany(company: Company): void {
    localStorage.setItem(this.COMPANY_STORAGE_KEY, JSON.stringify(company));
  }

  /**
   * Clear the current company from local storage
   */
  clearCurrentCompany(): void {
    localStorage.removeItem(this.COMPANY_STORAGE_KEY);
  }

  /**
   * Get available companies from local storage
   */
  getAvailableCompanies(): Company[] {
    const companiesJson = localStorage.getItem(this.COMPANIES_STORAGE_KEY);
    if (!companiesJson) return [];
    
    try {
      return JSON.parse(companiesJson) as Company[];
    } catch (error) {
      console.error('❌ CompanyService - Error parsing available companies from storage:', error);
      return [];
    }
  }

  /**
   * Set available companies in local storage
   */
  setAvailableCompanies(companies: Company[]): void {
    localStorage.setItem(this.COMPANIES_STORAGE_KEY, JSON.stringify(companies));
  }

  /**
   * Clear available companies from local storage
   */
  clearAvailableCompanies(): void {
    localStorage.removeItem(this.COMPANIES_STORAGE_KEY);
  }

  /**
   * Initialize company state from storage or API
   * This is called during app startup
   */
  async initializeCompanyState(): Promise<Company | null> {
    console.log('🔍 CompanyService - Initializing company state');
    
    // First try to get from local storage
    const currentCompany = this.getCurrentCompany();
    if (currentCompany) {
      console.log('✅ CompanyService - Found current company in storage:', currentCompany.name);
      return currentCompany;
    }
    
    // If not in storage, try to get from API
    try {
      const companiesResponse = await this.getCompanies({ 
        limit: 1, 
        enabled: true 
      });
      
      if (companiesResponse.results.length > 0) {
        const firstCompany = companiesResponse.results[0];
        this.setCurrentCompany(firstCompany);
        console.log('✅ CompanyService - Set first available company as current:', firstCompany.name);
        return firstCompany;
      }
      
      console.warn('⚠️ CompanyService - No companies available for the current user');
      return null;
    } catch (error) {
      console.error('❌ CompanyService - Error initializing company state:', error);
      return null;
    }
  }

  /**
   * Clear all company data
   * Used during logout
   */
  clearCompanyData(): void {
    console.log('🧹 CompanyService - Clearing all company data');
    this.clearCurrentCompany();
    this.clearAvailableCompanies();
  }
}

// Create and export singleton instance
export const companyService = new CompanyService();