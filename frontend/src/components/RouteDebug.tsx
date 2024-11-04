// src/components/RouteDebug.tsx
import { useLocation, useParams, useRoutes } from 'react-router-dom';

const RouteDebug = () => {
  const location = useLocation();
  const params = useParams();
  
  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg max-w-md text-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div>
        <p>Path: {location.pathname}</p>
        <p>Params: {JSON.stringify(params)}</p>
      </div>
    </div>
  );
};

export {
    RouteDebug
};