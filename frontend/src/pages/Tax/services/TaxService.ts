// src/pages/Tax/services/TaxService.ts
import { Tax } from '@pages/Tax/types';

// Dados mockados para uso offline
const MOCK_TAXES: Tax[] = [
  { 
    id: 1, 
    acronym: 'ICMS', 
    description: 'Imposto sobre Circulação de Mercadorias e Serviços', 
    type: 'tax', 
    group: 'state', 
    calc_operator: '%', 
    value: 18 
  },
  { 
    id: 2, 
    acronym: 'ISS', 
    description: 'Imposto Sobre Serviços', 
    type: 'tax', 
    group: 'municipal', 
    calc_operator: '%', 
    value: 5 
  },
  { 
    id: 3, 
    acronym: 'IPI', 
    description: 'Imposto sobre Produtos Industrializados', 
    type: 'tax', 
    group: 'federal', 
    calc_operator: '%', 
    value: 10 
  }
];

// Interface para respostas paginadas
interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Classe de serviço simulando chamadas à API
class TaxService {
  // Lista todos os impostos
  async list(page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Tax>> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      results: MOCK_TAXES,
      count: MOCK_TAXES.length,
      next: null,
      previous: null
    };
  }

  // Busca um imposto pelo ID
  async getById(id: number): Promise<Tax> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const tax = MOCK_TAXES.find(tax => tax.id === id);
    
    if (!tax) {
      throw new Error(`Imposto com ID ${id} não encontrado`);
    }
    
    return tax;
  }

  // Cria um novo imposto
  async create(data: Omit<Tax, 'id'>): Promise<Tax> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newId = Math.max(0, ...MOCK_TAXES.map(tax => tax.id || 0)) + 1;
    const newTax = { ...data, id: newId };
    
    MOCK_TAXES.push(newTax);
    
    return newTax;
  }

  // Atualiza um imposto existente
  async update(id: number, data: Partial<Tax>): Promise<Tax> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = MOCK_TAXES.findIndex(tax => tax.id === id);
    
    if (index === -1) {
      throw new Error(`Imposto com ID ${id} não encontrado`);
    }
    
    const updatedTax = { ...MOCK_TAXES[index], ...data };
    MOCK_TAXES[index] = updatedTax;
    
    return updatedTax;
  }

  // Exclui um imposto
  async delete(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = MOCK_TAXES.findIndex(tax => tax.id === id);
    
    if (index === -1) {
      throw new Error(`Imposto com ID ${id} não encontrado`);
    }
    
    MOCK_TAXES.splice(index, 1);
  }
}

// Instância única do serviço
export const taxService = new TaxService();

export default taxService;