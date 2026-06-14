import { useState } from 'react';
import { useAppStore } from '../store/appStore';

export function LoginPage() {
  const [name, setName] = useState('Kauã Diniz');
  const { login } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) login(trimmed);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'var(--accent)', boxShadow: '0 0 40px color-mix(in srgb, var(--accent) 40%, transparent)' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            SAT Simulator
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Digital SAT practice — faithful to the real exam
          </p>
        </div>

        {/* Login card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-7 shadow-xl"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl mb-5 outline-none text-base transition-colors"
            style={{
              background: 'var(--bg-secondary)',
              border: '1.5px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            autoFocus
            onFocus={(e) => e.target.select()}
          />

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl font-semibold text-base transition-all disabled:opacity-40"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Enter →
          </button>

          <p className="text-center text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
            No password required. Your history is stored per name.
          </p>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
          All data stored locally in your browser.
        </p>
      </div>
    </div>
  );
}
