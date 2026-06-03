import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Outlet } from 'react-router-dom';
import App from '../App';

const mockAuth = {
  usuario: null as {
    id: number;
    nome: string;
    email: string;
    perfil: 'ADMIN' | 'GERENTE' | 'OPERADOR';
    ativo: boolean;
    nomeEmpresa: string;
  } | null,
  autenticado: false,
  isAdmin: false,
  isGerente: false,
  isAdminOrGerente: false,
  login: vi.fn(),
  cadastrar: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login</div>,
}));

vi.mock('../pages/CadastroPage', () => ({
  default: () => <div data-testid="cadastro-page">Cadastro</div>,
}));

vi.mock('../pages/PainelPage', () => ({
  default: () => <div data-testid="painel-page">Painel</div>,
}));

vi.mock('../pages/ProdutosPage', () => ({
  default: () => <div data-testid="produtos-page">Produtos</div>,
}));

vi.mock('../pages/CategoriasPage', () => ({
  default: () => <div data-testid="categorias-page">Categorias</div>,
}));

vi.mock('../pages/FornecedoresPage', () => ({
  default: () => <div data-testid="fornecedores-page">Fornecedores</div>,
}));

vi.mock('../pages/MovimentacoesPage', () => ({
  default: () => <div data-testid="movimentacoes-page">Movimentacoes</div>,
}));

vi.mock('../pages/UsuariosPage', () => ({
  default: () => <div data-testid="usuarios-page">Usuarios</div>,
}));

vi.mock('../pages/EstoquePage', () => ({
  default: () => <div data-testid="estoque-page">Estoque</div>,
}));

vi.mock('../components/layout/Layout', () => ({
  default: () => (
    <div data-testid="layout">
      <Outlet />
    </div>
  ),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.usuario = null;
    mockAuth.autenticado = false;
    mockAuth.isAdmin = false;
    mockAuth.isGerente = false;
    mockAuth.isAdminOrGerente = false;
  });

  it('deve renderizar login em /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('deve redirecionar usuario nao autenticado para login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('deve renderizar cadastro em /cadastro', () => {
    render(
      <MemoryRouter initialEntries={['/cadastro']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('cadastro-page')).toBeInTheDocument();
  });

  it('deve permitir acesso ao painel para admin autenticado', () => {
    mockAuth.autenticado = true;
    mockAuth.isAdmin = true;
    mockAuth.isAdminOrGerente = true;
    mockAuth.usuario = {
      id: 1,
      nome: 'Admin',
      email: 'admin@empresa.com',
      perfil: 'ADMIN',
      ativo: true,
      nomeEmpresa: 'Empresa Teste',
    };

    render(
      <MemoryRouter initialEntries={['/painel']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('painel-page')).toBeInTheDocument();
  });

  it('deve permitir acesso ao estoque para operador autenticado', () => {
    mockAuth.autenticado = true;
    mockAuth.usuario = {
      id: 2,
      nome: 'Operador',
      email: 'operador@empresa.com',
      perfil: 'OPERADOR',
      ativo: true,
      nomeEmpresa: 'Empresa Teste',
    };

    render(
      <MemoryRouter initialEntries={['/estoque']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('estoque-page')).toBeInTheDocument();
  });

  it('deve permitir acesso ao painel para operador autenticado', () => {
    mockAuth.autenticado = true;
    mockAuth.usuario = {
      id: 2,
      nome: 'Operador',
      email: 'operador@empresa.com',
      perfil: 'OPERADOR',
      ativo: true,
      nomeEmpresa: 'Empresa Teste',
    };

    render(
      <MemoryRouter initialEntries={['/painel']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('painel-page')).toBeInTheDocument();
  });

  it('deve bloquear a rota de usuarios para nao admin', () => {
    mockAuth.autenticado = true;
    mockAuth.usuario = {
      id: 2,
      nome: 'Gerente',
      email: 'gerente@empresa.com',
      perfil: 'GERENTE',
      ativo: true,
      nomeEmpresa: 'Empresa Teste',
    };
    mockAuth.isGerente = true;
    mockAuth.isAdminOrGerente = true;

    render(
      <MemoryRouter initialEntries={['/usuarios']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('usuarios-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('painel-page')).toBeInTheDocument();
  });
});
