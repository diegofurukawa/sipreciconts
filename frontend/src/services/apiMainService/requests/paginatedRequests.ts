// src/services/apiMainService/requests/paginatedRequests.ts
import { AxiosInstance } from 'axios';
import { baseRequests } from './baseRequests';
import { errorHandler } from '../utils';
import type { PaginatedResponse, RequestOptions } from '../config/apiConfig';

/**
 * Métodos para trabalhar com requisições paginadas
 */

/**
 * Realiza uma requisição GET com paginação
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param params Parâmetros da query string
 * @param options Opções adicionais
 * @returns Resposta paginada
 */
async function getPaginated<T = any>(
  api: AxiosInstance,
  url: string,
  params?: Record<string, any>,
  options?: RequestOptions
): Promise<PaginatedResponse<T>> {
  try {
    const response = await baseRequests.get<PaginatedResponse<T>>(
      api,
      url,
      params,
      options
    );
    
    return {
      ...response,
      // Garante a existência das propriedades padrão
      results: response.results || [],
      count: response.count || 0,
      next: response.next || null,
      previous: response.previous || null
    };
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Busca todas as páginas de uma requisição paginada e concatena os resultados
 * @param api Instância do Axios
 * @param url URL da requisição
 * @param params Parâmetros da query string
 * @param options Opções adicionais
 * @returns Array com todos os itens de todas as páginas
 */
async function getAllPages<T = any>(
  api: AxiosInstance,
  url: string,
  params?: Record<string, any>,
  options?: RequestOptions & { 
    maxPages?: number;
    onPageLoaded?: (page: number, totalPages: number, items: T[]) => void;
  }
): Promise<T[]> {
  const maxPages = options?.maxPages || 100; // Limite de segurança
  let currentPage = 1;
  let hasNextPage = true;
  let allResults: T[] = [];
  
  // Cria uma cópia dos params para não modificar o original
  const queryParams = { ...(params || {}), page: currentPage };
  
  try {
    while (hasNextPage && currentPage <= maxPages) {
      // Atualiza o número da página
      queryParams.page = currentPage;
      
      // Faz a requisição para a página atual
      const response = await getPaginated<T>(api, url, queryParams, options);
      
      // Adiciona os resultados ao array final
      if (response.results && response.results.length > 0) {
        allResults = [...allResults, ...response.results];
      }
      
      // Calcula total de páginas (caso não venha na resposta)
      const totalPages = response.total_pages || 
                        (response.count ? Math.ceil(response.count / (response.results?.length || 10)) : currentPage);
      
      // Callback opcional para cada página carregada
      if (options?.onPageLoaded) {
        options.onPageLoaded(currentPage, totalPages, response.results || []);
      }
      
      // Verifica se há próxima página
      hasNextPage = !!response.next && currentPage < totalPages;
      
      // Incrementa para a próxima página
      currentPage++;
    }
    
    return allResults;
  } catch (error) {
    throw errorHandler.handleApiError(error);
  }
}

/**
 * Realiza uma requisição GET para um recurso específico com paginação
 * @param api Instância do Axios
 * @param url URL base da requisição
 * @param id ID do recurso
 * @param subresource Nome do subrecurso (opcional)
 * @param params Parâmetros da query string
 * @param options Opções adicionais
 * @returns Resposta paginada
 */
async function getPaginatedResource<T = any>(
  api: AxiosInstance,
  url: string,
  id: number | string,
  subresource?: string,
  params?: Record<string, any>,
  options?: RequestOptions
): Promise<PaginatedResponse<T>> {
  // Constrói a URL completa
  const fullUrl = `${url}/${id}${subresource ? `/${subresource}` : ''}`;
  
  // Usa o método getPaginated
  return getPaginated<T>(api, fullUrl, params, options);
}

export const paginatedRequests = {
  getPaginated,
  getAllPages,
  getPaginatedResource
};

export default paginatedRequests;