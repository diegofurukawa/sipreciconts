// src/App.tsx
import { AppProviders } from './providers';
import { MainLayout } from './layouts/MainLayout';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <AppProviders>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </AppProviders>
  );
};

export default App;