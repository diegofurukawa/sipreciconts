import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Info, Check } from 'lucide-react';

// Componente principal de formulário
const PriceForm = () => {
  // Estados do formulário
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [selectedTax, setSelectedTax] = useState(null);
  const [value, setValue] = useState('');
  const [sequence, setSequence] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Estados para os componentes de autocomplete
  const [supplySearchTerm, setSupplySearchTerm] = useState('');
  const [taxSearchTerm, setTaxSearchTerm] = useState('');
  const [supplyDropdownOpen, setSupplyDropdownOpen] = useState(false);
  const [taxDropdownOpen, setTaxDropdownOpen] = useState(false);

  // Refs para manipulação de cliques fora dos dropdowns
  const supplyRef = useRef(null);
  const taxRef = useRef(null);

  // Dados simulados de insumos
  const supplies = [
    { id: 1, name: 'Fertilizante NPK', type: 'Material', unit: 'KG' },
    { id: 2, name: 'Semente de Milho', type: 'Material', unit: 'KG' },
    { id: 3, name: 'Herbicida', type: 'Material', unit: 'L' },
    { id: 4, name: 'Trator', type: 'Equipamento', unit: 'UN' },
    { id: 5, name: 'Consultoria Agronômica', type: 'Serviço', unit: 'HR' },
    // Simulando muitos registros
    { id: 6, name: 'Adubo Orgânico', type: 'Material', unit: 'KG' },
    { id: 7, name: 'Calcário', type: 'Material', unit: 'KG' },
    { id: 8, name: 'Micronutrientes', type: 'Material', unit: 'KG' },
    { id: 9, name: 'Inseticida', type: 'Material', unit: 'L' },
  ];

  // Dados simulados de impostos
  const taxes = [
    { id: 1, acronym: 'ICMS', value: 18, calcOperator: '%', group: 'Estadual' },
    { id: 2, acronym: 'IPI', value: 10, calcOperator: '%', group: 'Federal' },
    { id: 3, acronym: 'ISS', value: 5, calcOperator: '%', group: 'Municipal' },
    { id: 4, acronym: 'PIS', value: 1.65, calcOperator: '%', group: 'Federal' },
    { id: 5, acronym: 'COFINS', value: 7.6, calcOperator: '%', group: 'Federal' },
  ];

  // Efeito para fechar dropdowns ao clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (supplyRef.current && !supplyRef.current.contains(event.target)) {
        setSupplyDropdownOpen(false);
      }
      if (taxRef.current && !taxRef.current.contains(event.target)) {
        setTaxDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Efeito para sugerir a próxima sequência
  useEffect(() => {
    // Simulando a busca da maior sequência existente
    const maxSequence = 3; // Em produção, isso viria da API
    setSequence(maxSequence + 1);
  }, []);

  // Funções para filtrar insumos e impostos baseado nos termos de busca
  const filteredSupplies = supplies.filter(supply => 
    supply.name.toLowerCase().includes(supplySearchTerm.toLowerCase()) ||
    supply.type.toLowerCase().includes(supplySearchTerm.toLowerCase())
  );

  const filteredTaxes = taxes.filter(tax => 
    tax.acronym.toLowerCase().includes(taxSearchTerm.toLowerCase()) ||
    tax.group.toLowerCase().includes(taxSearchTerm.toLowerCase())
  );

  // Função para formatar valor de moeda
  const formatCurrency = (value) => {
    const onlyNumbers = value.replace(/\D/g, '');
    
    if (onlyNumbers === '') return '';
    
    const number = parseInt(onlyNumbers, 10) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  // Handler para atualizar o campo de valor
  const handleValueChange = (e) => {
    const input = e.target.value;
    // Remove formatação e mantém apenas números
    const numericValue = input.replace(/\D/g, '');
    
    // Formata para exibição
    const formattedValue = formatCurrency(numericValue);
    setValue(formattedValue);
  };

  // Função para lidar com a submissão do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSupply || !selectedTax || !value) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);

    // Simulando envio para API
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      
      // Dados que seriam enviados para a API
      const formData = {
        supply: selectedSupply.id,
        tax: selectedTax.id,
        value: value.replace(/\D/g, '') / 100, // Converte para número
        sequence: parseInt(sequence, 10)
      };
      
      console.log('Dados enviados:', formData);
      
      // Resetar o formulário ou redirecionar após 1.5 segundos
      setTimeout(() => {
        // Aqui você redirecionaria para a lista
        setFormSubmitted(false);
        alert('Preço de insumo salvo com sucesso!');
      }, 1500);
    }, 1000);
  };

  const handleCancel = () => {
    // Função para cancelar e voltar para a lista
    alert('Operação cancelada');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <header className="flex items-center mb-6">
        <button className="mr-2 p-2 rounded-full hover:bg-gray-100">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="text-2xl font-semibold">Novo Preço de Insumo</h1>
      </header>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-medium">Novo Preço de Insumo</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Campo de Insumo com Autocomplete */}
            <div className="space-y-2" ref={supplyRef}>
              <label className="block text-sm font-medium">
                Insumo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-emerald-500"
                  onClick={() => setSupplyDropdownOpen(!supplyDropdownOpen)}
                >
                  {selectedSupply ? (
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{selectedSupply.name}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-700">
                          {selectedSupply.type} - {selectedSupply.unit}
                        </span>
                      </div>
                      <button 
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSupply(null);
                          setSupplySearchTerm('');
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">Selecione um insumo</span>
                  )}
                </div>
                
                {supplyDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border rounded-md"
                          placeholder="Buscar insumo..."
                          value={supplySearchTerm}
                          onChange={(e) => setSupplySearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {supplySearchTerm && (
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setSupplySearchTerm('')}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-auto">
                      {filteredSupplies.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhum insumo encontrado
                        </div>
                      ) : (
                        <ul>
                          {filteredSupplies.map((supply) => (
                            <li
                              key={supply.id}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                selectedSupply?.id === supply.id ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => {
                                setSelectedSupply(supply);
                                setSupplyDropdownOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{supply.name}</div>
                                  <div className="text-xs text-gray-500">{supply.type} - {supply.unit}</div>
                                </div>
                                {selectedSupply?.id === supply.id && (
                                  <Check size={16} className="text-emerald-500" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo de Imposto com Autocomplete */}
            <div className="space-y-2" ref={taxRef}>
              <label className="block text-sm font-medium">
                Imposto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div 
                  className="flex items-center justify-between p-2 border rounded-md cursor-pointer hover:border-emerald-500"
                  onClick={() => setTaxDropdownOpen(!taxDropdownOpen)}
                >
                  {selectedTax ? (
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="font-medium">{selectedTax.acronym}</span>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 rounded-full text-blue-700">
                          {selectedTax.value}{selectedTax.calcOperator}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">{selectedTax.group}</span>
                      </div>
                      <button 
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTax(null);
                          setTaxSearchTerm('');
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500">Selecione um imposto</span>
                  )}
                </div>
                
                {taxDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full border rounded-md bg-white shadow-lg">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border rounded-md"
                          placeholder="Buscar imposto..."
                          value={taxSearchTerm}
                          onChange={(e) => setTaxSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {taxSearchTerm && (
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setTaxSearchTerm('')}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-60 overflow-auto">
                      {filteredTaxes.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Nenhum imposto encontrado
                        </div>
                      ) : (
                        <ul>
                          {filteredTaxes.map((tax) => (
                            <li
                              key={tax.id}
                              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                                selectedTax?.id === tax.id ? 'bg-emerald-50' : ''
                              }`}
                              onClick={() => {
                                setSelectedTax(tax);
                                setTaxDropdownOpen(false);
                              }}
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{tax.acronym}</div>
                                  <div className="text-xs text-gray-500">
                                    {tax.value}{tax.calcOperator} • {tax.group}
                                  </div>
                                </div>
                                {selectedTax?.id === tax.id && (
                                  <Check size={16} className="text-emerald-500" />
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo de Valor */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Valor <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 pl-8 border rounded-md"
                  value={value}
                  onChange={handleValueChange}
                  placeholder="0,00"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  R$
                </span>
              </div>
            </div>

            {/* Campo de Sequência */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Sequência
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                min="0"
              />
              <div className="flex items-start mt-1">
                <Info size={16} className="text-gray-400 mr-1 mt-0.5" />
                <p className="text-xs text-gray-500">
                  A sequência define a ordem de exibição dos preços
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center"
              disabled={loading || formSubmitted}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : formSubmitted ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Salvo!
                </>
              ) : (
                'Salvar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceForm;