// src/routes/modules/comercial.routes.tsx
import { Route } from 'react-router-dom';
import { QuoteList } from '../../components/Quote/QuoteList';
import { ContractList } from '../../components/Contract/ContractList';

export const comercialRoutes = [
  <Route key="orcamentos" path="orcamentos" element={<QuoteList />} />,
  <Route key="contratos" path="contratos" element={<ContractList />} />
];