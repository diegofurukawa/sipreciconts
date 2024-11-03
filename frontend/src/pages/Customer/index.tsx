// src/pages/Customer/index.tsx
import { Routes, Route, useParams } from 'react-router-dom';
import { CustomerList } from './components/CustomerList';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDetails } from './components/CustomerDetails';
import { CustomerImport } from './components/CustomerImport';
import { MainLayout } from '@/layouts/MainLayout';

// Componente wrapper para CustomerDetails que pega o id da URL
const CustomerDetailsWrapper = () => {
  const { id } = useParams();
  
  if (!id) return null;
  
  return <CustomerDetails customerId={id} />;
};

const CustomerPage = () => {
  return (
    <MainLayout>
      <Routes>
        <Route index element={<CustomerList />} />
        <Route path="novo" element={<CustomerForm />} />
        <Route path=":id" element={<CustomerDetailsWrapper />} />
        <Route 
          path=":id/editar" 
          element={<CustomerForm />} 
        />
        <Route path="importar" element={<CustomerImport />} />
      </Routes>
    </MainLayout>
  );
};

export default CustomerPage;