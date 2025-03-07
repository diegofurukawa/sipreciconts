// src/utils/logger.ts

/**
 * Níveis de log disponíveis
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Interface para eventos de log
 */
export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: Record<string, any>;
  userId?: string | number;
}

/**
 * Configuração do logger
 */
interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  enableConsole: boolean;
  enableLocalStorage: boolean;
  maxStoredLogs: number;
  localStorage: {
    key: string;
  };
}

/**
 * Configuração padrão do logger
 */
const DEFAULT_CONFIG: LoggerConfig = {
  enabled: true,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: true,
  enableLocalStorage: process.env.NODE_ENV === 'development',
  maxStoredLogs: 100,
  localStorage: {
    key: 'app_logs'
  }
};

/**
 * Classe de utilitário para logging na aplicação
 */
class Logger {
  private config: LoggerConfig;
  
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Log de nível debug
   */
  debug(category: string, message: string, data?: Record<string, any>): void {
    this.log('debug', category, message, data);
  }
  
  /**
   * Log de nível info
   */
  info(category: string, message?: string, data?: Record<string, any>): void {
    this.log('info', category, message || category, data);
  }
  
  /**
   * Log de nível warn
   */
  warn(category: string, message: string, data?: Record<string, any>): void {
    this.log('warn', category, message, data);
  }
  
  /**
   * Log de nível error
   */
  error(category: string, message: string, data?: Record<string, any>, error?: Error): void {
    // Adiciona stack trace se um erro for fornecido
    const logData = error ? { 
      ...data, 
      errorMessage: error.message,
      stack: error.stack
    } : data;
    
    this.log('error', category, message, logData);
  }
  
  /**
   * Registra navegação entre páginas
   */
  pageView(page: string, data?: Record<string, any>): void {
    this.info('Navigation', `Page viewed: ${page}`, {
      page,
      ...data
    });
  }
  
  /**
   * Registra ações do usuário
   */
  userAction(action: string, data?: Record<string, any>): void {
    this.info('UserAction', `User action: ${action}`, {
      action,
      ...data
    });
  }
  
  /**
   * Função de log principal
   */
  private log(level: LogLevel, category: string, message: string, data?: Record<string, any>): void {
    if (!this.config.enabled) return;
    
    // Verificar nível mínimo de log
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const configLevelIndex = levels.indexOf(this.config.level);
    const currentLevelIndex = levels.indexOf(level);
    
    if (currentLevelIndex < configLevelIndex) return;
    
    // Criar evento de log
    const logEvent: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      userId: this.getUserId()
    };
    
    // Registrar no console se habilitado
    if (this.config.enableConsole) {
      this.logToConsole(logEvent);
    }
    
    // Registrar no localStorage se habilitado
    if (this.config.enableLocalStorage) {
      this.logToLocalStorage(logEvent);
    }
    
    // Aqui poderia ser adicionada integração com serviços de monitoramento
    // como Sentry, LogRocket, etc.
  }
  
  /**
   * Registra no console
   */
  private logToConsole(logEvent: LogEvent): void {
    const { level, category, message, data } = logEvent;
    
    const formattedMessage = `[${category}] ${message}`;
    
    switch (level) {
      case 'debug':
        console.debug(formattedMessage, data || '');
        break;
      case 'info':
        console.info(formattedMessage, data || '');
        break;
      case 'warn':
        console.warn(formattedMessage, data || '');
        break;
      case 'error':
        console.error(formattedMessage, data || '');
        break;
    }
  }
  
  /**
   * Registra no localStorage
   */
  private logToLocalStorage(logEvent: LogEvent): void {
    try {
      const key = this.config.localStorage.key;
      const storedLogs = localStorage.getItem(key);
      let logs: LogEvent[] = [];
      
      if (storedLogs) {
        logs = JSON.parse(storedLogs);
      }
      
      logs.push(logEvent);
      
      // Limitar número de logs armazenados
      if (logs.length > this.config.maxStoredLogs) {
        logs = logs.slice(-this.config.maxStoredLogs);
      }
      
      localStorage.setItem(key, JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save log to localStorage:', error);
    }
  }
  
  /**
   * Obtém ID do usuário atual (se disponível)
   */
  private getUserId(): string | number | undefined {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id;
      }
    } catch (error) {
      // Silencia erros
    }
    return undefined;
  }
  
  /**
   * Exporta logs armazenados
   */
  exportLogs(): LogEvent[] {
    try {
      const key = this.config.localStorage.key;
      const storedLogs = localStorage.getItem(key);
      
      if (storedLogs) {
        return JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
    
    return [];
  }
  
  /**
   * Limpa logs armazenados
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(this.config.localStorage.key);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }
}

// Exporta instância única para uso em toda a aplicação
export const logger = new Logger();

// Exporta classe para testes e configuração personalizada
export default Logger;