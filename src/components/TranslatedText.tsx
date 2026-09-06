import React from 'react';
import type { TranslationData } from '../lib/types';

interface Props {
  text: string;
  translation?: TranslationData;
  showTranslation: boolean;
  className?: string;
}

// Tokenize text into words, punctuation preserving spaces
function tokenize(text: string): string[] {
  return text.split(/(\s+)/).flatMap((chunk) => {
    if (/^\s+$/.test(chunk)) return [chunk];
    // Split by punctuation keeping them
    return chunk.split(/([.,;:!?'"()[\]—–-])/).filter(Boolean);
  });
}

export function TranslatedText({ text, translation, showTranslation, className }: Props) {
  if (!showTranslation || !translation) {
    return <span className={className}>{text}</span>;
  }

  const words = translation.words ?? {};
  const tokens = tokenize(text);

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return token;
        const lower = token.toLowerCase().replace(/[^a-z]/g, '');
        const pt = words[lower] || words[token];
        if (pt) {
          return (
            <span key={i} className="tt-word">
              {token}
              <span className="tt-bubble">{pt}</span>
            </span>
          );
        }
        return <React.Fragment key={i}>{token}</React.Fragment>;
      })}
    </span>
  );
}
