import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProdutosPage from '../ProdutosPage';

const mockUseAuth = vi.fn();

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

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

import { api } from '../../services/api';

describe('ProdutosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAdminOrGerente: true });
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
    await screen.findByText('Mouse');

    await userEvent.click(screen.getByRole('button', { name: /Novo Produto/i }));

    expect(screen.getByRole('heading', { name: 'Novo Produto' })).toBeInTheDocument();
  });

  it('deve abrir popup de confirmacao ao excluir produto', async () => {
    render(<ProdutosPage />);
    await screen.findByText('Mouse');

    await userEvent.click(screen.getByTitle('Excluir'));

    expect(screen.getByRole('heading', { name: 'Excluir produto?' })).toBeInTheDocument();
    expect(screen.getByText('Mouse será removido das listagens, mas o histórico continuará salvo.')).toBeInTheDocument();
  });

  it('deve ocultar acoes de cadastro para operador', async () => {
    mockUseAuth.mockReturnValue({ isAdminOrGerente: false });

    render(<ProdutosPage />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Novo Produto/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument();
  });
});
