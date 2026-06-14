interface QuestionStatus {
  answered: boolean;
  marked: boolean;
  current: boolean;
}

interface Props {
  statuses: QuestionStatus[];
  onNavigate: (index: number) => void;
  onClose: () => void;
}

export function QuestionNavigator({ statuses, onNavigate, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div
        className="rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
            Question Navigator
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:opacity-70" style={{ color: 'var(--text-secondary)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: 'var(--accent)' }} /> Answered
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: 'var(--warning)' }} /> Flagged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full border inline-block" style={{ borderColor: 'var(--border)' }} /> Unanswered
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {statuses.map((status, i) => {
            let bg = 'var(--bg-secondary)';
            let border = 'var(--border)';
            let color = 'var(--text-secondary)';
            if (status.current) { bg = 'var(--accent)'; color = '#fff'; border = 'var(--accent)'; }
            else if (status.marked) { bg = 'var(--warning)'; color = '#000'; border = 'var(--warning)'; }
            else if (status.answered) { bg = 'color-mix(in srgb, var(--accent) 30%, transparent)'; border = 'var(--accent)'; color = 'var(--accent)'; }

            return (
              <button
                key={i}
                onClick={() => { onNavigate(i); onClose(); }}
                className="w-9 h-9 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                style={{ background: bg, border: `1px solid ${border}`, color }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
            <span>{statuses.filter((s) => s.answered).length} answered</span>
            <span>{statuses.filter((s) => s.marked).length} flagged</span>
            <span>{statuses.filter((s) => !s.answered).length} unanswered</span>
          </div>
        </div>
      </div>
    </div>
  );
}
