import { ChevronDown, Globe, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuAberto, setMenuAberto] = useState(false);

  const perfilLabel = usuario?.perfil === 'ADMIN'
    ? t('users.admin')
    : usuario?.perfil === 'GERENTE'
      ? t('users.manager')
      : usuario?.perfil === 'OPERADOR'
        ? t('users.operator')
        : t('users.user');

  const idiomaAtual = i18n.resolvedLanguage ?? i18n.language;
  const emPortugues = idiomaAtual.toLowerCase().startsWith('pt');

  const alternarIdioma = () => {
    void i18n.changeLanguage(emPortugues ? 'en-US' : 'pt-BR');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-6 py-4 flex items-center justify-between">
      <button
        type="button"
        onClick={onMenuToggle}
        aria-label={t('common.openMenu')}
        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Menu size={20} />
      </button>
      <div className="hidden md:block" />
      <div className="relative flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={alternarIdioma}
          aria-label={`${t('language.ptBR')} / ${t('language.enUS')}`}
          title={`${t('language.ptBR')} / ${t('language.enUS')}`}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Globe size={16} />
          {emPortugues ? 'PT' : 'EN'}
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
          title={theme === 'light' ? t('theme.dark') : t('theme.light')}
          className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full p-1.5">
            <User size={16} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-medium leading-tight">
              {usuario?.nome ?? 'Minha Conta'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
              {perfilLabel}
              {usuario?.nomeEmpresa ? ` · ${usuario.nomeEmpresa}` : ''}
            </p>
          </div>
          <ChevronDown size={14} className="text-gray-400 dark:text-gray-500" />
        </button>

        {menuAberto && (
          <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg w-56 z-50">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{usuario?.nome ?? '—'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{usuario?.email ?? '—'}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={15} />
              {t('nav.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
