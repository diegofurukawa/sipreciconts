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
  
  // Exportar como default para convenência
  export default logger;