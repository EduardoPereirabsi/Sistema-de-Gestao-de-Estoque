import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import type { Produto } from '../types';

export default function EstoquePage() {
  const { t } = useTranslation();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get('/api/products/low-stock').then(r => setProdutos(r.data)).finally(() => setCarregando(false));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('stock.title')}</h1>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        {carregando ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : produtos.length === 0 ? (
          <p className="text-center text-green-600 dark:text-green-300 py-12 font-medium">{t('stock.allGood')}</p>
        ) : (
          <>
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30 flex items-center gap-2 text-red-700 dark:text-red-300 text-sm font-medium">
              <AlertTriangle size={16} />
              {t('stock.lowCount', { count: produtos.length })}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 text-left">
                <tr>
                  <th className="px-4 py-3">{t('products.title')}</th>
                  <th className="px-4 py-3">{t('products.sku')}</th>
                  <th className="px-4 py-3">{t('products.category')}</th>
                  <th className="px-4 py-3">{t('stock.currentQuantity')}</th>
                  <th className="px-4 py-3">{t('products.minQuantity')}</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(p => (
                  <tr key={p.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/10">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{p.nome}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.categoria?.nome ?? t('common.none')}</td>
                    <td className="px-4 py-3 text-red-600 dark:text-red-300 font-bold">{p.quantidade}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.quantidadeMinima}</td>
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
