// src/pages/Supplies/index.tsx
import { MainLayout } from '../../layouts/MainLayout';
import SupplyList from '../../components/Supply/SupplyList';

const SuppliesPage = () => {
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <SupplyList />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuppliesPage;