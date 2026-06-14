import { useEffect, useRef } from 'react';
import { useExamStore } from '../store/examStore';

interface Props {
  onExpire?: () => void;
  running: boolean;
}

export function Timer({ onExpire, running }: Props) {
  const { timeRemainingSec, timerHidden, tickTimer, toggleTimerHidden, session } = useExamStore();
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    expiredRef.current = false;
    const id = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(id);
  }, [running, tickTimer]);

  useEffect(() => {
    if (running && timeRemainingSec <= 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpire?.();
    }
  }, [timeRemainingSec, running, onExpire]);

  const mins = Math.floor(timeRemainingSec / 60);
  const secs = timeRemainingSec % 60;
  const isLow = timeRemainingSec <= 5 * 60 && timeRemainingSec > 0;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Phase label
  const phaseLabel = session?.phase === 'break' ? 'Break' : session?.phase?.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {phaseLabel}
      </span>
      <button
        onClick={toggleTimerHidden}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-mono transition-colors"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: timerHidden ? 'var(--text-secondary)' : isLow ? 'var(--danger)' : 'var(--text-primary)',
        }}
        title={timerHidden ? 'Show timer' : 'Hide timer'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {timerHidden && timeRemainingSec > 5 * 60
          ? '-- : --'
          : formattedTime}
      </button>
    </div>
  );
}
