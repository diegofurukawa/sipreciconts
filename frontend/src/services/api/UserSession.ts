// src/services/api/UserSession.ts
import { TokenService } from './token';

// Types
interface BaseUserData {
    id: number;
    name: string;
    email: string;
    username: string;
    company_id: number;
    company_name?: string;
    role?: string;
    last_login?: string;
}

// Renomeado para evitar conflito
export interface SessionUserData extends BaseUserData {
    enabled: boolean;
    created?: string;
    updated?: string;
}

export interface UserSessionData {
    session_id: string;
    company_id: number;
    user_id: number;
    date_start: Date;
    date_end?: Date;
    token: string;
    refresh_token: string;
    expired_token?: Date;
    user?: SessionUserData;
}

export interface UpdateSessionData {
    token?: string;
    refresh_token?: string;
    company_id?: number;
    date_end?: Date;
    expired_token?: Date;
    user?: Partial<SessionUserData>;
}

export interface CreateAuthData {
    session_id: string; // Novo campo
    user_id: number;
    company_id: number;
    token: string;
    refresh_token: string;
    expires_in?: number;
    user?: SessionUserData;
}

const SESSION_STORAGE_KEY = '@SiPreciConts:session';

export class UserSession {
    private data: UserSessionData;

    constructor(initialData: Partial<UserSessionData>) {
        const session_id = crypto.randomUUID();
        const date_start = new Date();

        this.data = {
            session_id,
            date_start,
            company_id: 0,
            user_id: 0,
            token: '',
            refresh_token: '',
            ...initialData,
        };

        this.save();
    }

    // Getters
    get sessionId(): string {
        return this.data.session_id;
    }

    get companyId(): number {
        return this.data.company_id;
    }

    get userId(): number {
        return this.data.user_id;
    }

    get user(): SessionUserData | undefined {
        return this.data.user;
    }

    get token(): string {
        return this.data.token;
    }

    get refreshToken(): string {
        return this.data.refresh_token;
    }

    get isActive(): boolean {
        if (!this.data.date_end) return true;
        return new Date() < this.data.date_end;
    }

    get isTokenExpired(): boolean {
        if (!this.data.expired_token) return false;
        return new Date() >= this.data.expired_token;
    }

    // Methods
    update(newData: UpdateSessionData): void {
        this.data = {
            ...this.data,
            ...newData,
            // Corrigido o tipo de user
            user: newData.user && this.data.user 
                ? { ...this.data.user, ...newData.user }
                : this.data.user
        };
        this.save();
    }

    end(): void {
        this.data.date_end = new Date();
        this.save();
    }

    updateTokens(token: string, refresh_token: string, expiration?: Date): void {
        this.data.token = token;
        this.data.refresh_token = refresh_token;
        this.data.expired_token = expiration;

        TokenService.setTokens({ 
            access: token, 
            refresh: refresh_token 
        });

        this.save();
    }

    switchCompany(companyId: number): void {
        this.data.company_id = companyId;
        this.save();
    }

    private save(): void {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.data));
    }

    async validate(): Promise<boolean> {
        if (!this.isActive) return false;

        if (this.isTokenExpired) {
            try {
                // Corrigido para usar o método correto do TokenService
                const token = await TokenService.getNewToken(this.refreshToken);
                if (token) {
                    this.updateTokens(token, this.refreshToken);
                    return true;
                }
                return false;
            } catch {
                return false;
            }
        }

        return true;
    }

    // Static Methods
    static load(): UserSession | null {
        try {
            const stored = localStorage.getItem(SESSION_STORAGE_KEY);
            if (!stored) return null;

            const data = JSON.parse(stored);

            // Convert date strings to Date objects
            if (data.date_start) data.date_start = new Date(data.date_start);
            if (data.date_end) data.date_end = new Date(data.date_end);
            if (data.expired_token) data.expired_token = new Date(data.expired_token);

            return new UserSession(data);
        } catch (error) {
            console.error('Erro ao carregar sessão:', error);
            return null;
        }
    }

    static clear(): void {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        TokenService.clearAll();
    }

    static hasActiveSession(): boolean {
        const session = UserSession.load();
        return !!session?.isActive;
    }

    static createFromAuth(authData: CreateAuthData): UserSession {
        const expiredToken = authData.expires_in
            ? new Date(Date.now() + authData.expires_in * 1000)
            : undefined;

        return new UserSession({
            user_id: authData.user_id,
            company_id: authData.company_id,
            token: authData.token,
            refresh_token: authData.refresh_token,
            expired_token: expiredToken,
            user: authData.user
        });
    }
}

// Default export
export default UserSession;