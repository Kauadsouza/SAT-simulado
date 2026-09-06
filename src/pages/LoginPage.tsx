import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export function LoginPage() {
  const [name, setName] = useState('');
  const { login } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) login(trimmed);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          top: '10%', left: '20%',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          bottom: '10%', right: '15%',
          filter: 'blur(40px)',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-18 h-18 rounded-2xl mb-5"
            style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              boxShadow: '0 0 50px var(--accent-glow), 0 0 100px rgba(99,102,241,0.15)',
            }}
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>

          <h1
            className="text-3xl font-black tracking-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, var(--accent-2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ARTX English
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Prática de inglês e simulados inspirados no SAT
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7"
          style={{
            background: 'linear-gradient(160deg, var(--bg-card) 0%, color-mix(in srgb, var(--bg-card) 80%, var(--bg-secondary)) 100%)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          <label
            className="block text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Seu Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            className="w-full px-4 py-3 rounded-xl mb-5 text-base"
            style={{
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border-glow)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            autoFocus
            onFocus={(e) => e.target.select()}
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-base transition-all disabled:opacity-30"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)',
              color: '#fff',
              boxShadow: name.trim() ? '0 4px 20px var(--accent-glow)' : 'none',
            }}
          >
            Entrar →
          </button>

          <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
            Escolha o perfil do histórico. A conexão com a nuvem aparece no topo.
          </p>
        </form>

        {/* Tip */}
        <div
          className="mt-5 rounded-xl p-3 flex items-start gap-2.5"
          style={{
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.18)',
          }}
        >
          <span style={{ fontSize: 15 }}>💡</span>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--accent)' }}>Dica:</strong> Clique com o botão direito em qualquer palavra
            para ver a tradução imediatamente.
          </p>
        </div>
      </div>
    </div>
  );
}
