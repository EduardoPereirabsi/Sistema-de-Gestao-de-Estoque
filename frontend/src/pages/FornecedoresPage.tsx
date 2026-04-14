import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import type { Fornecedor } from '../types';

interface FormData { nome: string; cnpj: string; email: string; telefone: string; endereco: string; }
const vazio: FormData = { nome: '', cnpj: '', email: '', telefone: '', endereco: '' };

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Fornecedor | null>(null);
  const [form, setForm] = useState<FormData>(vazio);
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    setCarregando(true);
    api.get('/api/suppliers').then(r => setFornecedores(r.data)).finally(() => setCarregando(false));
  };

  useEffect(() => { carregar(); }, []);

  const abrirNovo = () => { setEditando(null); setForm(vazio); setModal(true); };
  const abrirEditar = (f: Fornecedor) => {
    setEditando(f);
    setForm({ nome: f.nome, cnpj: f.cnpj ?? '', email: f.email ?? '', telefone: f.telefone ?? '', endereco: f.endereco ?? '' });
    setModal(true);
  };
  const fechar = () => { setModal(false); setEditando(null); setForm(vazio); };
  const campo = (field: keyof FormData, value: string) => setForm(f => ({ ...f, [field]: value }));

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim()) { toast.error('Nome é obrigatório'); return; }
    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/api/suppliers/${editando.id}`, form);
        toast.success('Fornecedor atualizado!');
      } else {
        await api.post('/api/suppliers', form);
        toast.success('Fornecedor criado!');
      }
      fechar(); carregar();
    } finally { setSalvando(false); }
  };

  const excluir = async (id: number) => {
    if (!confirm('Deseja excluir este fornecedor?')) return;
    try {
      await api.delete(`/api/suppliers/${id}`);
      toast.success('Fornecedor excluído!');
      carregar();
    } catch { toast.error('Erro ao excluir.'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Fornecedores</h1>
        <button onClick={abrirNovo} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Novo Fornecedor
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" /></div>
        ) : fornecedores.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Nenhum fornecedor cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">CNPJ</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map(f => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{f.nome}</td>
                  <td className="px-4 py-3 text-gray-500">{f.cnpj ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{f.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{f.telefone ?? '—'}</td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button onClick={() => abrirEditar(f)} className="text-blue-500 hover:text-blue-700 p-1 rounded"><Pencil size={15} /></button>
                    <button onClick={() => excluir(f.id)} className="text-red-500 hover:text-red-700 p-1 rounded"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editando ? 'Editar Fornecedor' : 'Novo Fornecedor'}</h2>
              <button onClick={fechar} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={salvar} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input value={form.nome} onChange={e => campo('nome', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do fornecedor" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input value={form.cnpj} onChange={e => campo('cnpj', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="00.000.000/0000-00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input value={form.telefone} onChange={e => campo('telefone', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="(00) 00000-0000" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => campo('email', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="contato@fornecedor.com" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                  <input value={form.endereco} onChange={e => campo('endereco', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Rua, número, cidade..." />
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
