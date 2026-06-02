import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Eye, EyeOff, LogIn, Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { EmpresaAutenticacao } from '../types';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [credenciais, setCredenciais] = useState<LoginFormData | null>(null);
  const [empresas, setEmpresas] = useState<EmpresaAutenticacao[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const obterMensagemErro = (err: unknown, mensagemPadrao: string) =>
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? mensagemPadrao;

  const onSubmit = async (dados: LoginFormData) => {
    setErro('');
    setCarregando(true);
    try {
      const resposta = await login(dados.email, dados.senha);

      if (resposta.accessToken && resposta.usuario) {
        navigate('/');
        return;
      }

      if (resposta.empresas && resposta.empresas.length > 0) {
        setCredenciais(dados);
        setEmpresas(resposta.empresas);
        return;
      }

      setErro('Não foi possível concluir o login.');
    } catch (err: unknown) {
      setEmpresas([]);
      setCredenciais(null);
      setErro(obterMensagemErro(err, 'E-mail ou senha inválidos.'));
    } finally {
      setCarregando(false);
    }
  };

  const selecionarEmpresa = async (empresaId: number) => {
    if (!credenciais) {
      setErro('As credenciais expiraram. Faça o login novamente.');
      setEmpresas([]);
      return;
    }

    setErro('');
    setCarregando(true);
    try {
      const resposta = await login(credenciais.email, credenciais.senha, empresaId);

      if (resposta.accessToken && resposta.usuario) {
        navigate('/');
        return;
      }

      setErro('Não foi possível concluir o login na empresa selecionada.');
    } catch (err: unknown) {
      setErro(obterMensagemErro(err, 'Não foi possível entrar na empresa selecionada.'));
    } finally {
      setCarregando(false);
    }
  };

  const voltarParaCredenciais = () => {
    setErro('');
    setEmpresas([]);
    setCredenciais(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-xl mb-3">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">SmartStock</h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de Estoque</p>
        </div>

        {empresas.length > 0 ? (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800">Selecione a empresa</h2>
              <p className="text-sm text-gray-500 mt-1">
                Seu e-mail está vinculado a mais de uma empresa. Escolha onde deseja entrar.
              </p>
            </div>

            <div className="space-y-3">
              {empresas.map((empresa) => (
                <button
                  key={empresa.id}
                  type="button"
                  onClick={() => selecionarEmpresa(empresa.id)}
                  disabled={carregando}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left hover:border-blue-500 hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-3"
                >
                  <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                    <Building2 size={18} />
                  </span>
                  <span className="font-medium text-gray-800">{empresa.nome}</span>
                </button>
              ))}
            </div>

            {erro && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{erro}</p>
            )}

            <button
              type="button"
              onClick={voltarParaCredenciais}
              disabled={carregando}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                {...register('email')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  {...register('senha')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>
              )}
            </div>

            {erro && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{erro}</p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {carregando ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <LogIn size={16} />
                  Entrar
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Não tem conta?{' '}
              <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">
                Criar conta
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
