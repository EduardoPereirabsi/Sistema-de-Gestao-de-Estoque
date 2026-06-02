import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

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

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar nome, perfil e empresa do usuario', () => {
    render(<Header />);

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText(/Administrador/)).toBeInTheDocument();
    expect(screen.getByText(/Empresa X/)).toBeInTheDocument();
  });

  it('deve abrir o menu com email do usuario', async () => {
    render(<Header />);

    await userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('admin@empresa.com')).toBeInTheDocument();
    expect(screen.getByText('Sair')).toBeInTheDocument();
  });

  it('deve fazer logout e navegar para login', async () => {
    render(<Header />);

    await userEvent.click(screen.getByRole('button'));
    await userEvent.click(screen.getByText('Sair'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
