import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
        <Route path="usuarios" element={<UsuariosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
