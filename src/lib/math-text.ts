import katex from 'katex';

// \[...\], $$...$$, \(...\) e $...$, nesta ordem: os delimitadores longos
// primeiro, senão "$$x$$" seria lido como dois "$" vazios.
const MATH = /\\\[([\s\S]+?)\\\]|\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)|\$(.+?)\$/g;

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Texto com fórmulas LaTeX, pronto para virar HTML.
 *
 * Só a fórmula vira HTML, e quem gera é o KaTeX (com `trust` desligado, o
 * padrão, que recusa comandos capazes de embutir link ou estilo). Todo o
 * resto é escapado. Antes o texto entrava cru: as questões podem vir da IA,
 * e uma resposta com `<img onerror=…>` rodaria código neste site — onde mora
 * a sessão da conta.
 */
export function renderMathText(text: string): string {
  if (!text) return '';
  let html = '';
  let cursor = 0;
  for (const match of text.matchAll(MATH)) {
    const index = match.index ?? 0;
    html += escapeHtml(text.slice(cursor, index));
    const display = match[1] !== undefined || match[2] !== undefined;
    const math = match[1] ?? match[2] ?? match[3] ?? match[4] ?? '';
    try {
      html += katex.renderToString(math, { throwOnError: false, displayMode: display, trust: false });
    } catch {
      html += escapeHtml(match[0]);
    }
    cursor = index + match[0].length;
  }
  html += escapeHtml(text.slice(cursor));
  // Quebra de linha continua sendo quebra de linha.
  return html.replace(/\n/g, '<br/>');
}
