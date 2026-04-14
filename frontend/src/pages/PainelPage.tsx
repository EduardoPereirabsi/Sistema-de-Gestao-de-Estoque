import { useEffect, useState } from 'react';
import { Package, Tags, Truck, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Produto } from '../types';

export default function PainelPage() {
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [totalFornecedores, setTotalFornecedores] = useState(0);
  const [estoqueBaixo, setEstoqueBaixo] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/products?size=1'),
      api.get('/api/categories'),
      api.get('/api/suppliers'),
      api.get('/api/products/low-stock'),
    ]).then(([produtos, categorias, fornecedores, baixo]) => {
      setTotalProdutos(produtos.data.totalElements ?? 0);
      setTotalCategorias(categorias.data.length);
      setTotalFornecedores(fornecedores.data.length);
      setEstoqueBaixo(baixo.data);
    }).finally(() => setCarregando(false));
  }, []);

  const cards = [
    { label: 'Total de Produtos', value: totalProdutos, icon: Package, color: 'bg-blue-500' },
    { label: 'Categorias', value: totalCategorias, icon: Tags, color: 'bg-green-500' },
    { label: 'Fornecedores', value: totalFornecedores, icon: Truck, color: 'bg-purple-500' },
    { label: 'Estoque Baixo', value: estoqueBaixo.length, icon: AlertTriangle, color: 'bg-red-500' },
  ];

  if (carregando) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Painel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-lg`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            Produtos com Estoque Baixo
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Produto</th>
                <th className="pb-2">SKU</th>
                <th className="pb-2">Quantidade</th>
                <th className="pb-2">Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {estoqueBaixo.map(p => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-2 font-medium">{p.nome}</td>
                  <td className="py-2 text-gray-500">{p.sku}</td>
                  <td className="py-2 text-red-600 font-semibold">{p.quantidade}</td>
                  <td className="py-2 text-gray-500">{p.quantidadeMinima}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
