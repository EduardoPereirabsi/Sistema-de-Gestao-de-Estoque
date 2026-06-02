import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowLeftRight, BarChart3, DollarSign, Package, Tags, Truck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../services/api';
import type { GraficoDiario, PainelResponse, Produto } from '../types';

export default function PainelPage() {
  const { t, i18n } = useTranslation();
  const [painel, setPainel] = useState<PainelResponse | null>(null);
  const [grafico, setGrafico] = useState<GraficoDiario[]>([]);
  const [estoqueBaixo, setEstoqueBaixo] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<PainelResponse>('/api/dashboard/painel'),
      api.get('/api/products/low-stock'),
      api.get<GraficoDiario[]>('/api/dashboard/grafico-diario?dias=7'),
    ]).then(([resumo, baixo, graficoDiario]) => {
      setPainel(resumo.data);
      setEstoqueBaixo(baixo.data);
      setGrafico(graficoDiario.data);
    }).finally(() => setCarregando(false));
  }, []);

  const locale = i18n.resolvedLanguage ?? i18n.language;
  const moeda = locale.toLowerCase().startsWith('pt') ? 'BRL' : 'USD';

  const formatarNumero = (valor: number) => new Intl.NumberFormat(locale).format(valor);
  const formatarMoeda = (valor: number) => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: moeda,
  }).format(valor);

  const cards = [
    {
      label: t('dashboard.totalProducts'),
      value: formatarNumero(Number(painel?.totalProdutos ?? 0)),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      label: t('dashboard.totalCategories'),
      value: formatarNumero(Number(painel?.totalCategorias ?? 0)),
      icon: Tags,
      color: 'bg-green-500',
    },
    {
      label: t('dashboard.totalSuppliers'),
      value: formatarNumero(Number(painel?.totalFornecedores ?? 0)),
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      label: t('dashboard.stockValue'),
      value: formatarMoeda(Number(painel?.valorTotalEstoque ?? 0)),
      icon: DollarSign,
      color: 'bg-emerald-500',
    },
    {
      label: t('dashboard.lowStock'),
      value: formatarNumero(Number(painel?.produtosAbaixoMinimo ?? 0)),
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
    {
      label: t('dashboard.monthMovements'),
      value: formatarNumero(Number(painel?.movimentacoesMes ?? 0)),
      icon: ArrowLeftRight,
      color: 'bg-indigo-500',
    },
  ];

  if (carregando) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-5 flex items-center gap-4">
            <div className={`${color} text-white p-3 rounded-lg`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-500" />
          {t('dashboard.chartTitle')}
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="entradas" name={t('dashboard.chartEntries')} fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" name={t('dashboard.chartExits')} fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ajustes" name={t('dashboard.chartAdjustments')} fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {estoqueBaixo.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            {t('dashboard.lowStock')}
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2">{t('products.name')}</th>
                <th className="pb-2">{t('products.sku')}</th>
                <th className="pb-2">{t('products.quantity')}</th>
                <th className="pb-2">{t('products.minQuantity')}</th>
              </tr>
            </thead>
            <tbody>
              {estoqueBaixo.map(p => (
                <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/40">
                  <td className="py-2 font-medium text-gray-800 dark:text-gray-100">{p.nome}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400">{p.sku}</td>
                  <td className="py-2 text-red-600 font-semibold">{p.quantidade}</td>
                  <td className="py-2 text-gray-500 dark:text-gray-400">{p.quantidadeMinima}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
