// src/utils/date.ts
import { format, formatDistance, formatRelative, Locale } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DateFormatOptions {
  locale?: Locale;
  includeTime?: boolean;
}

export const dateUtils = {
  /**
   * Formata uma data para o formato brasileiro padrão
   */
  format: (date: Date | number | string, options: DateFormatOptions = {}) => {
    const { locale = ptBR, includeTime = false } = options;
    const parsedDate = new Date(date);

    if (includeTime) {
      return format(parsedDate, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale });
    }
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale });
  },

  /**
   * Formata uma data para o formato curto (dd/MM/yyyy)
   */
  formatShort: (date: Date | number | string) => {
    const parsedDate = new Date(date);
    return format(parsedDate, 'dd/MM/yyyy', { locale: ptBR });
  },

  /**
   * Formata uma data com hora para o formato curto (dd/MM/yyyy HH:mm)
   */
  formatShortWithTime: (date: Date | number | string) => {
    const parsedDate = new Date(date);
    return format(parsedDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  },

  /**
   * Retorna uma data relativa (ex: há 2 dias, há 1 mês)
   */
  formatRelative: (date: Date | number | string) => {
    const parsedDate = new Date(date);
    return formatRelative(parsedDate, new Date(), { locale: ptBR });
  },

  /**
   * Retorna a distância entre duas datas em palavras
   */
  formatDistance: (date: Date | number | string, baseDate: Date = new Date()) => {
    const parsedDate = new Date(date);
    return formatDistance(parsedDate, baseDate, { locale: ptBR, addSuffix: true });
  },

  /**
   * Formata uma data para um formato personalizado
   */
  formatCustom: (date: Date | number | string, formatString: string, options: DateFormatOptions = {}) => {
    const { locale = ptBR } = options;
    const parsedDate = new Date(date);
    return format(parsedDate, formatString, { locale });
  },
};
