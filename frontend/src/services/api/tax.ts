// src/services/api/tax.ts
import { BaseApiService } from './base';
import { Tax } from '../../types/tax';
import { APIError } from './types';
import axios, { AxiosError } from 'axios';

export class TaxService extends BaseApiService {
    async list(page: number = 1, filters?: Record<string, any>): Promise<{ results: Tax[]; count: number }> {
        this.checkAuth();
        try {
            const response = await this.api.get<{ results: Tax[]; count: number }>('taxes/', {
                params: {
                    page,
                    page_size: 10,
                    ...filters,
                    company: this.getCompanyId()
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw this.handleError(error as AxiosError);
        }
    }

    async create(data: Partial<Tax>): Promise<Tax> {
        this.checkAuth();
        try {
            const response = await this.api.post<Tax>('taxes/', {
                ...data,
                company: this.getCompanyId()
            });
            return response.data;
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw this.handleError(error as AxiosError);
        }
    }

    async update(id: number, data: Partial<Tax>): Promise<Tax> {
        this.checkAuth();
        try {
            const response = await this.api.put<Tax>(`taxes/${id}/`, {
                ...data,
                company: this.getCompanyId()
            });
            return response.data;
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw this.handleError(error as AxiosError);
        }
    }

    async delete(id: number): Promise<void> {
        this.checkAuth();
        try {
            await this.api.delete(`taxes/${id}/`, {
                params: { company: this.getCompanyId() }
            });
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw this.handleError(error as AxiosError);
        }
    }
}

// Exportar o tipo Tax
export type { Tax };