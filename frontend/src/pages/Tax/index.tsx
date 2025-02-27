// src/pages/Tax/index.tsx
import React from 'react';
import { TaxList } from './components/TaxList';

const TaxPage: React.FC = () => {
  return <TaxList />;
};

// Exportação padrão para uso em rotas
export default TaxPage;

// Exportação nomeada para uso em importações específicas
export { TaxPage };