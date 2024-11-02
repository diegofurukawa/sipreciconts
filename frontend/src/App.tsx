// src/App.tsx
import { AppRoutes } from './routes';
import { MainLayout } from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
}

export default App;