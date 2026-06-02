import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { Categoria } from '../types';

interface FormData { nome: string; descricao: string; }
const vazio: FormData = { nome: '', descricao: '' };

const cardClassName = 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden';
const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500';

export default function CategoriasPage() {
  const { t } = useTranslation();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Categoria | null>(null);
  const [form, setForm] = useState<FormData>(vazio);
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    setCarregando(true);
    api.get('/api/categories').then(r => setCategorias(r.data)).finally(() => setCarregando(false));
  };

  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => { setEditando(null); setForm(vazio); setModal(true); };
  const abrirEditar = (c: Categoria) => {
    setEditando(c);
    setForm({ nome: c.nome, descricao: c.descricao ?? '' });
    setModal(true);
  };
  const fechar = () => { setModal(false); setEditando(null); setForm(vazio); };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      toast.error(t('categories.nameRequired'));
      return;
    }
    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/api/categories/${editando.id}`, form);
        toast.success(t('categories.updated'));
      } else {
        await api.post('/api/categories', form);
        toast.success(t('categories.created'));
      }
      fechar();
      carregar();
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id: number) => {
    if (!confirm(t('categories.deleteConfirm'))) return;
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success(t('categories.deleted'));
      carregar();
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('categories.title')}</h1>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('categories.add')}
        </button>
      </div>

      <div className={cardClassName}>
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : categorias.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('categories.empty')}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-left">
              <tr>
                <th className="px-4 py-3">{t('categories.name')}</th>
                <th className="px-4 py-3">{t('categories.description')}</th>
                <th className="px-4 py-3 text-right">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{c.descricao ?? t('common.none')}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button onClick={() => abrirEditar(c)} className="text-blue-500 hover:text-blue-700 p-1 rounded" title={t('common.edit')}>
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => excluir(c.id)} className="text-red-500 hover:text-red-700 p-1 rounded" title={t('common.delete')}>
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editando ? t('categories.edit') : t('categories.add')}
              </h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('categories.name')} *</label>
                <input
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className={inputClassName}
                  placeholder={t('categories.namePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('categories.description')}</label>
                <textarea
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  rows={3}
                  className={`${inputClassName} resize-none`}
                  placeholder={t('categories.descriptionPlaceholder')}
                />
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
    </div>
  );
}
