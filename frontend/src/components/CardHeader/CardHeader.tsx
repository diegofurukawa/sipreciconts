// src/components/ui/card-header.tsx
import React, { ReactNode } from 'react';
import { 
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';

interface CardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * Componente global simplificado para cabeçalhos de cards
 * Padroniza o layout com título, descrição e área de ações
 */
export const CardHeaderWithActions: React.FC<CardHeaderProps> = ({
  title,
  description,
  actions,
  className = "pb-3"
}) => {
  return (
    <CardHeader className={className}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </CardHeader>
  );
};

export default CardHeaderWithActions;