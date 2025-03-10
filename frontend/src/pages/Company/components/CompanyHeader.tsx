// src/pages/Company/components/CompanyHeader.tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompanyHeaderProps {
  title: string;
  subtitle?: string;
}

export const CompanyHeader = ({ title, subtitle }: CompanyHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;