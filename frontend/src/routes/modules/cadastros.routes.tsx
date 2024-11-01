// src/routes/modules/cadastros.routes.tsx
import { Route } from 'react-router-dom';
import { CustomerList } from '../../components/Customer/CustomerList';
import { CompanyList } from '../../components/Company/CompanyList';
import { TaxList } from '../../components/Tax/TaxList';
import { SupplyList } from '../../components/Supply/SupplyList';

export const cadastrosRoutes = [
  <Route key="clientes" path="clientes" element={<CustomerList />} />,
  <Route key="empresas" path="empresas" element={<CompanyList />} />,
  <Route key="impostos" path="impostos" element={<TaxList />} />,
  <Route key="insumos" path="insumos" element={<SupplyList />} />
];