import { StudyCloud } from './components/StudyCloud';
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/appStore';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const SimuladosPage = lazy(() => import('./pages/SimuladosPage').then(module => ({ default: module.SimuladosPage })));
const HistoricoPage = lazy(() => import('./pages/HistoricoPage').then(module => ({ default: module.HistoricoPage })));
const ExamPage = lazy(() => import('./pages/ExamPage').then(module => ({ default: module.ExamPage })));
const EnglishPage = lazy(() => import('./pages/EnglishPage').then(module => ({ default: module.EnglishPage })));
const GuiaPage = lazy(() => import('./pages/GuiaPage').then(module => ({ default: module.GuiaPage })));
import { GlobalTranslation } from './components/GlobalTranslation';
const LearningHome = lazy(() => import('./pages/LearningHome').then(m => ({ default: m.LearningHome })));
const StudyGuide = lazy(() => import('./pages/StudyGuide').then(m => ({ default: m.StudyGuide })));
const EnglishCourses = lazy(() => import('./pages/EnglishCourses').then(m => ({ default: m.EnglishCourses })));
const PracticePage = lazy(() => import('./pages/PracticePage').then(m => ({ default: m.PracticePage })));
const ConversationPage = lazy(() => import('./pages/ConversationPage').then(m => ({ default: m.ConversationPage })));
const SatTrack = lazy(() => import('./pages/ExamTracks').then(m => ({ default: m.SatTrack })));
const ActTrack = lazy(() => import('./pages/ExamTracks').then(m => ({ default: m.ActTrack })));
const ToeflTrack = lazy(() => import('./pages/ExamTracks').then(m => ({ default: m.ToeflTrack })));

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
    <StudyCloud><BrowserRouter>
      <ThemeSync />
      <GlobalTranslation />
      <Suspense fallback={<div className="study-loading">Abrindo seus estudos…</div>}><Routes>
        <Route path="/embed" element={<Navigate to="/" replace />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route path="/exam"  element={user ? <ExamPage /> : <Navigate to="/login" replace />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/"          element={<LearningHome />} />
          <Route path="/cursos" element={<EnglishCourses />} />
          <Route path="/guia-estudo" element={<StudyGuide />} />
          <Route path="/praticar" element={<PracticePage />} />
          <Route path="/conversacao" element={<ConversationPage />} />
          <Route path="/sat" element={<SatTrack />} />
          <Route path="/sat/resultados" element={<DashboardPage />} />
          <Route path="/act" element={<ActTrack />} />
          <Route path="/toefl" element={<ToeflTrack />} />
          <Route path="/simulados" element={<SimuladosPage />} />
          <Route path="/historico" element={<HistoricoPage />} />
          <Route path="/ingles"    element={<EnglishPage />} />
          <Route path="/guia"      element={<GuiaPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes></Suspense>
    </BrowserRouter></StudyCloud>
  );
}
