import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

const mockNavigate = vi.fn();
const mockLogin = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar formulario de login', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('SmartStock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByText('Criar conta')).toBeInTheDocument();
  });

  it('deve chamar login com email e senha', async () => {
    mockLogin.mockResolvedValueOnce({
      accessToken: 'tk',
      usuario: { id: 1, nome: 'Maria' },
    });

    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const inputs = Array.from(container.querySelectorAll('input'));
    await user.type(inputs[0], 'maria@empresa.com');
    await user.type(inputs[1], 'senha123');
    await user.click(screen.getByRole('button', { name: /Entrar/i }));

    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('maria@empresa.com', 'senha123'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('deve exibir selecao de empresa quando login retorna multiplas empresas', async () => {
    mockLogin.mockResolvedValueOnce({
      empresas: [
        { id: 1, nome: 'Empresa A' },
        { id: 2, nome: 'Empresa B' },
      ],
    });

    const user = userEvent.setup();
    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    const inputs = Array.from(container.querySelectorAll('input'));
    await user.type(inputs[0], 'maria@empresa.com');
    await user.type(inputs[1], 'senha123');
    await user.click(screen.getByRole('button', { name: /Entrar/i }));

    expect(await screen.findByText('Selecione a empresa')).toBeInTheDocument();
    expect(screen.getByText('Empresa A')).toBeInTheDocument();
    expect(screen.getByText('Empresa B')).toBeInTheDocument();
  });
});
