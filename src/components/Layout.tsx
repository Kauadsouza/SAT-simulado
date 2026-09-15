import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { useAppStore } from '../store/appStore';
import { LearningWorkspace, useLearningWorkspace } from './learning/Workspace';
import { SpanishWorkspace } from './learning/SpanishWorkspace';
import { EnglishVariantSwitch } from './learning/EnglishVariantSwitch';
import '../styles/learning.css';

type NavItem = [to: string, label: string];

const ENGLISH_NAV: { estudo: NavItem[]; provas: NavItem[] } = {
  estudo: [['/', 'Meu plano'], ['/guia-estudo', 'Guia'], ['/cursos', 'Cursos grátis'], ['/praticar', 'Praticar'], ['/conversacao', 'Conversação']],
  provas: [['/sat', 'SAT'], ['/act', 'ACT'], ['/toefl', 'TOEFL'], ['/simulados', 'Simulados']],
};
const SPANISH_NAV: { estudo: NavItem[]; provas: NavItem[] } = {
  estudo: [['/espanhol', 'Meu plano'], ['/espanhol/praticar', 'Praticar'], ['/espanhol/conversacao', 'Conversação']],
  provas: [['/espanhol/simulado', 'Simulado']],
};

const ENGLISH_EXAM_PATHS = ['/sat', '/act', '/toefl', '/simulados', '/historico', '/guia'];

function isSelected(to: string, pathname: string): boolean {
  if (to === '/sat') return pathname === '/sat' || pathname.startsWith('/sat/');
  if (to === '/simulados') return ['/simulados', '/historico', '/guia'].includes(pathname);
  if (to === '/praticar') return pathname === '/praticar' || pathname === '/ingles';
  return pathname === to;
}

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
  const spanish = pathname === '/espanhol' || pathname.startsWith('/espanhol/');
  const nav = spanish ? SPANISH_NAV : ENGLISH_NAV;
  const showVariant = !ENGLISH_EXAM_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`));

  return <div className="learn-shell">
    <a className="learn-skip" href="#study-content">Pular para o conteúdo</a>
    <header className="learn-header">
      <div className="learn-top">
        <NavLink to="/" className="learn-brand" aria-label="Idiomas, início">
          <img className="learn-logo" src="/english.svg" alt="" />
          <span><b>Idiomas</b><small>INGLÊS E ESPANHOL · SEU ESPAÇO DE APRENDIZADO</small></span>
        </NavLink>
        <div className="learn-account">
          <span>{user?.name}</span>
          <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}>{theme === 'dark' ? '☀' : '☾'}</button>
          <button onClick={logout}>Sair</button>
        </div>
      </div>

      <nav className="learn-langs" aria-label="Idioma">
        <NavLink to="/" className={spanish ? '' : 'selected'} aria-current={spanish ? undefined : 'page'}><span aria-hidden="true">EN</span> Inglês</NavLink>
        <NavLink to="/espanhol" className={spanish ? 'selected' : ''} aria-current={spanish ? 'page' : undefined}><span aria-hidden="true">ES</span> Espanhol</NavLink>
      </nav>

      <div className="learn-nav-groups">
        <nav className="learn-tabs" aria-label={`Estudo de ${spanish ? 'espanhol' : 'inglês'}`}>
          <span className="learn-nav-label">Estudo</span>
          {nav.estudo.map(([to, label]) => <NavLink key={to} to={to} end={to === '/' || to === '/espanhol'} className={isSelected(to, pathname) ? 'selected' : ''} aria-current={isSelected(to, pathname) ? 'page' : undefined}>{label}</NavLink>)}
        </nav>
        <nav className="learn-tabs" aria-label={`Provas de ${spanish ? 'espanhol' : 'inglês'}`}>
          <span className="learn-nav-label">Provas</span>
          {nav.provas.map(([to, label]) => <NavLink key={to} to={to} className={isSelected(to, pathname) ? 'selected' : ''} aria-current={isSelected(to, pathname) ? 'page' : undefined}>{label}</NavLink>)}
        </nav>
      </div>
    </header>

    <main id="study-content" className="learn-main">
      {spanish
        ? <SpanishWorkspace><Outlet /></SpanishWorkspace>
        : <LearningWorkspace><LearningContent showVariant={showVariant} /></LearningWorkspace>}
    </main>

    <footer className="learn-footer">Um pouco de idioma, com atenção, de cada vez.<span>Idiomas · estudo independente</span></footer>
  </div>;
}
