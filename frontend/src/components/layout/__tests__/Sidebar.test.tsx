import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';

const mockUseAuth = vi.fn();

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('deve mostrar todos os links para admin', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'ADMIN' },
    });

    renderSidebar();

    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Fornecedores')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Movimentações')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });

  it('nao deve mostrar usuarios para gerente', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'GERENTE' },
    });

    renderSidebar();

    expect(screen.queryByText('Usuários')).not.toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
  });

  it('deve mostrar apenas estoque e movimentacoes para operador', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'OPERADOR' },
    });

    renderSidebar();

    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByText('Movimentações')).toBeInTheDocument();
    expect(screen.queryByText('Painel')).not.toBeInTheDocument();
    expect(screen.queryByText('Produtos')).not.toBeInTheDocument();
  });
});
