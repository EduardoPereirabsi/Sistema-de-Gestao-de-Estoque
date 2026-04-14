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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('accessToken');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, autenticado } = useAuth();
  if (!autenticado) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/painel" replace />;
  return <>{children}</>;
}

function AppRoutes() {
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
        <Route index element={<Navigate to="/painel" replace />} />
        <Route path="painel" element={<PainelPage />} />
        <Route path="produtos" element={<ProdutosPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="fornecedores" element={<FornecedoresPage />} />
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
