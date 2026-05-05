import { useEffect, useState } from 'react';
import { Plus, Pencil, X, UserCheck, UserX, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

type Perfil = 'ADMIN' | 'OPERADOR';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  nomeEmpresa: string;
  criadoEm: string;
}

interface FormCriar { nome: string; email: string; senha: string; perfil: Perfil; }
interface FormEditar { nome: string; email: string; senha: string; perfil: Perfil; }

const vazioFormCriar: FormCriar = { nome: '', email: '', senha: '', perfil: 'OPERADOR' };
const vazioFormEditar: FormEditar = { nome: '', email: '', senha: '', perfil: 'OPERADOR' };

const usuarioLogado = (): number | null => {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw).id ?? null; } catch { return null; }
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState<Usuario | null>(null);
  const [confirmAlternar, setConfirmAlternar] = useState<Usuario | null>(null);
  const [formCriar, setFormCriar] = useState<FormCriar>(vazioFormCriar);
  const [formEditar, setFormEditar] = useState<FormEditar>(vazioFormEditar);
  const [mostrarSenhaCriar, setMostrarSenhaCriar] = useState(false);
  const [mostrarSenhaEditar, setMostrarSenhaEditar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const idLogado = usuarioLogado();

  const carregar = async () => {
    try {
      setCarregando(true);
      const { data } = await api.get<Usuario[]>('/api/usuarios');
      setUsuarios(data);
    } catch {
      toast.error('Erro ao carregar usuários');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const abrirCriar = () => {
    setFormCriar({ ...vazioFormCriar });
    setMostrarSenhaCriar(false);
    setModalCriar(true);
  };

  const fecharCriar = () => {
    setModalCriar(false);
    setFormCriar({ ...vazioFormCriar });
    setMostrarSenhaCriar(false);
  };

  const handleCriar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.post('/api/usuarios', formCriar);
      toast.success('Usuário criado com sucesso!');
      fecharCriar();
      carregar();
    } catch {
      toast.error('Erro ao criar usuário');
    } finally {
      setSalvando(false);
    }
  };

  const handleEditar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditar) return;
    setSalvando(true);
    const payload: Partial<FormEditar> = {
      nome: formEditar.nome,
      email: formEditar.email,
      perfil: formEditar.perfil,
    };
    if (formEditar.senha) payload.senha = formEditar.senha;
    try {
      await api.put(`/api/usuarios/${modalEditar.id}`, payload);
      toast.success('Usuário atualizado!');
      setModalEditar(null);
      carregar();
    } catch {
      toast.error('Erro ao atualizar usuário');
    } finally {
      setSalvando(false);
    }
  };

  const handleAlternarAtivo = async (usuario: Usuario) => {
    try {
      await api.patch(`/api/usuarios/${usuario.id}/alternar-ativo`);
      toast.success(usuario.ativo ? 'Usuário desativado' : 'Usuário ativado');
      setConfirmAlternar(null);
      carregar();
    } catch {
      toast.error('Erro ao alterar status');
    }
  };

  const abrirEditar = (u: Usuario) => {
    setFormEditar({ nome: u.nome, email: u.email, senha: '', perfil: u.perfil });
    setMostrarSenhaEditar(false);
    setModalEditar(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="p-12 text-center text-gray-400">Carregando...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Nenhum usuário cadastrado.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Nome</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Perfil</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                      ${u.perfil === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-600'}`}>
                      {u.perfil === 'ADMIN' ? <ShieldCheck size={11} /> : <User size={11} />}
                      {u.perfil === 'ADMIN' ? 'Administrador' : 'Operador'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                      ${u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {u.ativo ? <UserCheck size={11} /> : <UserX size={11} />}
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirEditar(u)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      {u.id !== idLogado && (
                        <button
                          onClick={() => setConfirmAlternar(u)}
                          className={`p-1.5 rounded transition-colors ${
                            u.ativo
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={u.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {u.ativo ? <UserX size={15} /> : <UserCheck size={15} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal — Criar */}
      {modalCriar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">Novo Usuário</h2>
              <button onClick={fecharCriar}>
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleCriar} autoComplete="off" className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  required
                  autoComplete="off"
                  value={formCriar.nome}
                  onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  autoComplete="off"
                  value={formCriar.email}
                  onChange={(e) => setFormCriar({ ...formCriar, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <div className="relative">
                  <input
                    required
                    type={mostrarSenhaCriar ? 'text' : 'password'}
                    minLength={6}
                    autoComplete="new-password"
                    value={formCriar.senha}
                    onChange={(e) => setFormCriar({ ...formCriar, senha: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaCriar(!mostrarSenhaCriar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {mostrarSenhaCriar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  value={formCriar.perfil}
                  onChange={(e) => setFormCriar({ ...formCriar, perfil: e.target.value as Perfil })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPERADOR">Operador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharCriar}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2 text-sm font-medium">
                  {salvando ? 'Salvando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal — Editar */}
      {modalEditar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-semibold text-gray-800">Editar Usuário</h2>
              <button onClick={() => setModalEditar(null)}>
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleEditar} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  required
                  value={formEditar.nome}
                  onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={formEditar.email}
                  onChange={(e) => setFormEditar({ ...formEditar, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha <span className="text-gray-400 font-normal">(deixe em branco para manter)</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaEditar ? 'text' : 'password'}
                    minLength={6}
                    value={formEditar.senha}
                    onChange={(e) => setFormEditar({ ...formEditar, senha: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaEditar(!mostrarSenhaEditar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {mostrarSenhaEditar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                <select
                  value={formEditar.perfil}
                  onChange={(e) => setFormEditar({ ...formEditar, perfil: e.target.value as Perfil })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="OPERADOR">Operador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalEditar(null)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={salvando}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2 text-sm font-medium">
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal — Confirmação ativar/desativar */}
      {confirmAlternar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center
              ${confirmAlternar.ativo ? 'bg-red-100' : 'bg-green-100'}`}>
              {confirmAlternar.ativo
                ? <UserX size={24} className="text-red-600" />
                : <UserCheck size={24} className="text-green-600" />}
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              {confirmAlternar.ativo ? 'Desativar usuário?' : 'Ativar usuário?'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {confirmAlternar.ativo
                ? `${confirmAlternar.nome} perderá acesso ao sistema.`
                : `${confirmAlternar.nome} voltará a ter acesso ao sistema.`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAlternar(null)}
                className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm hover:bg-gray-50">
                Cancelar
              </button>
              <button
                onClick={() => handleAlternarAtivo(confirmAlternar)}
                className={`flex-1 text-white rounded-lg py-2 text-sm font-medium
                  ${confirmAlternar.ativo
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'}`}>
                {confirmAlternar.ativo ? 'Desativar' : 'Ativar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
