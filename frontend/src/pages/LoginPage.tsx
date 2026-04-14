import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, EyeOff, LogIn } from 'lucide-react';
import { api } from '../services/api';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (dados: LoginFormData) => {
    setErro('');
    setCarregando(true);
    try {
      const resposta = await api.post('/auth/login', dados);
      localStorage.setItem('accessToken', resposta.data.accessToken);
      if (resposta.data.refreshToken) {
        localStorage.setItem('refreshToken', resposta.data.refreshToken);
      }
      navigate('/painel');
    } catch {
      setErro('E-mail ou senha inválidos.');
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
          <h1 className="text-2xl font-bold text-gray-800">SmartStock</h1>
          <p className="text-gray-500 text-sm mt-1">Gestão de Estoque</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="seu@email.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                {...register('senha')}
                placeholder="••••••••"
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
            <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">
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
                Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
