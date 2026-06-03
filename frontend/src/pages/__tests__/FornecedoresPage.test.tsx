import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FornecedoresPage from '../FornecedoresPage';

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

describe('FornecedoresPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isAdminOrGerente: true });
    vi.mocked(api.get).mockResolvedValue({
      data: [{ id: 1, nome: 'Tech Distribuidora', email: 'contato@tech.com' }],
    } as never);
  });

  it('deve listar fornecedores carregados da API', async () => {
    render(<FornecedoresPage />);

    expect(await screen.findByText('Tech Distribuidora')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Novo Fornecedor', async () => {
    render(<FornecedoresPage />);
    await screen.findByText('Tech Distribuidora');

    await userEvent.click(screen.getByRole('button', { name: /Novo Fornecedor/i }));

    expect(screen.getByRole('heading', { name: 'Novo Fornecedor' })).toBeInTheDocument();
  });

  it('deve abrir popup de confirmacao ao excluir fornecedor', async () => {
    render(<FornecedoresPage />);
    await screen.findByText('Tech Distribuidora');

    await userEvent.click(screen.getByTitle('Excluir'));

    expect(screen.getByRole('heading', { name: 'Excluir fornecedor?' })).toBeInTheDocument();
    expect(screen.getByText('Tech Distribuidora será removido do cadastro.')).toBeInTheDocument();
  });

  it('deve ocultar acoes de cadastro para operador', async () => {
    mockUseAuth.mockReturnValue({ isAdminOrGerente: false });

    render(<FornecedoresPage />);

    expect(await screen.findByText('Tech Distribuidora')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Novo Fornecedor/i })).not.toBeInTheDocument();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Excluir')).not.toBeInTheDocument();
  });
});
