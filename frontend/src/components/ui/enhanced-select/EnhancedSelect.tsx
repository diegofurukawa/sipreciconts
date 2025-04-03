// src/components/ui/enhanced-select/EnhancedSelect.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SelectOption {
  id: number | string;
  label: string;
  secondaryLabel?: string;
  badgeText?: string;
  badgeColor?: string;
  description?: string;
}

interface EnhancedSelectProps {
  options: SelectOption[];
  value: number | string;
  onChange: (value: number | string) => void;
  isLoading?: boolean;
  error?: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  loadingMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
  filterFunction?: (option: SelectOption, searchTerm: string) => boolean;
  itemsPerPage?: number; // Número de itens a carregar por vez
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options,
  value,
  onChange,
  isLoading = false,
  error,
  label,
  required = false,
  placeholder = 'Selecione uma opção',
  searchPlaceholder = 'Buscar...',
  noOptionsMessage = 'Nenhuma opção encontrada',
  loadingMessage = 'Carregando...',
  errorMessage = 'Erro ao carregar opções',
  onRetry,
  filterFunction,
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(null);
  const [loadError, setLoadError] = useState<boolean>(options.length === 0 && !isLoading);
  const [visibleItems, setVisibleItems] = useState<number>(itemsPerPage);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handler para detectar quando o usuário rolou próximo ao fim da lista
  const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // Verifica se o usuário rolou até próximo do final (80px do final)
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 80) {
      // Carrega mais itens quando chegar perto do final
      setVisibleItems(prev => prev + itemsPerPage);
    }
  }, [itemsPerPage]);

  // Encontra a opção selecionada quando o valor muda ou as opções são carregadas
  useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(option => option.id === value);
      if (found) {
        setSelectedOption(found);
      }
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  // Atualiza o estado de erro de carregamento
  useEffect(() => {
    setLoadError(options.length === 0 && !isLoading);
  }, [options, isLoading]);

  // Fecha o dropdown quando o usuário clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reseta o número de itens visíveis quando a pesquisa muda
  useEffect(() => {
    setVisibleItems(itemsPerPage);
  }, [searchTerm, itemsPerPage]);

  // Foca no campo de busca quando o dropdown é aberto
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filtra opções pelo termo de busca
  const filteredOptions = searchTerm
    ? options.filter(option => 
        filterFunction
          ? filterFunction(option, searchTerm)
          : option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.secondaryLabel && option.secondaryLabel.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (option.description && option.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : options;

  // Apenas os itens que devem ser visíveis atualmente
  const visibleOptions = filteredOptions.slice(0, visibleItems);
  
  // Função para limpar a seleção
  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(0);
    setSelectedOption(null);
  };

  // Função para selecionar uma opção
  const handleSelectOption = (option: SelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(option.id);
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Função para limpar a pesquisa
  const handleClearSearch = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    setVisibleItems(itemsPerPage);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Área de seleção */}
      <div 
        className={`flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer ${error ? 'border-red-500' : 'border-gray-200'} hover:border-emerald-500`}
        onClick={() => setIsOpen(!isOpen)}
        ref={parentRef}
      >
        {selectedOption ? (
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center truncate pr-2">
              <span className="font-medium truncate">{selectedOption.label}</span>
              {selectedOption.badgeText && (
                <span className={`ml-2 text-xs px-2 py-0.5 ${selectedOption.badgeColor || 'bg-gray-100'} rounded-full ${selectedOption.badgeColor?.includes('blue') ? 'text-blue-700' : 'text-gray-700'} truncate`}>
                  {selectedOption.badgeText}
                </span>
              )}
              {selectedOption.secondaryLabel && (
                <span className="ml-2 text-xs text-gray-500 truncate">
                  {selectedOption.secondaryLabel}
                </span>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
              onClick={handleClearSelection}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar seleção</span>
            </Button>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      
      {/* Dropdown Panel com largura controlada */}
      {isOpen && (
        <div 
          className="absolute z-10 mt-1 overflow-hidden rounded-md bg-white py-1 shadow-lg border border-gray-200"
          style={{ 
            width: parentRef.current?.offsetWidth ? `${parentRef.current.offsetWidth}px` : '100%',
            left: 0
          }}
        >
          {/* Campo de busca */}
          <div className="px-3 py-2 border-b sticky top-0 bg-white z-20">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-8 py-1.5 text-sm border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                ref={searchInputRef}
              />
              {searchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 text-gray-400"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Limpar busca</span>
                </Button>
              )}
            </div>
          </div>

          {/* Estado de carregamento */}
          {isLoading ? (
            <div className="px-3 py-6 text-center">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">{loadingMessage}</p>
            </div>
          ) : loadError ? (
            <div className="px-3 py-6 text-center">
              <AlertCircle className="h-5 w-5 text-red-500 mx-auto" />
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
              {onRetry && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRetry();
                  }}
                >
                  Tentar novamente
                </Button>
              )}
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-sm text-gray-500">{noOptionsMessage}</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-auto" onScroll={handleScroll}>
              <ul ref={listRef}>
                {visibleOptions.map((option) => {
                  const itemKey = option.id ? `option-${option.id}` : `option-item-${Math.random().toString(36).substr(2, 9)}`;
                  
                  return (
                    <li 
                      key={itemKey}
                      className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${value === option.id ? 'bg-emerald-50' : ''}`}
                      onClick={(e) => handleSelectOption(option, e)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium flex items-center">
                            {option.label}
                            {option.badgeText && (
                              <span className={`ml-2 text-xs px-2 py-0.5 ${option.badgeColor || 'bg-gray-100'} rounded-full ${option.badgeColor?.includes('blue') ? 'text-blue-700' : 'text-gray-700'}`}>
                                {option.badgeText}
                              </span>
                            )}
                          </div>
                          {(option.secondaryLabel || option.description) && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              {option.description || option.secondaryLabel}
                            </div>
                          )}
                        </div>
                        {value === option.id && (
                          <Check className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                    </li>
                  );
                })}

                {/* Indicador de carregamento no final da lista */}
                {visibleItems < filteredOptions.length && (
                  <li className="px-3 py-2 text-center">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto text-gray-400" />
                  </li>
                )}
              </ul>
            </div>
          )}
          
          {/* Rodapé com contador (opcional) */}
          {filteredOptions.length > 10 && (
            <div className="px-3 py-1 border-t text-xs text-center text-gray-500">
              Mostrando {Math.min(visibleItems, filteredOptions.length)} de {filteredOptions.length} resultados
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default EnhancedSelect;