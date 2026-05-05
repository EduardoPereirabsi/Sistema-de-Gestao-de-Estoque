import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import Layout from './components/layout/Layout';
import PainelPage from './pages/PainelPage';
import ProdutosPage from './pages/ProdutosPage';
import CategoriasPage from './pages/CategoriasPage';
import FornecedoresPage from './pages/FornecedoresPage';
import EstoquePage from './pages/EstoquePage';
import MovimentacoesPage from './pages/MovimentacoesPage';
import UsuariosPage from './pages/UsuariosPage';

function getHomePath(perfil?: 'ADMIN' | 'GERENTE' | 'OPERADOR') {
  return perfil === 'OPERADOR' ? '/estoque' : '/painel';
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { autenticado } = useAuth();
  return autenticado ? <>{children}</> : <Navigate to="/login" replace />;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isAdminOrGerente, autenticado } = useAuth();
  if (!autenticado) return <Navigate to="/login" replace />;
  if (!isAdminOrGerente) return <Navigate to={getHomePath(usuario?.perfil)} replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { usuario, isAdmin, autenticado } = useAuth();
  if (!autenticado) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to={getHomePath(usuario?.perfil)} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to={getHomePath(usuario?.perfil)} replace />} />
        <Route path="painel" element={<ManagerRoute><PainelPage /></ManagerRoute>} />
        <Route path="produtos" element={<ManagerRoute><ProdutosPage /></ManagerRoute>} />
        <Route path="categorias" element={<ManagerRoute><CategoriasPage /></ManagerRoute>} />
        <Route path="fornecedores" element={<ManagerRoute><FornecedoresPage /></ManagerRoute>} />
        <Route path="estoque" element={<EstoquePage />} />
        <Route path="movimentacoes" element={<MovimentacoesPage />} />
        <Route path="usuarios" element={<AdminRoute><UsuariosPage /></AdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
