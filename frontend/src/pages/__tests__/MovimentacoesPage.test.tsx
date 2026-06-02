import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovimentacoesPage from '../MovimentacoesPage';

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { api } from '../../services/api';

describe('MovimentacoesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockImplementation((url: string) => {
      if (url.startsWith('/api/movements')) {
        return Promise.resolve({
          data: {
            content: [{
              id: 1,
              nomeProduto: 'Mouse',
              skuProduto: 'MOU-001',
              nomeUsuario: 'Maria',
              tipo: 'ENTRADA',
              quantidade: 10,
              motivo: 'Compra',
              criadoEm: '2026-06-02T10:00:00',
            }],
            totalPages: 1,
          },
        } as never);
      }

      return Promise.resolve({
        data: {
          content: [{ id: 1, nome: 'Mouse', sku: 'MOU-001', preco: 10, quantidade: 5, quantidadeMinima: 2, estoqueAbaixo: false }],
        },
      } as never);
    });
  });

  it('deve listar movimentacoes retornadas pela API', async () => {
    render(<MovimentacoesPage />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Nova Movimentação', async () => {
    render(<MovimentacoesPage />);

    await userEvent.click(screen.getByRole('button', { name: /Nova Movimentação/i }));

    expect(screen.getByRole('heading', { name: 'Nova Movimentação' })).toBeInTheDocument();
  });
});
