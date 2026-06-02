import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CadastroPage from '../CadastroPage';
import { ThemeProvider } from '../../contexts/ThemeContext';

const mockNavigate = vi.fn();
const mockCadastrar = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    cadastrar: mockCadastrar,
  }),
}));

describe('CadastroPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = () => render(
    <ThemeProvider>
      <MemoryRouter>
        <CadastroPage />
      </MemoryRouter>
    </ThemeProvider>,
  );

  it('deve renderizar o formulario de cadastro', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Conta/i })).toBeInTheDocument();
  });

  it('deve cadastrar usuario com os dados informados', async () => {
    mockCadastrar.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    const { container } = renderPage();

    const inputs = Array.from(container.querySelectorAll('input'));
    await user.type(inputs[0], 'Maria Silva');
    await user.type(inputs[1], 'maria@empresa.com');
    await user.type(inputs[2], 'Empresa X');
    await user.type(inputs[3], 'senha123');
    await user.type(inputs[4], 'senha123');
    await user.click(screen.getByRole('button', { name: /Criar Conta/i }));

    await waitFor(() => expect(mockCadastrar).toHaveBeenCalledWith(
      'Maria Silva',
      'maria@empresa.com',
      'senha123',
      'Empresa X',
    ));
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
