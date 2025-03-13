// src/pages/SuppliesPriceList/services/SuppliesPriceListService.ts
import axios from 'axios';
import { DEFAULT_API_CONFIG } from '@/services/apiMainService/config';
import type { PaginatedResponse } from '@/types/api_types';
import type { SuppliesPriceList, SuppliesPriceListParams, SupplyOption, TaxOption } from '@/pages/SuppliesPriceList/types';

// Base URL for supplies price list service
const baseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}supplies-prices`
  : `${DEFAULT_API_CONFIG.baseURL}/supplies-prices`;

// Base URL for supplies (to fetch options)
const suppliesBaseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}supplies`
  : `${DEFAULT_API_CONFIG.baseURL}/supplies`;

// Base URL for taxes (to fetch options)
const taxesBaseUrl = DEFAULT_API_CONFIG.baseURL.endsWith('/')
  ? `${DEFAULT_API_CONFIG.baseURL}taxes`
  : `${DEFAULT_API_CONFIG.baseURL}/taxes`;

// Get headers with authentication
const getHeaders = () => {
  const token = localStorage.getItem('access_token');

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

// Supplies price list service object literal
export const suppliesPriceListService = {
  /**
   * List all supplies price list items
   */
  async list(params?: SuppliesPriceListParams): Promise<PaginatedResponse<SuppliesPriceList>> {
    console.log('Loading supplies price list with parameters:', params);
    try {
      const response = await axios.get(`${baseUrl}/`, {
        headers: getHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error listing supplies price list:', error);
      throw error;
    }
  },

  /**
   * Get a specific supplies price list item by ID
   */
  async getById(id: number): Promise<SuppliesPriceList> {
    try {
      const response = await axios.get(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplies price list item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new supplies price list item
   */
  async create(data: Omit<SuppliesPriceList, 'suppliespricelist_id' | 'created' | 'updated'>): Promise<SuppliesPriceList> {
    try {
      const response = await axios.post(`${baseUrl}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating supplies price list item:', error);
      throw error;
    }
  },

  /**
   * Update an existing supplies price list item
   */
  async update(id: number, data: Partial<SuppliesPriceList>): Promise<SuppliesPriceList> {
    try {
      const response = await axios.put(`${baseUrl}/${id}/`, data, {
        headers: getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating supplies price list item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a supplies price list item
   */
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${baseUrl}/${id}/`, {
        headers: getHeaders(),
      });
    } catch (error) {
      console.error(`Error deleting supplies price list item ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get available supplies for selection
   */
  async getSupplies(): Promise<SupplyOption[]> {
    try {
      const response = await axios.get(`${suppliesBaseUrl}/`, {
        headers: getHeaders(),
        params: { limit: 100, is_active: true }
      });
      
      return response.data.results.map((supply: any) => ({
        id: supply.id,
        name: supply.name,
        type: supply.type,
        type_display: supply.type_display,
        unit_measure: supply.unit_measure,
        unit_measure_display: supply.unit_measure_display
      }));
    } catch (error) {
      console.error('Error fetching supplies:', error);
      throw error;
    }
  },

  /**
   * Get available taxes for selection
   */
  async getTaxes(): Promise<TaxOption[]> {
    try {
      const response = await axios.get(`${taxesBaseUrl}/`, {
        headers: getHeaders(),
        params: { limit: 100, is_active: true }
      });
      
      return response.data.results.map((tax: any) => ({
        tax_id: tax.tax_id,
        acronym: tax.acronym,
        type: tax.type,
        group: tax.group,
        calc_operator: tax.calc_operator,
        value: tax.value
      }));
    } catch (error) {
      console.error('Error fetching taxes:', error);
      throw error;
    }
  }
};

export default suppliesPriceListService;