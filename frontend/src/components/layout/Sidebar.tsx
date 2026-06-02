import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tags, Truck,
  ArrowLeftRight, Users, BarChart2, Building2, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function Sidebar({ open, onToggle }: SidebarProps) {
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
    <>
      {open && (
        <button
          type="button"
          aria-label={t('common.closeMenu')}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md flex flex-col transform transition-transform duration-300 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">SmartStock</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('app.title')}</p>
              {usuario?.nomeEmpresa && (
                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
                  <Building2 size={12} />
                  <span className="truncate">{usuario.nomeEmpresa}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label={t('common.closeMenu')}
              onClick={onToggle}
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onToggle}
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
    </>
  );
}
