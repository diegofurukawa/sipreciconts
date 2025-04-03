// src/pages/SuppliesPriceList/services/SuppliesPriceListService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import { TokenService } from '@/auth/services/TokenService';
import type { PaginatedResponse } from '@/types/api_types';
import type { SuppliesPriceList, SuppliesPriceListParams, SupplyOption, TaxOption } from '@/pages/SuppliesPriceList/types';

// Base URL for API requests
const API_BASE_URL = DEFAULT_API_CONFIG.baseURL || 'http://localhost:8000/api';

// Base URL for supplies price list service
const baseUrl = `${API_BASE_URL}/supplies-prices/`;

// Base URL for supplies (to fetch options)
const suppliesBaseUrl = `${API_BASE_URL}/supplies/`;

// Base URL for taxes (to fetch options)
const taxesBaseUrl = `${API_BASE_URL}/taxes/`;

// API maximum retry attempts
const MAX_RETRY_ATTEMPTS = 2;

// Caching mechanism to prevent duplicate requests
const cache = {
  supplies: null as SupplyOption[] | null,
  taxes: null as TaxOption[] | null,
  suppliesTimestamp: 0,
  taxesTimestamp: 0,
  // Cache lifetime in milliseconds (5 minutes)
  cacheLifetime: 5 * 60 * 1000
};

// Get headers with authentication
const getHeaders = () => {
  const token = TokenService.getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add company_id if available
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.company_id) {
        headers['X-Company-ID'] = userData.company_id;
      }
    } catch (e) {
      console.error('Error retrieving user data:', e);
    }
  }

  return headers;
};

// Validate supply object
const validateSupply = (supply: any): SupplyOption => {
  return {
    id: supply.id || `gen_${Math.random().toString(36).substr(2, 9)}`,
    name: supply.name || 'Insumo sem nome',
    type: supply.type || '',
    type_display: supply.type_display || '',
    unit_measure: supply.unit_measure || '',
    unit_measure_display: supply.unit_measure_display || ''
  };
};

// Validate tax object
const validateTax = (tax: any): TaxOption => {
  return {
    tax_id: tax.tax_id || `gen_${Math.random().toString(36).substr(2, 9)}`,
    acronym: tax.acronym || 'Imposto sem nome',
    type: tax.type || '',
    group: tax.group || '',
    calc_operator: tax.calc_operator || '',
    value: tax.value || 0
  };
};

// Generic API request handler with retry mechanism
const apiRequest = async <T>(
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  data?: any,
  params?: any,
  retryCount = 0
): Promise<T> => {
  try {
    const config = {
      method,
      url,
      headers: getHeaders(),
      params,
      data,
    };

    console.log(`Making ${method.toUpperCase()} request to ${url}`, { params, data: data ? '(data)' : undefined });
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    // Handle authentication errors
    if (error.response?.status === 401 && retryCount < MAX_RETRY_ATTEMPTS) {
      console.log('Authentication error, attempting to refresh token...');
      
      // Try to refresh the token
      const refreshToken = TokenService.getRefreshToken();
      if (refreshToken) {
        try {
          // Refresh token logic
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          });
          
          if (refreshResponse.data?.access) {
            TokenService.setAccessToken(refreshResponse.data.access);
            console.log('Token refreshed successfully, retrying request...');
            
            // Retry with the new token
            return apiRequest(method, url, data, params, retryCount + 1);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens if refresh fails
          TokenService.clearAll();
          // Dispatch session expired event
          window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
        }
      }
    }
    
    // Handle network or server errors
    console.error(`API request failed: ${method.toUpperCase()} ${url}`, error);
    
    // Format error message for UI
    let errorMessage = 'Erro na requisição';
    
    if (error.response) {
      // Server responded with error
      errorMessage = error.response.data?.message || error.response.data?.detail || `Erro ${error.response.status}`;
    } else if (error.request) {
      // No response received
      errorMessage = 'Sem resposta do servidor';
    } else {
      // Error setting up request
      errorMessage = error.message || 'Erro desconhecido';
    }
    
    // Re-throw with better message
    throw new Error(errorMessage);
  }
};

// Supplies price list service with improved error handling and data validation
export const suppliesPriceListService = {
  /**
   * List all supplies price list items
   */
  async list(params?: SuppliesPriceListParams): Promise<PaginatedResponse<SuppliesPriceList>> {
    return apiRequest<PaginatedResponse<SuppliesPriceList>>('get', baseUrl, undefined, params);
  },

  /**
   * Get a specific supplies price list item by ID
   */
  async getById(id: number): Promise<SuppliesPriceList> {
    return apiRequest<SuppliesPriceList>('get', `${baseUrl}/${id}`);
  },

  /**
   * Create a new supplies price list item
   */
  async create(data: Omit<SuppliesPriceList, 'suppliespricelist_id' | 'created' | 'updated'>): Promise<SuppliesPriceList> {
    return apiRequest<SuppliesPriceList>('post', baseUrl, data);
  },

  /**
   * Update an existing supplies price list item
   */
  async update(id: number, data: Partial<SuppliesPriceList>): Promise<SuppliesPriceList> {
    return apiRequest<SuppliesPriceList>('put', `${baseUrl}/${id}`, data);
  },

  /**
   * Delete a supplies price list item
   */
  async delete(id: number): Promise<void> {
    return apiRequest<void>('delete', `${baseUrl}/${id}`);
  },

  /**
   * Get available supplies for selection with error handling, data validation and caching
   */
  async getSupplies(forceRefresh = false): Promise<SupplyOption[]> {
    // Return cached data if it exists and is not expired
    const now = Date.now();
    if (!forceRefresh && 
        cache.supplies && 
        cache.suppliesTimestamp > 0 && 
        (now - cache.suppliesTimestamp) < cache.cacheLifetime) {
      console.log('Using cached supplies data');
      return cache.supplies;
    }

    try {
      const response = await apiRequest<PaginatedResponse<any>>('get', suppliesBaseUrl, undefined, { 
        limit: 100, 
        is_active: true 
      });
      
      // Map and validate each supply
      const supplies = (response.results || [])
        .map(validateSupply)
        // Ensure each supply has a unique ID to prevent React key errors
        .filter((supply, index, self) => 
          index === self.findIndex((s) => s.id === supply.id)
        );
      
      // Update cache
      cache.supplies = supplies;
      cache.suppliesTimestamp = now;
      
      return supplies;
    } catch (error) {
      console.error('Error fetching supplies:', error);
      // Return cached data if available (even if expired)
      if (cache.supplies) {
        return cache.supplies;
      }
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  /**
   * Get available taxes for selection with error handling, data validation and caching
   */
  async getTaxes(forceRefresh = false): Promise<TaxOption[]> {
    // Return cached data if it exists and is not expired
    const now = Date.now();
    if (!forceRefresh && 
        cache.taxes && 
        cache.taxesTimestamp > 0 && 
        (now - cache.taxesTimestamp) < cache.cacheLifetime) {
      console.log('Using cached taxes data');
      return cache.taxes;
    }

    try {
      const response = await apiRequest<PaginatedResponse<any>>('get', taxesBaseUrl, undefined, { 
        limit: 100, 
        is_active: true 
      });
      
      // Map and validate each tax
      const taxes = (response.results || [])
        .map(validateTax)
        // Ensure each tax has a unique ID to prevent React key errors
        .filter((tax, index, self) => 
          index === self.findIndex((t) => t.tax_id === tax.tax_id)
        );
      
      // Update cache
      cache.taxes = taxes;
      cache.taxesTimestamp = now;
      
      return taxes;
    } catch (error) {
      console.error('Error fetching taxes:', error);
      // Return cached data if available (even if expired)
      if (cache.taxes) {
        return cache.taxes;
      }
      // Return empty array instead of throwing to avoid breaking the UI
      return [];
    }
  },

  /**
   * Clear cache for testing or when needed
   */
  clearCache(): void {
    cache.supplies = null;
    cache.taxes = null;
    cache.suppliesTimestamp = 0;
    cache.taxesTimestamp = 0;
  }
};

export default suppliesPriceListService;