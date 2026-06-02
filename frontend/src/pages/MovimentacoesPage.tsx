import { useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import type { Movimentacao, Produto, PageResponse } from '../types';

interface FormData {
  produtoId: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  quantidade: string;
  motivo: string;
}

const vazio: FormData = {
  produtoId: '',
  tipo: 'ENTRADA',
  quantidade: '',
  motivo: '',
};

const cardClassName = 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden';
const inputClassName = 'w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 dark:placeholder:text-gray-500';

export default function MovimentacoesPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [form, setForm] = useState<FormData>(vazio);

  const tipos = useMemo(() => ({
    ENTRADA: t('movements.entry'),
    SAIDA: t('movements.exit'),
    AJUSTE: t('movements.adjustment'),
  }), [t, i18n.resolvedLanguage, i18n.language]);

  const formatarDataHora = (valor: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(valor));

  const carregar = (p = 0) => {
    setCarregando(true);
    api.get<PageResponse<Movimentacao>>(`/api/movements?page=${p}&size=20&sort=criadoEm,desc`)
      .then((res) => {
        setMovimentacoes(res.data.content);
        setTotalPaginas(res.data.totalPages);
      })
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar(0);
  }, []);

  const abrirNovo = () => {
    api.get<PageResponse<Produto>>('/api/products?size=100')
      .then((res) => setProdutos(res.data.content));
    setForm(vazio);
    setModal(true);
  };

  const fechar = () => {
    setModal(false);
    setForm(vazio);
  };

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.produtoId) {
      toast.error(t('movements.productRequired'));
      return;
    }

    if (!form.quantidade || Number(form.quantidade) <= 0) {
      toast.error(t('movements.quantityRequired'));
      return;
    }

    setSalvando(true);
    try {
      await api.post('/api/movements', {
        produtoId: Number(form.produtoId),
        tipo: form.tipo,
        quantidade: Number(form.quantidade),
        motivo: form.motivo || undefined,
      });

      toast.success(t('movements.created'));
      fechar();
      carregar(pagina);
    } finally {
      setSalvando(false);
    }
  };

  const mudarPagina = (nova: number) => {
    setPagina(nova);
    carregar(nova);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('movements.title')}</h1>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> {t('movements.add')}
        </button>
      </div>

      <div className={cardClassName}>
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : movimentacoes.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('movements.empty')}</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-3">{t('movements.date')}</th>
                  <th className="px-4 py-3">{t('movements.product')}</th>
                  <th className="px-4 py-3">{t('movements.type')}</th>
                  <th className="px-4 py-3">{t('movements.quantity')}</th>
                  <th className="px-4 py-3">{t('movements.user')}</th>
                  <th className="px-4 py-3">{t('movements.reason')}</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((movimentacao) => (
                  <tr key={movimentacao.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {formatarDataHora(movimentacao.criadoEm)}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {movimentacao.nomeProduto}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{tipos[movimentacao.tipo]}</td>
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100">{movimentacao.quantidade}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {movimentacao.nomeUsuario}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                      {movimentacao.motivo ?? t('common.none')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-sm">
                <button
                  onClick={() => mudarPagina(pagina - 1)}
                  disabled={pagina === 0}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('common.previous')}
                </button>
                <span className="text-gray-500 dark:text-gray-400">
                  {t('common.pageInfo', { current: pagina + 1, total: totalPaginas })}
                </span>
                <button
                  onClick={() => mudarPagina(pagina + 1)}
                  disabled={pagina >= totalPaginas - 1}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('common.next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('movements.newTitle')}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('movements.product')} *</label>
                <select
                  value={form.produtoId}
                  onChange={(e) => setForm((prev) => ({ ...prev, produtoId: e.target.value }))}
                  className={inputClassName}
                >
                  <option value="">{t('movements.selectPlaceholder')}</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('movements.type')} *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as FormData['tipo'] }))}
                    className={inputClassName}
                  >
                    <option value="ENTRADA">{tipos.ENTRADA}</option>
                    <option value="SAIDA">{tipos.SAIDA}</option>
                    <option value="AJUSTE">{tipos.AJUSTE}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('movements.quantity')} *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantidade}
                    onChange={(e) => setForm((prev) => ({ ...prev, quantidade: e.target.value }))}
                    className={inputClassName}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('movements.reason')}</label>
                <textarea
                  value={form.motivo}
                  onChange={(e) => setForm((prev) => ({ ...prev, motivo: e.target.value }))}
                  rows={3}
                  className={`${inputClassName} resize-none`}
                  placeholder={t('movements.reasonPlaceholder')}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={fechar} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
                >
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
