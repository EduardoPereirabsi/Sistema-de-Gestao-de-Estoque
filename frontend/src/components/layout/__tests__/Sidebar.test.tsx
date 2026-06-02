import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import i18n from '../../../i18n';

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
  beforeEach(async () => {
    mockUseAuth.mockReset();
    await i18n.changeLanguage('pt-BR');
  });

  it('deve traduzir links para ingles', async () => {
    await i18n.changeLanguage('en-US');
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'ADMIN', nomeEmpresa: 'Company X' },
    });

    renderSidebar();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Suppliers')).toBeInTheDocument();
  });

  it('deve mostrar todos os links para admin', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'ADMIN', nomeEmpresa: 'Empresa X' },
    });

    renderSidebar();

    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Fornecedores')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Movimenta/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Usu/i })).toBeInTheDocument();
  });

  it('nao deve mostrar usuarios para gerente', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'GERENTE' },
    });

    renderSidebar();

    expect(screen.queryByRole('link', { name: /Usu/i })).not.toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
  });

  it('deve mostrar apenas estoque e movimentacoes para operador', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'OPERADOR' },
    });

    renderSidebar();

    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Movimenta/i })).toBeInTheDocument();
    expect(screen.queryByText('Painel')).not.toBeInTheDocument();
    expect(screen.queryByText('Produtos')).not.toBeInTheDocument();
  });
});
