import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  text: string;
  className?: string;
}

// Render text that may contain \(...\) or $...$ LaTeX inline math
export function MathText({ text, className }: Props) {
  const html = useMemo(() => {
    if (!text) return '';
    // Replace \(...\) and $...$ with rendered KaTeX
    return text
      .replace(/\\\((.+?)\\\)/gs, (_match, math) => {
        try {
          return katex.renderToString(math, { throwOnError: false, displayMode: false });
        } catch {
          return math;
        }
      })
      .replace(/\\\[(.+?)\\\]/gs, (_match, math) => {
        try {
          return katex.renderToString(math, { throwOnError: false, displayMode: true });
        } catch {
          return math;
        }
      })
      .replace(/\$\$(.+?)\$\$/gs, (_match, math) => {
        try {
          return katex.renderToString(math, { throwOnError: false, displayMode: true });
        } catch {
          return math;
        }
      })
      .replace(/\$(.+?)\$/g, (_match, math) => {
        try {
          return katex.renderToString(math, { throwOnError: false, displayMode: false });
        } catch {
          return math;
        }
      })
      // Preserve newlines as <br>
      .replace(/\n/g, '<br/>');
  }, [text]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
