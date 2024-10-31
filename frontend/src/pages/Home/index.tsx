// src/pages/Home/index.tsx
import React from 'react';
import { FeatureCard } from './components/FeatureCard';

const Home: React.FC = () => {
  const features = [
    {
      title: 'Cadastro de clientes',
      description: 'Gerencie sua carteira de clientes com mais facilidade. Cadastre a clientela com todas as informações necessárias.'
    },
    {
      title: 'Importação rápida',
      description: 'Importe os contatos existentes e cadastre quantos clientes precisar. Mantenha todos os dados organizados.'
    },
    {
      title: 'Recibos digitais',
      description: 'Envie recibos digitais com todos os dados da compra diretamente para seus clientes.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Precificação e Contratos
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Gerencie seus clientes, contratos e precificação em um só lugar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
