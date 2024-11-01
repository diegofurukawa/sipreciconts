// src/components/Supply/__tests__/SupplyList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupplyList from '../SupplyList';
import { SupplyService } from '../../../services/api/supply';

jest.mock('../../../services/supplyService');

describe('SupplyList', () => {
  const mockSupplies = [
    {
      id: 1,
      name: 'Item Test',
      type: 'MAT',
      type_display: 'Material',
      unit_measure: 'UN',
      unit_measure_display: 'Unidade'
    }
  ];

  beforeEach(() => {
    (SupplyService.list as jest.Mock).mockResolvedValue(mockSupplies);
  });

  it('renders supply list successfully', async () => {
    render(<SupplyList />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Item Test')).toBeInTheDocument();
    });
  });

  it('opens create form when clicking new button', async () => {
    render(<SupplyList />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Novo Insumo'));
      expect(screen.getByText('Nome *')).toBeInTheDocument();
    });
  });

  it('handles delete confirmation dialog', async () => {
    render(<SupplyList />);

    await waitFor(() => {
      const deleteButton = screen.getByText('Excluir');
      fireEvent.click(deleteButton);
      expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument();
    });
  });
});

// src/components/Supply/__tests__/SupplyForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupplyForm from '../SupplyForm';
import { SupplyService } from '../../../services/api/supply';

jest.mock('../../../services/supplyService');

describe('SupplyForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty form for new supply', () => {
    render(
      <SupplyForm 
        supply={null}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText('Nome *')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo *')).toBeInTheDocument();
    expect(screen.getByLabelText('Unidade de Medida *')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <SupplyForm 
        supply={null}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    (SupplyService.create as jest.Mock).mockResolvedValue({});

    render(
      <SupplyForm 
        supply={null}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.change(screen.getByLabelText('Nome *'), {
      target: { value: 'Novo Insumo' }
    });

    fireEvent.click(screen.getByText('Salvar'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});