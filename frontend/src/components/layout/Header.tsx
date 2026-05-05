import { LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  const perfilLabel = usuario?.perfil === 'ADMIN'
    ? 'Administrador'
    : usuario?.perfil === 'GERENTE'
      ? 'Gerente'
      : usuario?.perfil === 'OPERADOR'
        ? 'Operador'
        : 'Perfil';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div />
      <div className="relative flex items-center gap-4">
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          <div className="bg-blue-100 text-blue-700 rounded-full p-1.5">
            <User size={16} />
          </div>
          <div className="text-left hidden sm:block">
            <p className="font-medium leading-tight">
              {usuario?.nome ?? 'Minha Conta'}
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              {perfilLabel}
              {usuario?.nomeEmpresa ? ` · ${usuario.nomeEmpresa}` : ''}
            </p>
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {menuAberto && (
          <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg w-48 z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800 truncate">{usuario?.nome ?? '—'}</p>
              <p className="text-xs text-gray-400 truncate">{usuario?.email ?? '—'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

