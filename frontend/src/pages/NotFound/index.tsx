// src/pages/NotFound/index.tsx
const NotFoundPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-2 text-lg text-gray-600">Página não encontrada</p>
          <a 
            href="/"
            className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Voltar para Home
          </a>
        </div>
      </div>
    );
  };
  
  export default NotFoundPage;