import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { LearningWorkspace } from './learning/Workspace';
import '../styles/learning.css';

const nav = [['/', 'Meu plano'], ['/guia-estudo', 'Guia'], ['/cursos', 'Cursos grátis'], ['/praticar', 'Praticar'], ['/conversacao', 'Conversação'], ['/sat', 'SAT'], ['/act', 'ACT'], ['/toefl', 'TOEFL']];
export function Layout() {
  const { user, theme, toggleTheme, logout } = useAppStore();
  const { pathname } = useLocation();
  return <div className="learn-shell">
    <a className="learn-skip" href="#study-content">Pular para o conteúdo</a>
    <header className="learn-header">
      <div className="learn-top"><NavLink to="/" className="learn-brand" aria-label="ARTX English, início"><span className="learn-logo">a<span>e</span></span><span>ARTX <b>English</b><small>SEU ESPAÇO DE APRENDIZADO</small></span></NavLink>
        <div className="learn-account"><span>{user?.name}</span><button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>{theme === 'dark' ? '☀' : '☾'}</button><button onClick={logout}>Sair</button></div>
      </div>
      <nav className="learn-tabs" aria-label="Áreas de estudo">{nav.map(([to, label]) => {
        const selected = to === '/sat' ? ['/sat', '/simulados', '/historico', '/guia'].some(p => pathname === p || pathname.startsWith(`${p}/`)) : to === '/praticar' ? pathname === '/praticar' || pathname === '/ingles' : pathname === to;
        return <NavLink to={to} key={to} className={selected ? 'selected' : ''} aria-current={selected ? 'page' : undefined}>{label}</NavLink>;
      })}</nav>
    </header>
    <main id="study-content" className="learn-main"><LearningWorkspace><Outlet /></LearningWorkspace></main>
    <footer className="learn-footer">Um pouco de inglês, com atenção, de cada vez.<span>ARTX English · estudo independente</span></footer>
  </div>;
}
