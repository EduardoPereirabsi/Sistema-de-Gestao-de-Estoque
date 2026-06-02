import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PainelPage from '../PainelPage';

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '../../services/api';

describe('PainelPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url === '/api/products?size=1') {
        return Promise.resolve({ data: { totalElements: 8 } } as never);
      }
      if (url === '/api/categories') {
        return Promise.resolve({ data: [{ id: 1, nome: 'Eletronicos' }, { id: 2, nome: 'Moveis' }] } as never);
      }
      if (url === '/api/suppliers') {
        return Promise.resolve({ data: [{ id: 1, nome: 'Fornecedor A' }] } as never);
      }
      return Promise.resolve({
        data: [{ id: 1, nome: 'Mouse', sku: 'MOU-001', quantidade: 2, quantidadeMinima: 5, estoqueAbaixo: true, preco: 10 }],
      } as never);
    });
  });

  it('deve renderizar cards e lista de estoque baixo', async () => {
    render(<PainelPage />);

    expect(await screen.findByText('Total de Produtos')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('Produtos com Estoque Baixo')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
  });
});
