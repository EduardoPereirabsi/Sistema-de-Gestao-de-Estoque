import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FornecedoresPage from '../FornecedoresPage';

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

describe('FornecedoresPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    await userEvent.click(screen.getByRole('button', { name: /Novo Fornecedor/i }));

    expect(screen.getByRole('heading', { name: 'Novo Fornecedor' })).toBeInTheDocument();
  });
});
