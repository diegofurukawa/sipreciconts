// src/App.tsx
import { AppProviders } from './providers';
import { AppRoutes } from './routes';

const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;