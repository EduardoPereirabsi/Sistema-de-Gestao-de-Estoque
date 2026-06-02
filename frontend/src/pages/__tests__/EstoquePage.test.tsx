import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EstoquePage from '../EstoquePage';

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '../../services/api';

describe('EstoquePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve exibir produtos com estoque baixo', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: [{
        id: 1,
        nome: 'Mouse',
        sku: 'MOU-001',
        quantidade: 2,
        quantidadeMinima: 5,
        estoqueAbaixo: true,
        preco: 10,
      }],
    } as never);

    render(<EstoquePage />);

    expect(await screen.findByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Controle de Estoque')).toBeInTheDocument();
  });
});
