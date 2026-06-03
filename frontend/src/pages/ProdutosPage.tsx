import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import type { Produto, Categoria, Fornecedor } from '../types';

interface FormData {
  nome: string; sku: string; descricao: string; preco: string; precoCusto: string;
  quantidade: string; quantidadeMinima: string; categoriaId: string; fornecedorId: string;
}

const vazio: FormData = {
  nome: '',
  sku: '',
  descricao: '',
  preco: '',
  precoCusto: '',
  quantidade: '',
  quantidadeMinima: '',
  categoriaId: '',
  fornecedorId: '',
};

const cardClassName = 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden';
const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500';

export default function ProdutosPage() {
  const { t, i18n } = useTranslation();
  const { isAdminOrGerente } = useAuth();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const currency = locale.toLowerCase().startsWith('pt') ? 'BRL' : 'USD';
  const formatarMoeda = useMemo(
    () => new Intl.NumberFormat(locale, { style: 'currency', currency }),
    [currency, locale],
  );

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [confirmExclusao, setConfirmExclusao] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const [form, setForm] = useState<FormData>(vazio);
  const [salvando, setSalvando] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const carregar = (p = 0, q = '') => {
    setCarregando(true);
    const url = q.trim()
      ? `/api/products/search?nome=${encodeURIComponent(q)}&page=${p}&size=20`
      : `/api/products?page=${p}&size=20`;

    api.get(url)
      .then(r => {
        setProdutos(r.data.content);
        setTotalPaginas(r.data.totalPages);
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar(0, '');
    api.get('/api/categories').then(r => setCategorias(r.data));
    api.get('/api/suppliers').then(r => setFornecedores(r.data));
  }, []);

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(0);
    carregar(0, busca);
  };

  const abrirNovo = () => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setEditando(null);
    setForm(vazio);
    setModal(true);
  };
  const abrirEditar = (p: Produto) => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setEditando(p);
    setForm({
      nome: p.nome,
      sku: p.sku,
      descricao: p.descricao ?? '',
      preco: String(p.preco),
      precoCusto: String(p.precoCusto ?? ''),
      quantidade: String(p.quantidade),
      quantidadeMinima: String(p.quantidadeMinima),
      categoriaId: String(p.categoria?.id ?? ''),
      fornecedorId: String(p.fornecedor?.id ?? ''),
    });
    setModal(true);
  };
  const fechar = () => { setModal(false); setEditando(null); setForm(vazio); };
  const campo = (f: keyof FormData, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    if (!form.nome.trim()) {
      toast.error(t('products.nameRequired'));
      return;
    }
    if (!form.sku.trim()) {
      toast.error(t('products.skuRequired'));
      return;
    }

    setSalvando(true);
    try {
      const body = {
        nome: form.nome,
        sku: form.sku,
        descricao: form.descricao || undefined,
        preco: parseFloat(form.preco) || 0,
        precoCusto: form.precoCusto ? parseFloat(form.precoCusto) : undefined,
        quantidade: parseInt(form.quantidade, 10) || 0,
        quantidadeMinima: form.quantidadeMinima ? parseInt(form.quantidadeMinima, 10) : 0,
        categoriaId: form.categoriaId ? parseInt(form.categoriaId, 10) : undefined,
        fornecedorId: form.fornecedorId ? parseInt(form.fornecedorId, 10) : undefined,
      };

      if (editando) {
        await api.put(`/api/products/${editando.id}`, body);
        toast.success(t('products.updated'));
      } else {
        await api.post('/api/products', body);
        toast.success(t('products.created'));
      }

      fechar();
      carregar(pagina, busca);
    } finally {
      setSalvando(false);
    }
  };

  const solicitarExclusao = (produto: Produto) => {
    if (!isAdminOrGerente) {
      toast.error(t('common.permissionDenied'));
      return;
    }
    setConfirmExclusao(produto);
  };

  const excluir = async () => {
    if (!confirmExclusao) return;
    setExcluindo(true);
    try {
      await api.delete(`/api/products/${confirmExclusao.id}`);
      toast.success(t('products.deleted'));
      setConfirmExclusao(null);
      carregar(pagina, busca);
    } catch {
      toast.error(t('common.error'));
    } finally {
      setExcluindo(false);
    }
  };

  const mudarPagina = (nova: number) => {
    setPagina(nova);
    carregar(nova, busca);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('products.title')}</h1>
        {isAdminOrGerente && (
          <button onClick={abrirNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus size={16} /> {t('products.add')}
          </button>
        )}
      </div>

      <form onSubmit={buscar} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className={`${inputClassName} pl-9`}
            placeholder={t('products.search')}
          />
        </div>
        <button type="submit" className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-lg text-sm font-medium">
          {t('common.search')}
        </button>
      </form>

      <div className={cardClassName}>
        {carregando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" /></div>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('products.empty')}</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-3">{t('products.name')}</th>
                  <th className="px-4 py-3">{t('products.sku')}</th>
                  <th className="px-4 py-3">{t('products.category')}</th>
                  <th className="px-4 py-3">{t('products.price')}</th>
                  <th className="px-4 py-3">{t('products.quantity')}</th>
                  {isAdminOrGerente && <th className="px-4 py-3 text-right">{t('common.actions')}</th>}
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{p.nome}</span>
                        {p.estoqueAbaixo && (
                          <span className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs px-2 py-0.5 rounded-full">
                            <AlertTriangle size={11} /> {t('products.low')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.categoria?.nome ?? t('products.noCategory')}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{formatarMoeda.format(Number(p.preco))}</td>
                    <td className={`px-4 py-3 font-medium ${p.estoqueAbaixo ? 'text-red-600 dark:text-red-300' : 'text-gray-800 dark:text-gray-100'}`}>{p.quantidade}</td>
                    {isAdminOrGerente && (
                      <td className="px-4 py-3 text-right space-x-1">
                        <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:text-blue-700 p-1 rounded" title={t('common.edit')}>
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => solicitarExclusao(p)} className="text-red-500 hover:text-red-700 p-1 rounded" title={t('common.delete')}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-sm">
                <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina === 0} className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.previous')}
                </button>
                <span className="text-gray-500 dark:text-gray-400">{t('common.pageInfo', { current: pagina + 1, total: totalPaginas })}</span>
                <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= totalPaginas - 1} className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{editando ? t('products.edit') : t('products.add')}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20} /></button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.name')} *</label>
                  <input value={form.nome} onChange={e => campo('nome', e.target.value)} className={inputClassName} placeholder={t('products.namePlaceholder')} />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.sku')} *</label>
                  <input value={form.sku} onChange={e => campo('sku', e.target.value)} className={inputClassName} placeholder={t('products.skuPlaceholder')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.description')}</label>
                  <textarea value={form.descricao} onChange={e => campo('descricao', e.target.value)} rows={2} className={`${inputClassName} resize-none`} placeholder={t('products.optionalDescription')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.salePrice')} *</label>
                  <input type="number" min="0" step="0.01" value={form.preco} onChange={e => campo('preco', e.target.value)} className={inputClassName} placeholder={t('products.pricePlaceholder')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.costPrice')}</label>
                  <input type="number" min="0" step="0.01" value={form.precoCusto} onChange={e => campo('precoCusto', e.target.value)} className={inputClassName} placeholder={t('products.pricePlaceholder')} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.quantity')} *</label>
                  <input type="number" min="0" value={form.quantidade} onChange={e => campo('quantidade', e.target.value)} className={inputClassName} placeholder="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.minQuantity')}</label>
                  <input type="number" min="0" value={form.quantidadeMinima} onChange={e => campo('quantidadeMinima', e.target.value)} className={inputClassName} placeholder="0" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.category')}</label>
                  <select value={form.categoriaId} onChange={e => campo('categoriaId', e.target.value)} className={inputClassName}>
                    <option value="">{t('products.noCategory')}</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('products.supplier')}</label>
                  <select value={form.fornecedorId} onChange={e => campo('fornecedorId', e.target.value)} className={inputClassName}>
                    <option value="">{t('products.noSupplier')}</option>
                    {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
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
        title={t('products.deleteTitle')}
        message={confirmExclusao ? t('products.deleteMessage', { name: confirmExclusao.nome }) : ''}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        loading={excluindo}
        onConfirm={excluir}
        onCancel={() => setConfirmExclusao(null)}
      />
    </div>
  );
}
