// src/components/FeatureCard.tsx
interface FeatureCardProps {
    title: string;
    description: string;
  }
  
  export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
    return (
      <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  };
  