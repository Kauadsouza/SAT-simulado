import { useEffect, useState, useCallback, useRef } from 'react';
import { lookupWord } from '../data/dictionary';

interface ContextMenu {
  x: number;
  y: number;
  word: string;
  translation: string | null;
}

function getWordAtPoint(x: number, y: number): string {
  // Try Selection first (if user has text selected)
  const sel = window.getSelection();
  if (sel && sel.toString().trim()) {
    const text = sel.toString().trim();
    // Only use selection if it's a single word or short phrase
    if (text.split(/\s+/).length <= 4) return text;
  }

  // Fall back to caret range from point
  let range: Range | null = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if ((document as any).caretPositionFromPoint) {
    const pos = (document as any).caretPositionFromPoint(x, y);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.setEnd(pos.offsetNode, pos.offset);
    }
  }

  if (!range) return '';

  // Expand range to word boundaries (non-standard but supported in Chrome/Firefox)
  (range as any).expand('word');
  return range.toString().trim();
}

export function GlobalTranslation() {
  const [menu, setMenu] = useState<ContextMenu | null>(null);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const word = getWordAtPoint(e.clientX, e.clientY);
      if (!word) return;

      e.preventDefault();

      const translation = lookupWord(word);

      // Position: keep menu inside viewport
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = e.clientX + 8;
      let y = e.clientY + 8;
      if (x + 260 > vw) x = e.clientX - 268;
      if (y + 220 > vh) y = e.clientY - 220;

      setMenu({ x, y, word, translation });
      setCopied(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };

    const onMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [close]);

  if (!menu) return null;

  const openGoogleTranslate = () => {
    window.open(
      `https://translate.google.com/?sl=en&tl=pt&text=${encodeURIComponent(menu.word)}&op=translate`,
      '_blank'
    );
    close();
  };

  const copyWord = async () => {
    await navigator.clipboard.writeText(menu.word);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: menu.x, top: menu.y, position: 'fixed', zIndex: 99999 }}
    >
      {/* Header: word */}
      <div className="ctx-header">
        <span className="ctx-word">"{menu.word}"</span>
        <button onClick={close} className="ctx-close" title="Fechar">✕</button>
      </div>

      {/* Translation result */}
      <div className="ctx-body">
        {menu.translation ? (
          <>
            <div className="ctx-label">Português</div>
            <div className="ctx-translation">{menu.translation}</div>
          </>
        ) : (
          <div className="ctx-no-result">
            Palavra não encontrada no dicionário local.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="ctx-actions">
        <button onClick={openGoogleTranslate} className="ctx-btn ctx-btn-primary" title="Abrir no Google Translate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Google Translate
        </button>
        <button onClick={copyWord} className="ctx-btn ctx-btn-ghost" title="Copiar palavra">
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}
