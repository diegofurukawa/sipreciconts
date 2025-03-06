// src/services/api/UserSessionService.ts
import { TokenService } from '@/auth/services/TokenService';
import type { AuthUser } from '@/auth/types/auth_types';

export class UserSession {
  userId: number;
  sessionId: string;
  accessToken: string;
  refreshToken: string;
  companyId: string | null;
  user: AuthUser | null;
  isActive: boolean;
  expiresIn: number;
  
  constructor(
    userId: number,
    sessionId: string,
    accessToken: string,
    refreshToken: string,
    companyId: string | null = null,
    user: AuthUser | null = null,
    expiresIn: number = 3600
  ) {
    this.userId = userId;
    this.sessionId = sessionId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.companyId = companyId;
    this.user = user;
    this.isActive = true;
    this.expiresIn = expiresIn;
  }
  
  updateTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Atualizar também no localStorage
    TokenService.setAccessToken(accessToken);
    TokenService.setRefreshToken(refreshToken);
  }
  
  updateUser(userData: Partial<AuthUser>): void {
    if (this.user) {
      this.user = { ...this.user, ...userData };
      
      // Se o usuário tiver um company_id atualizado, atualizar também o companyId da sessão
      if (userData.company_id) {
        this.companyId = userData.company_id;
      }
    }
  }
  
  switchCompany(companyId: string): void {
    this.companyId = companyId;
    
    // Se o usuário existir, atualizar também o company_id do usuário
    if (this.user) {
      this.user.company_id = companyId;
    }
  }
}

export class UserSessionService {
  private static SESSION_KEY = 'user_session';
  
  static save(session: UserSession): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
  }
  
  static load(): UserSession | null {
    const sessionData = localStorage.getItem(this.SESSION_KEY);
    if (!sessionData) return null;
    
    try {
      const data = JSON.parse(sessionData);
      return new UserSession(
        data.userId,
        data.sessionId,
        data.accessToken,
        data.refreshToken,
        data.companyId,
        data.user,
        data.expiresIn
      );
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      return null;
    }
  }
  
  static clear(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }
  
  static createFromAuth(authData: {
    session_id: string;
    user_id: number;
    company_id: string;
    token: string;
    refresh_token: string;
    expires_in: number;
    user: AuthUser;
  }): UserSession {
    const session = new UserSession(
      authData.user_id,
      authData.session_id,
      authData.token,
      authData.refresh_token,
      authData.company_id,
      authData.user,
      authData.expires_in
    );
    
    this.save(session);
    return session;
  }
}