// src/utils/logger.ts

/**
 * Níveis de log disponíveis
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 100 // Desativa todos os logs
  }
  
  /**
   * Configuração do logger
   */
  interface LoggerConfig {
    minLevel: LogLevel;
    enabledModules: string[] | 'all';
    disabled: boolean;
  }
  
  // Configuração padrão - pode ser alterada em runtime
  const config: LoggerConfig = {
    minLevel: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.WARN,
    enabledModules: 'all',
    disabled: false
  };
  
  /**
   * Cores para diferentes níveis de log no console
   */
  const LOG_STYLES = {
    [LogLevel.DEBUG]: 'color: #6b6b6b', // Cinza
    [LogLevel.INFO]: 'color: #0077ff',  // Azul
    [LogLevel.WARN]: 'color: #ff9900',  // Laranja
    [LogLevel.ERROR]: 'color: #ff0000', // Vermelho
  };
  
  /**
   * Prefixos para diferentes níveis de log
   */
  const LOG_PREFIXES = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
  };
  
  /**
   * Função que cria um timestamp formatado
   */
  const getTimestamp = (): string => {
    const now = new Date();
    return `${now.toISOString().split('T')[1].slice(0, -1)}`;
  };
  
  /**
   * Verifica se um módulo está habilitado para logging
   */
  const isModuleEnabled = (module: string): boolean => {
    if (config.disabled) return false;
    if (config.enabledModules === 'all') return true;
    return config.enabledModules.includes(module);
  };
  
  /**
   * Função interna de log
   */
  const logInternal = (
    level: LogLevel,
    module: string,
    message: string,
    data?: any
  ): void => {
    // Verifica se o nível de log está habilitado
    if (level < config.minLevel || !isModuleEnabled(module)) {
      return;
    }
  
    const timestamp = getTimestamp();
    const prefix = LOG_PREFIXES[level];
    const style = LOG_STYLES[level];
    
    // Formata a mensagem de log
    const formattedModule = module ? `[${module}]` : '';
    const logPrefix = `%c${timestamp} ${prefix}${formattedModule}:`;
  
    // Exibe o log no console com formatação
    if (data !== undefined) {
      if (typeof data === 'object' && data !== null) {
        console.groupCollapsed(logPrefix, style, message);
        console.dir(data);
        console.groupEnd();
      } else {
        console.log(logPrefix, style, message, data);
      }
    } else {
      console.log(logPrefix, style, message);
    }
  };
  
  /**
   * API pública do logger
   */
  export const logger = {
    debug: (module: string, message: string, data?: any) => 
      logInternal(LogLevel.DEBUG, module, message, data),
    
    info: (module: string, message: string, data?: any) => 
      logInternal(LogLevel.INFO, module, message, data),
    
    warn: (module: string, message: string, data?: any) => 
      logInternal(LogLevel.WARN, module, message, data),
    
    error: (module: string, message: string, data?: any) => 
      logInternal(LogLevel.ERROR, module, message, data),
    
    // Métodos de configuração
    setLevel: (level: LogLevel) => {
      config.minLevel = level;
    },
    
    enableModule: (module: string) => {
      if (config.enabledModules === 'all') {
        config.enabledModules = [];
      }
      if (!config.enabledModules.includes(module)) {
        config.enabledModules.push(module);
      }
    },
    
    disableModule: (module: string) => {
      if (config.enabledModules === 'all') {
        config.enabledModules = ['*'];
      }
      config.enabledModules = config.enabledModules.filter(m => m !== module);
    },
    
    enableAll: () => {
      config.enabledModules = 'all';
    },
    
    disable: () => {
      config.disabled = true;
    },
    
    enable: () => {
      config.disabled = false;
    }
  };
  
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