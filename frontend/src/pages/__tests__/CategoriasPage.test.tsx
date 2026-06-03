import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoriasPage from '../CategoriasPage';

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

describe('CategoriasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAdminOrGerente: true });
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
    await screen.findByText('Eletronicos');

    await userEvent.click(screen.getByRole('button', { name: /Nova Categoria/i }));

    expect(screen.getByRole('heading', { name: 'Nova Categoria' })).toBeInTheDocument();
  });

  it('deve abrir popup de confirmacao ao excluir categoria', async () => {
    render(<CategoriasPage />);
    await screen.findByText('Eletronicos');

    await userEvent.click(screen.getByTitle('Excluir'));

    expect(screen.getByRole('heading', { name: 'Excluir categoria?' })).toBeInTheDocument();
    expect(screen.getByText('Eletronicos será removida do cadastro.')).toBeInTheDocument();
  });

  it('deve ocultar acoes de cadastro para operador', async () => {
    mockUseAuth.mockReturnValue({ isAdminOrGerente: false });

    render(<CategoriasPage />);

    expect(await screen.findByText('Eletronicos')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Nova Categoria/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument();
  });
});
