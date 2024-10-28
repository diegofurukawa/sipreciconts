import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
}

export const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {showHeader && (
          <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Sistema de Precificação e Contratos
              </h1>
            </div>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};