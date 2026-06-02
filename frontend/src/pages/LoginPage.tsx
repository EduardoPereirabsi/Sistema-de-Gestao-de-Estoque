import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Eye, EyeOff, LogIn, Building2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import type { EmpresaAutenticacao } from '../types';
import AuthPageControls from '../components/auth/AuthPageControls';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 placeholder:text-gray-400 dark:placeholder:text-gray-500';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
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

      setErro(t('auth.loginFailed'));
    } catch (err: unknown) {
      setEmpresas([]);
      setCredenciais(null);
      setErro(obterMensagemErro(err, t('auth.invalidCredentials')));
    } finally {
      setCarregando(false);
    }
  };

  const selecionarEmpresa = async (empresaId: number) => {
    if (!credenciais) {
      setErro(t('auth.credentialsExpired'));
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

      setErro(t('auth.selectCompanyFailed'));
    } catch (err: unknown) {
      setErro(obterMensagemErro(err, t('auth.selectCompanyInvalid')));
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-8 relative">
        <div className="absolute right-6 top-6">
          <AuthPageControls />
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-xl mb-3">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">SmartStock</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('app.title')}</p>
        </div>

        {empresas.length > 0 ? (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t('auth.selectCompany')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('auth.selectCompanyDescription')}
              </p>
            </div>

            <div className="space-y-3">
              {empresas.map((empresa) => (
                <button
                  key={empresa.id}
                  type="button"
                  onClick={() => selecionarEmpresa(empresa.id)}
                  disabled={carregando}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-left hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-3 bg-white dark:bg-gray-900"
                >
                  <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 p-2 rounded-lg">
                    <Building2 size={18} />
                  </span>
                  <span className="font-medium text-gray-800 dark:text-gray-100">{empresa.nome}</span>
                </button>
              ))}
            </div>

            {erro && (
              <p className="text-red-600 dark:text-red-300 text-sm text-center bg-red-50 dark:bg-red-900/30 py-2 rounded-lg">
                {erro}
              </p>
            )}

            <button
              type="button"
              onClick={voltarParaCredenciais}
              disabled={carregando}
              className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <ArrowLeft size={16} />
              {t('common.back')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                {...register('email')}
                className={`${inputClassName} pr-4`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  {...register('senha')}
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.senha && (
                <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>
              )}
            </div>

            {erro && (
              <p className="text-red-600 dark:text-red-300 text-sm text-center bg-red-50 dark:bg-red-900/30 py-2 rounded-lg">
                {erro}
              </p>
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
                  {t('auth.login')}
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('auth.noAccount')}{' '}
              <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">
                {t('auth.register')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
