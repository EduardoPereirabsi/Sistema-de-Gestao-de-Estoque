import { useNavigate, Link } from 'react-router-dom';
import { Package, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const cadastroSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  nomeEmpresa: z.string().min(2, 'Nome da empresa deve ter no mínimo 2 caracteres'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string().min(6, 'Confirme a senha'),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function CadastroPage() {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  const onSubmit = async (dados: CadastroFormData) => {
    setErro('');
    setCarregando(true);
    try {
      await cadastrar(dados.nome, dados.email, dados.senha, dados.nomeEmpresa);
      navigate('/painel');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErro(msg ?? 'Erro ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-xl mb-3">
            <Package size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Criar Conta</h1>
          <p className="text-gray-500 text-sm mt-1">SmartStock — Gestão de Estoque</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              {...register('nome')}
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
            <input
              {...register('nomeEmpresa')}
              autoComplete="off"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.nomeEmpresa && <p className="text-red-500 text-xs mt-1">{errors.nomeEmpresa.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input
                {...register('senha')}
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
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
            {errors.senha && <p className="text-red-500 text-xs mt-1">{errors.senha.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <input
              {...register('confirmarSenha')}
              type="password"
              autoComplete="new-password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmarSenha && <p className="text-red-500 text-xs mt-1">{errors.confirmarSenha.message}</p>}
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
                <UserPlus size={16} />
                Criar Conta
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500">
            Já tem conta?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


