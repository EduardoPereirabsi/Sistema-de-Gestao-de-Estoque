import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProdutosPage from '../ProdutosPage';

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { api } from '../../services/api';

describe('ProdutosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.startsWith('/api/products')) {
        return Promise.resolve({
          data: {
            content: [{
              id: 1,
              nome: 'Mouse',
              sku: 'MOU-001',
              preco: 10,
              quantidade: 5,
              quantidadeMinima: 2,
              estoqueAbaixo: false,
              categoria: { id: 1, nome: 'Eletronicos' },
            }],
            totalPages: 1,
          },
        } as never);
      }
      if (url === '/api/categories') {
        return Promise.resolve({ data: [{ id: 1, nome: 'Eletronicos' }] } as never);
      }
      return Promise.resolve({ data: [{ id: 1, nome: 'Fornecedor A' }] } as never);
    });
  });

  it('deve listar produtos retornados pela API', async () => {
    render(<ProdutosPage />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Eletronicos')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Novo Produto', async () => {
    render(<ProdutosPage />);

    await userEvent.click(screen.getByRole('button', { name: /Novo Produto/i }));

    expect(screen.getByRole('heading', { name: 'Novo Produto' })).toBeInTheDocument();
  });
});
