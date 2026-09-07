import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { useAppStore } from '../store/appStore';
import { LearningWorkspace, useLearningWorkspace } from './learning/Workspace';
import { EnglishVariantSwitch } from './learning/EnglishVariantSwitch';
import '../styles/learning.css';

const nav = [['/', 'Meu plano'], ['/guia-estudo', 'Guia'], ['/cursos', 'Cursos grátis'], ['/praticar', 'Praticar'], ['/conversacao', 'Conversação'], ['/sat', 'SAT'], ['/act', 'ACT'], ['/toefl', 'TOEFL']];
function LearningContent({ showVariant }: { showVariant: boolean }) {
  const { state } = useLearningWorkspace();
  return <>
    {showVariant && <EnglishVariantSwitch />}
    <Fragment key={state.settings.variant}><Outlet /></Fragment>
  </>;
}
export function Layout() {
  const { user, theme, toggleTheme, logout } = useAppStore();
  const { pathname } = useLocation();
  return <div className="learn-shell">
    <a className="learn-skip" href="#study-content">Pular para o conteúdo</a>
    <header className="learn-header">
      <div className="learn-top"><NavLink to="/" className="learn-brand" aria-label="SAT & English Learning, início"><img className="learn-logo" src="/english.svg" alt="" /><span>SAT &amp; <b>English Learning</b><small>SEU ESPAÇO DE APRENDIZADO</small></span></NavLink>
        <div className="learn-account"><span>{user?.name}</span><button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>{theme === 'dark' ? '☀' : '☾'}</button><button onClick={logout}>Sair</button></div>
      </div>
      <nav className="learn-tabs" aria-label="Áreas de estudo">{nav.map(([to, label]) => {
        const selected = to === '/sat' ? ['/sat', '/simulados', '/historico', '/guia'].some(p => pathname === p || pathname.startsWith(`${p}/`)) : to === '/praticar' ? pathname === '/praticar' || pathname === '/ingles' : pathname === to;
        return <NavLink to={to} key={to} className={selected ? 'selected' : ''} aria-current={selected ? 'page' : undefined}>{label}</NavLink>;
      })}</nav>
    </header>
    <main id="study-content" className="learn-main"><LearningWorkspace>
      <LearningContent showVariant={!['/sat', '/act', '/toefl', '/simulados', '/historico', '/guia'].some(path => pathname === path || pathname.startsWith(`${path}/`))} />
    </LearningWorkspace></main>
    <footer className="learn-footer">Um pouco de inglês, com atenção, de cada vez.<span>SAT &amp; English Learning · estudo independente</span></footer>
  </div>;
}
