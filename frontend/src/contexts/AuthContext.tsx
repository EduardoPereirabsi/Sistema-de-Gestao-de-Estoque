import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import type { AutenticacaoResponse, Usuario } from '../types';

interface AuthContextData {
  usuario: Usuario | null;
  isAdmin: boolean;
  isGerente: boolean;
  isAdminOrGerente: boolean;
  autenticado: boolean;
  login: (email: string, senha: string, empresaId?: number) => Promise<AutenticacaoResponse>;
  cadastrar: (nome: string, email: string, senha: string, nomeEmpresa: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);
const CHAVE_USUARIO = 'usuario';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const raw = localStorage.getItem(CHAVE_USUARIO);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const raw = localStorage.getItem(CHAVE_USUARIO);
    if (raw) setUsuario(JSON.parse(raw));
  }, []);

  const limparSessao = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem(CHAVE_USUARIO);
    setUsuario(null);
  };

  const salvarSessao = (data: AutenticacaoResponse) => {
    if (!data.accessToken || !data.usuario) {
      return;
    }

    localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(data.usuario));
    setUsuario(data.usuario);
  };

  const login = async (email: string, senha: string, empresaId?: number) => {
    const payload = empresaId !== undefined ? { email, senha, empresaId } : { email, senha };
    const { data } = await api.post<AutenticacaoResponse>('/api/auth/login', payload);

    if (data.accessToken && data.usuario) {
      salvarSessao(data);
    }

    return data;
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
