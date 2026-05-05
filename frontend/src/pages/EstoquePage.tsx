import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Produto } from '../types';

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/api/products/low-stock').then(r => setProdutos(r.data)).finally(() => setCarregando(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Controle de Estoque</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : produtos.length === 0 ? (
          <p className="text-center text-green-600 py-12 font-medium">Todos os produtos estão com estoque adequado!</p>
        ) : (
          <>
            <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700 text-sm font-medium">
              <AlertTriangle size={16} />
              {produtos.length} produto(s) com estoque abaixo do mínimo
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Quantidade Atual</th>
                  <th className="px-4 py-3">Quantidade Mínima</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id} className="border-t hover:bg-red-50">
                    <td className="px-4 py-3 font-medium">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-500">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500">{p.categoria?.nome ?? '—'}</td>
                    <td className="px-4 py-3 text-red-600 font-bold">{p.quantidade}</td>
                    <td className="px-4 py-3 text-gray-500">{p.quantidadeMinima}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
