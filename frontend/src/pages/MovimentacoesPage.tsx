import { useEffect, useState } from 'react';
import { ArrowLeftRight, Plus, X } from 'lucide-react';
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

export default function MovimentacoesPage() {
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [form, setForm] = useState<FormData>(vazio);

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
      toast.error('Selecione um produto');
      return;
    }

    if (!form.quantidade || Number(form.quantidade) <= 0) {
      toast.error('Informe uma quantidade válida');
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

      toast.success('Movimentação registrada!');
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Movimentações</h1>
        <button
          onClick={abrirNovo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Nova Movimentação
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : movimentacoes.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhuma movimentação registrada.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Quantidade</th>
                  <th className="px-4 py-3">Usuário</th>
                  <th className="px-4 py-3">Motivo</th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((movimentacao) => (
                  <tr key={movimentacao.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(movimentacao.criadoEm).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {movimentacao.nomeProduto}
                    </td>
                    <td className="px-4 py-3">{movimentacao.tipo}</td>
                    <td className="px-4 py-3">{movimentacao.quantidade}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {movimentacao.nomeUsuario}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {movimentacao.motivo ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t text-sm">
                <button
                  onClick={() => mudarPagina(pagina - 1)}
                  disabled={pagina === 0}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Anterior
                </button>
                <span className="text-gray-500">
                  Página {pagina + 1} de {totalPaginas}
                </span>
                <button
                  onClick={() => mudarPagina(pagina + 1)}
                  disabled={pagina >= totalPaginas - 1}
                  className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50"
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Nova Movimentação</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto *</label>
                <select
                  value={form.produtoId}
                  onChange={(e) => setForm((prev) => ({ ...prev, produtoId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione...</option>
                  {produtos.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} ({produto.sku})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value as FormData['tipo'] }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ENTRADA">ENTRADA</option>
                    <option value="SAIDA">SAIDA</option>
                    <option value="AJUSTE">AJUSTE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantidade}
                    onChange={(e) => setForm((prev) => ({ ...prev, quantidade: e.target.value }))}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
                <textarea
                  value={form.motivo}
                  onChange={(e) => setForm((prev) => ({ ...prev, motivo: e.target.value }))}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Motivo opcional"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={fechar} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}