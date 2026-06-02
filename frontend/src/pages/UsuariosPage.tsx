import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, X, UserCheck, UserX, ShieldCheck, User, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { Usuario as UsuarioApp } from '../types';

type Perfil = UsuarioApp['perfil'];

interface FormCriar { nome: string; email: string; senha: string; perfil: Perfil; }
interface FormEditar { nome: string; email: string; senha: string; perfil: Perfil; }

const vazioFormCriar: FormCriar = { nome: '', email: '', senha: '', perfil: 'OPERADOR' };
const vazioFormEditar: FormEditar = { nome: '', email: '', senha: '', perfil: 'OPERADOR' };

const usuarioLogado = (): number | null => {
  const raw = localStorage.getItem('usuario');
  if (!raw) return null;
  try { return JSON.parse(raw).id ?? null; } catch { return null; }
};

const perfilStyles: Record<Perfil, { className: string; Icon: typeof ShieldCheck }> = {
  ADMIN: {
    className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    Icon: ShieldCheck,
  },
  GERENTE: {
    className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    Icon: UserCheck,
  },
  OPERADOR: {
    className: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    Icon: User,
  },
};

const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

export default function UsuariosPage() {
  const { t, i18n } = useTranslation();
  const [usuarios, setUsuarios] = useState<UsuarioApp[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalCriar, setModalCriar] = useState(false);
  const [modalEditar, setModalEditar] = useState<UsuarioApp | null>(null);
  const [confirmAlternar, setConfirmAlternar] = useState<UsuarioApp | null>(null);
  const [formCriar, setFormCriar] = useState<FormCriar>(vazioFormCriar);
  const [formEditar, setFormEditar] = useState<FormEditar>(vazioFormEditar);
  const [mostrarSenhaCriar, setMostrarSenhaCriar] = useState(false);
  const [mostrarSenhaEditar, setMostrarSenhaEditar] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const idLogado = usuarioLogado();

  const perfilLabels = useMemo(() => ({
    ADMIN: t('users.admin'),
    GERENTE: t('users.manager'),
    OPERADOR: t('users.operator'),
  }), [t, i18n.resolvedLanguage, i18n.language]);

  const carregar = async () => {
    try {
      setCarregando(true);
      const { data } = await api.get<UsuarioApp[]>('/api/usuarios');
      setUsuarios(data);
    } catch {
      toast.error(t('users.loadingError'));
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
      toast.success(t('users.created'));
      fecharCriar();
      carregar();
    } catch {
      toast.error(t('users.createError'));
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
      toast.success(t('users.updated'));
      setModalEditar(null);
      carregar();
    } catch {
      toast.error(t('users.updateError'));
    } finally {
      setSalvando(false);
    }
  };

  const handleAlternarAtivo = async (usuario: UsuarioApp) => {
    try {
      await api.patch(`/api/usuarios/${usuario.id}/alternar-ativo`);
      toast.success(usuario.ativo ? t('users.deactivated') : t('users.activated'));
      setConfirmAlternar(null);
      carregar();
    } catch {
      toast.error(t('users.toggleError'));
    }
  };

  const abrirEditar = (u: UsuarioApp) => {
    setFormEditar({ nome: u.nome, email: u.email, senha: '', perfil: u.perfil });
    setMostrarSenhaEditar(false);
    setModalEditar(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('users.title')}</h1>
        <button
          onClick={abrirCriar}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> {t('users.add')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">{t('common.loading')}</div>
        ) : usuarios.length === 0 ? (
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">{t('users.empty')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">{t('users.name')}</th>
                <th className="px-6 py-3 text-left">{t('users.email')}</th>
                <th className="px-6 py-3 text-left">{t('users.role')}</th>
                <th className="px-6 py-3 text-left">{t('users.status')}</th>
                <th className="px-6 py-3 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {usuarios.map((u) => {
                const perfilInfo = perfilStyles[u.perfil];
                const PerfilIcon = perfilInfo.Icon;

                return (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-100">{u.nome}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${perfilInfo.className}`}>
                        <PerfilIcon size={11} />
                        {perfilLabels[u.perfil]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${u.ativo ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300'}`}>
                        {u.ativo ? <UserCheck size={11} /> : <UserX size={11} />}
                        {u.ativo ? t('users.active') : t('users.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => abrirEditar(u)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title={t('common.edit')}
                        >
                          <Pencil size={15} />
                        </button>
                        {u.id !== idLogado && (
                          <button
                            onClick={() => setConfirmAlternar(u)}
                            className={`p-1.5 rounded transition-colors ${u.ativo ? 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                            title={u.ativo ? t('users.deactivateAction') : t('users.activateAction')}
                          >
                            {u.ativo ? <UserX size={15} /> : <UserCheck size={15} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalCriar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t('users.add')}</h2>
              <button onClick={fecharCriar}>
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleCriar} autoComplete="off" className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.name')}</label>
                <input
                  required
                  autoComplete="off"
                  value={formCriar.nome}
                  onChange={(e) => setFormCriar({ ...formCriar, nome: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.email')}</label>
                <input
                  required
                  type="email"
                  autoComplete="off"
                  value={formCriar.email}
                  onChange={(e) => setFormCriar({ ...formCriar, email: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('auth.password')}</label>
                <div className="relative">
                  <input
                    required
                    type={mostrarSenhaCriar ? 'text' : 'password'}
                    minLength={6}
                    autoComplete="new-password"
                    value={formCriar.senha}
                    onChange={(e) => setFormCriar({ ...formCriar, senha: e.target.value })}
                    className={`${inputClassName} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaCriar(!mostrarSenhaCriar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {mostrarSenhaCriar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.role')}</label>
                <select
                  value={formCriar.perfil}
                  onChange={(e) => setFormCriar({ ...formCriar, perfil: e.target.value as Perfil })}
                  className={inputClassName}
                >
                  <option value="OPERADOR">{t('users.operator')}</option>
                  <option value="GERENTE">{t('users.manager')}</option>
                  <option value="ADMIN">{t('users.admin')}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharCriar} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={salvando} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2 text-sm font-medium">
                  {salvando ? t('common.saving') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalEditar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">{t('users.edit')}</h2>
              <button onClick={() => setModalEditar(null)}>
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            </div>
            <form onSubmit={handleEditar} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.name')}</label>
                <input
                  required
                  value={formEditar.nome}
                  onChange={(e) => setFormEditar({ ...formEditar, nome: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.email')}</label>
                <input
                  required
                  type="email"
                  value={formEditar.email}
                  onChange={(e) => setFormEditar({ ...formEditar, email: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('auth.password')} <span className="text-gray-400 dark:text-gray-500 font-normal">({t('users.newPasswordHint')})</span>
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenhaEditar ? 'text' : 'password'}
                    minLength={6}
                    value={formEditar.senha}
                    onChange={(e) => setFormEditar({ ...formEditar, senha: e.target.value })}
                    className={`${inputClassName} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenhaEditar(!mostrarSenhaEditar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {mostrarSenhaEditar ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('users.role')}</label>
                <select
                  value={formEditar.perfil}
                  onChange={(e) => setFormEditar({ ...formEditar, perfil: e.target.value as Perfil })}
                  className={inputClassName}
                >
                  <option value="OPERADOR">{t('users.operator')}</option>
                  <option value="GERENTE">{t('users.manager')}</option>
                  <option value="ADMIN">{t('users.admin')}</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalEditar(null)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={salvando} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg py-2 text-sm font-medium">
                  {salvando ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAlternar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${confirmAlternar.ativo ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              {confirmAlternar.ativo
                ? <UserX size={24} className="text-red-600 dark:text-red-300" />
                : <UserCheck size={24} className="text-green-600 dark:text-green-300" />}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              {confirmAlternar.ativo ? t('users.deactivateTitle') : t('users.activateTitle')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {confirmAlternar.ativo
                ? t('users.deactivateMessage', { name: confirmAlternar.nome })
                : t('users.activateMessage', { name: confirmAlternar.nome })}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAlternar(null)} className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleAlternarAtivo(confirmAlternar)}
                className={`flex-1 text-white rounded-lg py-2 text-sm font-medium ${confirmAlternar.ativo ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {confirmAlternar.ativo ? t('users.deactivateAction') : t('users.activateAction')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
