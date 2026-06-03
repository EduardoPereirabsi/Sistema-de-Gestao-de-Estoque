import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar';
import i18n from '../../../i18n';

const mockUseAuth = vi.fn();
const mockOnToggle = vi.fn();

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

function renderSidebar() {
  return render(
    <MemoryRouter>
      <Sidebar open onToggle={mockOnToggle} />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  beforeEach(async () => {
    mockUseAuth.mockReset();
    mockOnToggle.mockReset();
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

  it('deve mostrar todas as telas exceto usuarios para operador', () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'OPERADOR' },
    });

    renderSidebar();

    expect(screen.getByText('Painel')).toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
    expect(screen.getByText('Categorias')).toBeInTheDocument();
    expect(screen.getByText('Fornecedores')).toBeInTheDocument();
    expect(screen.getByText('Estoque')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Movimenta/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Usu/i })).not.toBeInTheDocument();
  });

  it('deve permitir fechar a sidebar pelo botao de fechar', async () => {
    mockUseAuth.mockReturnValue({
      usuario: { perfil: 'ADMIN', nomeEmpresa: 'Empresa X' },
    });

    renderSidebar();

    const botoesFechar = screen.getAllByLabelText('Fechar menu');
    await userEvent.click(botoesFechar[botoesFechar.length - 1]);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
