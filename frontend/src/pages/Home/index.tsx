// src/pages/Home/index.tsx
import { MainLayout } from '@/layouts/MainLayout';
import { FeatureCard } from './components/FeatureCard';
import { ROUTES } from '@/routes/config/route-paths';

export const HomePage = () => {
  const features = [
    {
      title: 'Empresa',
      description: 'Gerencie os dados da sua empresa, configurações e preferências.',
      route: ROUTES.PRIVATE.CADASTROS.EMPRESA.ROOT
    },
    {
      title: 'Cadastro de clientes',
      description: 'Gerencie sua carteira de clientes com mais facilidade.',
      route: ROUTES.PRIVATE.CADASTROS.CLIENTES.ROOT
    },
    {
      title: 'Orçamentos e Contratos',
      description: 'Crie e gerencie orçamentos e contratos para seus clientes.',
      route: ROUTES.PRIVATE.COMERCIAL.ORCAMENTOS.ROOT
    },
  ];

  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
                route={feature.route}
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;