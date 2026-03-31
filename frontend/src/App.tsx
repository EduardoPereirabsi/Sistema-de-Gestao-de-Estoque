import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary-600 mb-4">
                  SmartStock
                </h1>
                <p className="text-lg text-muted-foreground">
                  Sistema de Gestão de Estoque
                </p>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
