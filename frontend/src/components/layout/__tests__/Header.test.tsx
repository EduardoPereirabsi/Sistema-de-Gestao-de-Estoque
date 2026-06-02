import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';
import { ThemeProvider } from '../../../contexts/ThemeContext';
import i18n from '../../../i18n';

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => ({
    usuario: {
      id: 1,
      nome: 'Admin User',
      email: 'admin@empresa.com',
      perfil: 'ADMIN',
      ativo: true,
      nomeEmpresa: 'Empresa X',
    },
    logout: mockLogout,
  }),
}));

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe('Header', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    await i18n.changeLanguage('pt-BR');
  });

  it('deve renderizar nome, perfil e empresa do usuario', () => {
    renderHeader();

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText(/Administrador/)).toBeInTheDocument();
    expect(screen.getByText(/Empresa X/)).toBeInTheDocument();
  });

  it('deve alternar o idioma para ingles', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /English/ }));

    expect(i18n.language).toBe('en-US');
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('deve alternar o tema', async () => {
    renderHeader();

    await userEvent.click(screen.getByLabelText('Escuro'));

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('deve abrir o menu com email do usuario', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /Admin User/i }));

    expect(screen.getByText('admin@empresa.com')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve fazer logout e navegar para login', async () => {
    renderHeader();

    await userEvent.click(screen.getByRole('button', { name: /Admin User/i }));
    await userEvent.click(screen.getByText('Sair'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
