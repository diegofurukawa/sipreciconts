// Componentes React para formatação de datas
// src/components/ui/date-formatters.tsx
import React from 'react';

interface DateFormatterProps {
  date: Date | number | string;
  includeTime?: boolean;
  className?: string;
}

export const FormattedDate: React.FC<DateFormatterProps> = ({ 
  date, 
  includeTime = false,
  className 
}) => (
  <time 
    dateTime={new Date(date).toISOString()}
    className={className}
  >
    {dateUtils.format(date, { includeTime })}
  </time>
);

export const RelativeDate: React.FC<DateFormatterProps> = ({ 
  date,
  className 
}) => (
  <time 
    dateTime={new Date(date).toISOString()}
    className={className}
  >
    {dateUtils.formatRelative(date)}
  </time>
);

export const ShortDate: React.FC<DateFormatterProps> = ({ 
  date,
  includeTime = false,
  className 
}) => (
  <time 
    dateTime={new Date(date).toISOString()}
    className={className}
  >
    {includeTime ? dateUtils.formatShortWithTime(date) : dateUtils.formatShort(date)}
  </time>
);