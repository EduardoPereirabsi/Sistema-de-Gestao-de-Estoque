import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, Truck,
  ArrowLeftRight, Users, BarChart2, Building2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
  
export default function Sidebar() {
  const { t } = useTranslation();
  const { usuario } = useAuth();

  const adminLinks = [
    { to: '/painel', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/produtos', label: t('nav.products'), icon: Package },
    { to: '/categorias', label: t('nav.categories'), icon: Tags },
    { to: '/fornecedores', label: t('nav.suppliers'), icon: Truck },
    { to: '/estoque', label: t('nav.stock'), icon: BarChart2 },
    { to: '/movimentacoes', label: t('nav.movements'), icon: ArrowLeftRight },
    { to: '/usuarios', label: t('nav.users'), icon: Users },
  ];
  const gerenteLinks = adminLinks.filter((link) => link.to !== '/usuarios');
  const operadorLinks = [
    { to: '/estoque', label: t('nav.stock'), icon: BarChart2 },
    { to: '/movimentacoes', label: t('nav.movements'), icon: ArrowLeftRight },
  ];

  const links = usuario?.perfil === 'ADMIN'
    ? adminLinks
    : usuario?.perfil === 'GERENTE'
      ? gerenteLinks
      : operadorLinks;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SmartStock</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('app.title')}</p>
        {usuario?.nomeEmpresa && (
          <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <Building2 size={12} />
            <span className="truncate">{usuario.nomeEmpresa}</span>
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 font-medium'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
