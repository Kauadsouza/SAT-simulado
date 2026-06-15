import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SimuladosPage } from './pages/SimuladosPage';
import { HistoricoPage } from './pages/HistoricoPage';
import { ExamPage } from './pages/ExamPage';
import { EnglishPage } from './pages/EnglishPage';
import { GlobalTranslation } from './components/GlobalTranslation';

function ThemeSync() {
  const { theme } = useAppStore();
  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'light') el.classList.add('light');
    else el.classList.remove('light');
  }, [theme]);
  return null;
}

function ProtectedLayout() {
  const { user } = useAppStore();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout />;
}

export default function App() {
  const { user } = useAppStore();

  return (
    <BrowserRouter>
      <ThemeSync />
      <GlobalTranslation />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/exam"  element={user ? <ExamPage /> : <Navigate to="/login" replace />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/"          element={<DashboardPage />} />
          <Route path="/simulados" element={<SimuladosPage />} />
          <Route path="/historico" element={<HistoricoPage />} />
          <Route path="/ingles"    element={<EnglishPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
