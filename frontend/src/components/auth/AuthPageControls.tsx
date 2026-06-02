import { Globe, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthPageControls() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const idiomaAtual = i18n.resolvedLanguage ?? i18n.language;
  const emPortugues = idiomaAtual.toLowerCase().startsWith('pt');

  const alternarIdioma = () => {
    void i18n.changeLanguage(emPortugues ? 'en-US' : 'pt-BR');
  };

  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}
