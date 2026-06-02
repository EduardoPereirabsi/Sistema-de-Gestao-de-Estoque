import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsuariosPage from '../UsuariosPage';

vi.mock('../../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

import { api } from '../../services/api';

describe('UsuariosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('usuario', JSON.stringify({ id: 1 }));
    vi.mocked(api.get).mockResolvedValue({
      data: [{
        id: 2,
        nome: 'Maria Silva',
        email: 'maria@empresa.com',
        perfil: 'GERENTE',
        ativo: true,
        nomeEmpresa: 'Empresa X',
      }],
    } as never);
  });

  it('deve listar usuarios retornados pela API', async () => {
    render(<UsuariosPage />);

    expect(await screen.findByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('maria@empresa.com')).toBeInTheDocument();
  });

  it('deve abrir modal ao clicar em Novo Usuário', async () => {
    render(<UsuariosPage />);

    await userEvent.click(screen.getByRole('button', { name: /Novo Usuário/i }));

    expect(screen.getByRole('heading', { name: 'Novo Usuário' })).toBeInTheDocument();
  });
});
