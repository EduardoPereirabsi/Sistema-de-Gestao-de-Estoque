import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
    defaults: { headers: { common: {} } },
  },
}));

import { api } from '../services/api';

function TestComponent() {
  const {
    usuario,
    autenticado,
    isAdmin,
    isGerente,
    isAdminOrGerente,
    login,
    cadastrar,
    logout,
  } = useAuth();

  return (
    <div>
      <span data-testid="autenticado">{String(autenticado)}</span>
      <span data-testid="admin">{String(isAdmin)}</span>
      <span data-testid="gerente">{String(isGerente)}</span>
      <span data-testid="admin-gerente">{String(isAdminOrGerente)}</span>
      <span data-testid="usuario">{usuario ? usuario.nome : 'null'}</span>
      <button data-testid="login" onClick={() => login('teste@empresa.com', 'senha123')}>
        Login
      </button>
      <button
        data-testid="login-multiempresa"
        onClick={() => login('teste@empresa.com', 'senha123', 2)}
      >
        Login Empresa
      </button>
      <button
        data-testid="cadastrar"
        onClick={() => cadastrar('Novo Usuario', 'novo@empresa.com', 'senha123', 'Empresa X')}
      >
        Cadastrar
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve iniciar sem usuario autenticado', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId('autenticado').textContent).toBe('false');
    expect(screen.getByTestId('usuario').textContent).toBe('null');
  });

  it('deve carregar usuario salvo no localStorage', async () => {
    localStorage.setItem('accessToken', 'tk');
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      nome: 'Maria',
      email: 'maria@empresa.com',
      perfil: 'GERENTE',
      ativo: true,
      nomeEmpresa: 'Empresa X',
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId('usuario').textContent).toBe('Maria'));
    expect(screen.getByTestId('autenticado').textContent).toBe('true');
    expect(screen.getByTestId('gerente').textContent).toBe('true');
    expect(screen.getByTestId('admin-gerente').textContent).toBe('true');
  });

  it('deve fazer login e salvar sessao', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        accessToken: 'tk',
        refreshToken: 'rt',
        usuario: {
          id: 1,
          nome: 'Carlos',
          email: 'carlos@empresa.com',
          perfil: 'ADMIN',
          ativo: true,
          nomeEmpresa: 'Empresa X',
        },
      },
    } as never);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('login'));

    await waitFor(() => expect(screen.getByTestId('usuario').textContent).toBe('Carlos'));
    expect(localStorage.getItem('accessToken')).toBe('tk');
    expect(localStorage.getItem('refreshToken')).toBe('rt');
    expect(JSON.parse(localStorage.getItem('usuario') ?? '{}').nome).toBe('Carlos');
  });

  it('deve retornar empresas sem autenticar quando o email pertence a mais de uma empresa', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        empresas: [
          { id: 1, nome: 'Empresa A' },
          { id: 2, nome: 'Empresa B' },
        ],
      },
    } as never);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('login'));

    expect(screen.getByTestId('autenticado').textContent).toBe('false');
    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('deve enviar empresaId quando informado', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: {
        accessToken: 'tk',
        usuario: {
          id: 2,
          nome: 'Joao',
          email: 'joao@empresa.com',
          perfil: 'OPERADOR',
          ativo: true,
          nomeEmpresa: 'Empresa B',
        },
      },
    } as never);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('login-multiempresa'));

    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'teste@empresa.com',
      senha: 'senha123',
      empresaId: 2,
    });
  });

  it('deve fazer logout e limpar sessao', async () => {
    localStorage.setItem('accessToken', 'tk');
    localStorage.setItem('refreshToken', 'rt');
    localStorage.setItem('usuario', JSON.stringify({
      id: 1,
      nome: 'Usuario',
      email: 'u@empresa.com',
      perfil: 'OPERADOR',
      ativo: true,
      nomeEmpresa: 'Empresa X',
    }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('logout'));

    expect(screen.getByTestId('autenticado').textContent).toBe('false');
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('deve cadastrar e limpar uma sessao anterior', async () => {
    localStorage.setItem('accessToken', 'tk-antigo');
    localStorage.setItem('usuario', JSON.stringify({ nome: 'Antigo' }));
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} } as never);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await userEvent.click(screen.getByTestId('cadastrar'));

    expect(api.post).toHaveBeenCalledWith('/api/auth/register', {
      nome: 'Novo Usuario',
      email: 'novo@empresa.com',
      senha: 'senha123',
      nomeEmpresa: 'Empresa X',
    });
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('usuario')).toBeNull();
  });

  it('useAuth deve lancar erro fora do provider', () => {
    function BadComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<BadComponent />)).toThrow('useAuth must be used within AuthProvider');
  });
});
