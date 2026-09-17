import { Component, type ErrorInfo, type ReactNode } from 'react';

/**
 * Numa SPA, um erro de render derruba a árvore inteira e sobra uma tela branca.
 * Aqui isso é pior do que parece: o progresso vive no IndexedDB deste
 * dispositivo, então a tela em branco parece perda de dados sem ser.
 *
 * O limite pega a falha, diz que o caderno continua salvo e oferece recarregar.
 */
type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Falha no Idiomas:', error.message, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <main className="learn-shell">
        <div className="learn-main">
          <div className="learn-page" style={{ maxWidth: 560, margin: '80px auto' }}>
            <div className="learn-card">
              <span className="learn-eyebrow">ALGO FALHOU</span>
              <h1 style={{ fontSize: 28 }}>Esta tela não carregou.</h1>
              <p>
                Seu progresso continua salvo neste dispositivo — nada foi apagado. Recarregue
                para voltar de onde parou.
              </p>
              <div className="learn-actions">
                <button className="learn-button primary" onClick={() => window.location.reload()}>
                  Recarregar
                </button>
                <button className="learn-button" onClick={() => { window.location.hash = ''; window.location.pathname = '/'; }}>
                  Voltar ao início
                </button>
              </div>
              <details style={{ marginTop: 18 }}>
                <summary>Detalhe técnico</summary>
                <p style={{ fontFamily: 'monospace', fontSize: 12 }}>{error.message}</p>
              </details>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
