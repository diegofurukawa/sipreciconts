import React from 'react';

interface CustomerToolbarProps {
  onNew: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
}

const CustomerToolbar: React.FC<CustomerToolbarProps> = ({
  onNew,
  onImport,
  onExport,
}) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Clientes</h1>
      <div className="flex gap-4">
        <button
          onClick={onNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Novo Cliente
        </button>
        <div className="flex items-center gap-2">
          <label
            htmlFor="importInput"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            Importar
          </label>
          <input
            id="importInput"
            type="file"
            accept=".csv"
            onChange={onImport}
            className="hidden"
          />
          <button
            onClick={onExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerToolbar;