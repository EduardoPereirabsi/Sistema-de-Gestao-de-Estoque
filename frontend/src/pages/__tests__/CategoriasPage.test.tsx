import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriasPage from '../CategoriasPage';

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

describe('CategoriasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.get).mockResolvedValue({
      data: [{ id: 1, nome: 'Eletronicos', descricao: 'Produtos eletronicos' }],
    } as never);
  });

  it('deve listar categorias carregadas da API', async () => {
    render(<CategoriasPage />);

    expect(await screen.findByText('Eletronicos')).toBeInTheDocument();
    expect(screen.getByText('Produtos eletronicos')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Nova Categoria', async () => {
    render(<CategoriasPage />);

    await userEvent.click(screen.getByRole('button', { name: /Nova Categoria/i }));

    expect(screen.getByRole('heading', { name: 'Nova Categoria' })).toBeInTheDocument();
  });
});
