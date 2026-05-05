import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'GERENTE' | 'OPERADOR';
  nomeEmpresa: string;
}

interface AuthContextData {
  usuario: UsuarioLogado | null;
  isAdmin: boolean;
  isGerente: boolean;
  isAdminOrGerente: boolean;
  autenticado: boolean;
  login: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string, nomeEmpresa: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const raw = localStorage.getItem('user');
    if (raw) setUsuario(JSON.parse(raw));
  }, []);

  const limparSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUsuario(null);
  };

  const salvarSessao = (data: { accessToken: string; refreshToken?: string; usuario: UsuarioLogado }) => {
    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const login = async (email: string, senha: string) => {
    const { data } = await api.post('/api/auth/login', { email, senha });
    salvarSessao(data);
  };

  const cadastrar = async (nome: string, email: string, senha: string, nomeEmpresa: string) => {
    await api.post('/api/auth/register', { nome, email, senha, nomeEmpresa });
    limparSessao();
  };

  const logout = () => {
    limparSessao();
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      isAdmin: usuario?.perfil === 'ADMIN',
      isGerente: usuario?.perfil === 'GERENTE',
      isAdminOrGerente: usuario?.perfil === 'ADMIN' || usuario?.perfil === 'GERENTE',
      autenticado: !!usuario,
      login,
      cadastrar,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
