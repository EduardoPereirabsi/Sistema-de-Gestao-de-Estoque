import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Search, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { Produto, Categoria, Fornecedor } from '../types';

interface FormData {
  nome: string; sku: string; descricao: string; preco: string; precoCusto: string;
  quantidade: string; quantidadeMinima: string; categoriaId: string; fornecedorId: string;
}
const vazio: FormData = { nome: '', sku: '', descricao: '', preco: '', precoCusto: '', quantidade: '', quantidadeMinima: '', categoriaId: '', fornecedorId: '' };

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [form, setForm] = useState<FormData>(vazio);
  const [salvando, setSalvando] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);

  const carregar = (p = 0, q = '') => {
    setCarregando(true);
    const url = q.trim()
      ? `/api/products/search?nome=${encodeURIComponent(q)}&page=${p}&size=20`
      : `/api/products?page=${p}&size=20`;
    api.get(url).then(r => { setProdutos(r.data.content); setTotalPaginas(r.data.totalPages); }).finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregar(0, '');
    api.get('/api/categories').then(r => setCategorias(r.data));
    api.get('/api/suppliers').then(r => setFornecedores(r.data));
  }, []);

  const buscar = (e: React.FormEvent) => { e.preventDefault(); setPagina(0); carregar(0, busca); };

  const abrirNovo = () => { setEditando(null); setForm(vazio); setModal(true); };
  const abrirEditar = (p: Produto) => {
    setEditando(p);
    setForm({ nome: p.nome, sku: p.sku, descricao: p.descricao ?? '', preco: String(p.preco), precoCusto: String(p.precoCusto ?? ''),
      quantidade: String(p.quantidade), quantidadeMinima: String(p.quantidadeMinima), categoriaId: String(p.categoria?.id ?? ''), fornecedorId: String(p.fornecedor?.id ?? '') });
    setModal(true);
  };
  const fechar = () => { setModal(false); setEditando(null); setForm(vazio); };
  const campo = (f: keyof FormData, v: string) => setForm(prev => ({ ...prev, [f]: v }));

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    if (!form.sku.trim()) { toast.error('SKU é obrigatório'); return; }
    setSalvando(true);
    try {
      const body = { nome: form.nome, sku: form.sku, descricao: form.descricao || undefined,
        preco: parseFloat(form.preco) || 0, precoCusto: form.precoCusto ? parseFloat(form.precoCusto) : undefined,
        quantidade: parseInt(form.quantidade) || 0, quantidadeMinima: form.quantidadeMinima ? parseInt(form.quantidadeMinima) : 0,
        categoriaId: form.categoriaId ? parseInt(form.categoriaId) : undefined,
        fornecedorId: form.fornecedorId ? parseInt(form.fornecedorId) : undefined };
      if (editando) { await api.put(`/api/products/${editando.id}`, body); toast.success('Produto atualizado!'); }
      else { await api.post('/api/products', body); toast.success('Produto criado!'); }
      fechar(); carregar(pagina, busca);
    } finally { setSalvando(false); }
  };

  const excluir = async (id: number) => {
    if (!confirm('Deseja excluir este produto?')) return;
    try { await api.delete(`/api/products/${id}`); toast.success('Produto excluído!'); carregar(pagina, busca); }
    catch { toast.error('Erro ao excluir.'); }
  };

  const mudarPagina = (nova: number) => { setPagina(nova); carregar(nova, busca); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button onClick={abrirNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Novo Produto
        </button>
      </div>
      <form onSubmit={buscar} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)}
            className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar por nome..." />
        </div>
        <button type="submit" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium">Buscar</button>
      </form>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" /></div>
        ) : produtos.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhum produto encontrado.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Preço</th>
                  <th className="px-4 py-3">Qtd</th>
                  <th className="px-4 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{p.nome}</span>
                        {p.estoqueAbaixo && <span className="flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full"><AlertTriangle size={11} /> Baixo</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500">{p.categoria?.nome ?? '—'}</td>
                    <td className="px-4 py-3">R$ {Number(p.preco).toFixed(2)}</td>
                    <td className={`px-4 py-3 font-medium ${p.estoqueAbaixo ? 'text-red-600' : 'text-gray-800'}`}>{p.quantidade}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button onClick={() => abrirEditar(p)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Pencil size={15} /></button>
                      <button onClick={() => excluir(p.id)} className="text-red-500 hover:text-red-700 p-1 rounded"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPaginas > 1 && (
              <div className="flex items-center justify-center gap-3 px-4 py-3 border-t text-sm">
                <button onClick={() => mudarPagina(pagina - 1)} disabled={pagina === 0} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">← Anterior</button>
                <span className="text-gray-500">Página {pagina + 1} de {totalPaginas}</span>
                <button onClick={() => mudarPagina(pagina + 1)} disabled={pagina >= totalPaginas - 1} className="px-3 py-1 border rounded disabled:opacity-40 hover:bg-gray-50">Próxima →</button>
              </div>
            )}
          </>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editando ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={salvar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input value={form.nome} onChange={e => campo('nome', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do produto" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                  <input value={form.sku} onChange={e => campo('sku', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: PROD-001" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea value={form.descricao} onChange={e => campo('descricao', e.target.value)} rows={2}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Descrição opcional" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda *</label>
                  <input type="number" min="0" step="0.01" value={form.preco} onChange={e => campo('preco', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo</label>
                  <input type="number" min="0" step="0.01" value={form.precoCusto} onChange={e => campo('precoCusto', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0,00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                  <input type="number" min="0" value={form.quantidade} onChange={e => campo('quantidade', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qtd. Mínima</label>
                  <input type="number" min="0" value={form.quantidadeMinima} onChange={e => campo('quantidadeMinima', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select value={form.categoriaId} onChange={e => campo('categoriaId', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sem categoria</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                  <select value={form.fornecedorId} onChange={e => campo('fornecedorId', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Sem fornecedor</option>
                    {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={fechar} className="px-4 py-2 text-sm text-gray-600 border rounded-lg">Cancelar</button>
                <button type="submit" disabled={salvando} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium">
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
