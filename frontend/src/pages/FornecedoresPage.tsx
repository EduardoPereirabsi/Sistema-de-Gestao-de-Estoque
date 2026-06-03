import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { Fornecedor } from '../types';

interface FormData { nome: string; cnpj: string; email: string; telefone: string; endereco: string; }
const vazio: FormData = { nome: '', cnpj: '', email: '', telefone: '', endereco: '' };

const cardClassName = 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden';
const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500';

export default function FornecedoresPage() {
  const { t } = useTranslation();
  const { isAdminOrGerente } = useAuth();
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Fornecedor | null>(null);
  const [confirmExclusao, setConfirmExclusao] = useState<Fornecedor | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [form, setForm] = useState<FormData>(vazio);
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    setCarregando(true);
    api.get('/api/suppliers').then(r => setFornecedores(r.data)).finally(() => setCarregando(false));
  };

  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setEditando(null);
    setForm(vazio);
    setModal(true);
  };
  const abrirEditar = (f: Fornecedor) => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setEditando(f);
    setForm({ nome: f.nome, cnpj: f.cnpj ?? '', email: f.email ?? '', telefone: f.telefone ?? '', endereco: f.endereco ?? '' });
    setModal(true);
  };
  const fechar = () => { setModal(false); setEditando(null); setForm(vazio); };
  const campo = (field: keyof FormData, value: string) => setForm(f => ({ ...f, [field]: value }));

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    if (!form.nome.trim()) {
      toast.error(t('suppliers.nameRequired'));
      return;
    }
    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/api/suppliers/${editando.id}`, form);
        toast.success(t('suppliers.updated'));
      } else {
        await api.post('/api/suppliers', form);
        toast.success(t('suppliers.created'));
      }
      fechar();
      carregar();
    } finally {
      setSalvando(false);
    }
  };

  const solicitarExclusao = (fornecedor: Fornecedor) => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setConfirmExclusao(fornecedor);
  };

  const excluir = async () => {
    if (!confirmExclusao) return;
    setExcluindo(true);
    try {
      await api.delete(`/api/suppliers/${confirmExclusao.id}`);
      toast.success(t('suppliers.deleted'));
      setConfirmExclusao(null);
      carregar();
    } catch {
      toast.error(t('common.error'));
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('suppliers.title')}</h1>
        {isAdminOrGerente && (
          <button onClick={abrirNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> {t('suppliers.add')}
          </button>
        )}
      </div>

      <div className={cardClassName}>
        {carregando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" /></div>
        ) : fornecedores.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('suppliers.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">{t('suppliers.name')}</th>
                <th className="px-4 py-3">{t('suppliers.cnpj')}</th>
                <th className="px-4 py-3">{t('suppliers.email')}</th>
                <th className="px-4 py-3">{t('suppliers.phone')}</th>
                {isAdminOrGerente && <th className="px-4 py-3 text-right">{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody>
              {fornecedores.map(f => (
                <tr key={f.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{f.nome}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{f.cnpj ?? t('common.none')}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{f.email ?? t('common.none')}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{f.telefone ?? t('common.none')}</td>
                  {isAdminOrGerente && (
                    <td className="px-4 py-3 text-right space-x-1">
                      <button onClick={() => abrirEditar(f)} className="text-blue-500 hover:text-blue-700 p-1 rounded" title={t('common.edit')}>
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => solicitarExclusao(f)} className="text-red-500 hover:text-red-700 p-1 rounded" title={t('common.delete')}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editando ? t('suppliers.edit') : t('suppliers.add')}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('suppliers.name')} *</label>
                  <input value={form.nome} onChange={e => campo('nome', e.target.value)} className={inputClassName} placeholder={t('suppliers.namePlaceholder')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('suppliers.cnpj')}</label>
                  <input value={form.cnpj} onChange={e => campo('cnpj', e.target.value)} className={inputClassName} placeholder={t('suppliers.cnpjPlaceholder')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('suppliers.phone')}</label>
                  <input value={form.telefone} onChange={e => campo('telefone', e.target.value)} className={inputClassName} placeholder={t('suppliers.phonePlaceholder')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('suppliers.email')}</label>
                  <input type="email" value={form.email} onChange={e => campo('email', e.target.value)} className={inputClassName} placeholder={t('suppliers.emailPlaceholder')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('suppliers.address')}</label>
                  <input value={form.endereco} onChange={e => campo('endereco', e.target.value)} className={inputClassName} placeholder={t('suppliers.addressPlaceholder')} />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={fechar} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={salvando} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">
                  {salvando ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmExclusao}
        title={t('suppliers.deleteTitle')}
        message={confirmExclusao ? t('suppliers.deleteMessage', { name: confirmExclusao.nome }) : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        loading={excluindo}
        onConfirm={excluir}
        onCancel={() => setConfirmExclusao(null)}
      />
    </div>
  );
}
