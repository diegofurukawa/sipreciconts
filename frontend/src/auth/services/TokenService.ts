// src/services/api/TokenService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from '@/services/api/constants';

interface TokenPayload {
  exp: number;
  iat: number;
  user_id: number;
  jti: string;
}

interface TokenPair {
  access: string;
  refresh: string;
}

export class TokenService {
  private static ACCESS_TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';
  
  // Obter tokens
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  // Definir tokens
  static setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }
  
  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }
  
  // Definir ambos os tokens de uma vez
  static setTokens(tokens: TokenPair): void {
    this.setAccessToken(tokens.access);
    this.setRefreshToken(tokens.refresh);
  }
  
  // Limpar tokens
  static clearAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
  
  static clearRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
  
  static clearAll(): void {
    this.clearAccessToken();
    this.clearRefreshToken();
  }
  
  // Decodificar token JWT
  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwtDecode<TokenPayload>(token);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }
  
  // Verificar se o token é válido
  static hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      console.warn('Verificação de token: Token não encontrado');
      return false;
    }
    
    try {
      const decodedToken = this.decodeToken(token);
      if (!decodedToken) {
        console.warn('Verificação de token: Falha ao decodificar');
        return false;
      }
      
      const expiresAt = new Date(decodedToken.exp * 1000);
      const now = new Date();
      
      // Adicionar log para debug
      console.log('Verificação de token:', {
        expires: expiresAt.toISOString(),
        agora: now.toISOString(),
        válido: expiresAt > now,
        tempoRestante: (expiresAt.getTime() - now.getTime()) / 1000 + 's'
      });
      
      return expiresAt > now;
    } catch (error) {
      console.error('Erro ao verificar validade do token:', error);
      return false;
    }
  }
  
  // Obter data de expiração do token
  static getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const decodedToken = this.decodeToken(token);
    if (!decodedToken) return null;
    
    return new Date(decodedToken.exp * 1000);
  }
  
  // Obter um novo token usando o refresh token
  static async getNewToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${API_CONFIG.baseURL}/auth/refresh/`, {
        refresh: refreshToken
      });
      
      const { access, refresh } = response.data;
      
      this.setAccessToken(access);
      if (refresh) {
        this.setRefreshToken(refresh);
      }
      
      return access;
    } catch (error) {
      console.error('Erro ao obter novo token:', error);
      return null;
    }
  }
  
  // Renovar token atual
  static async refreshCurrentToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;
    
    const newToken = await this.getNewToken(refreshToken);
    return !!newToken;
  }
}