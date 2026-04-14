import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { Categoria } from '../types';

interface FormData { nome: string; descricao: string; }
const vazio: FormData = { nome: '', descricao: '' };

export default function CategoriasPage() {
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
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/api/categories/${editando.id}`, form);
        toast.success('Categoria atualizada!');
      } else {
        await api.post('/api/categories', form);
        toast.success('Categoria criada!');
      }
      fechar(); carregar();
    } finally { setSalvando(false); }
  };

  const excluir = async (id: number) => {
    if (!confirm('Deseja excluir esta categoria?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      toast.success('Categoria excluída!');
      carregar();
    } catch { toast.error('Erro ao excluir.'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
        <button onClick={abrirNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Nova Categoria
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" /></div>
        ) : categorias.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhuma categoria cadastrada.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{c.descricao ?? '—'}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button onClick={() => abrirEditar(c)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Pencil size={15} /></button>
                    <button onClick={() => excluir(c.id)} className="text-red-500 hover:text-red-700 p-1 rounded"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editando ? 'Editar Categoria' : 'Nova Categoria'}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome da categoria" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Descrição opcional" />
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
