// src/pages/Home/components/FeatureCard.tsx
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/config/route-paths';

interface FeatureCardProps {
  title: string;
  description: string;
  route?: string;
}

const FeatureCard = ({ title, description, route }: FeatureCardProps) => {
  const CardWrapper = route ? Link : 'div';
  
  return (
    <CardWrapper
      to={route || ''}
      className={`bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 ${
        route ? 'cursor-pointer' : ''
      }`}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </CardWrapper>
  );
};


export {
  FeatureCard
};