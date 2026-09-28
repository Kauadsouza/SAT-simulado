import { describe, expect, it } from 'vitest';
import { renderMathText } from '../src/lib/math-text';

describe('MathText', () => {
  it('escapa o HTML que vem no texto da questão', () => {
    const html = renderMathText('Veja <img src=x onerror="alert(1)"> e <script>x</script>');
    expect(html).not.toMatch(/<img|<script/);
    expect(html).toContain('&lt;img');
  });

  it('continua desenhando a fórmula', () => {
    const html = renderMathText('Se $x^2 = 4$, então x = 2');
    expect(html).toContain('katex');
    expect(html).toContain('então x = 2');
  });

  it('não deixa uma fórmula carregar HTML', () => {
    const html = renderMathText('$\\href{javascript:alert(1)}{clique}$');
    // Vira texto da fórmula, nunca um link: nenhum href sai do KaTeX com trust desligado.
    expect(html).not.toMatch(/href\s*=/i);
  });

  it('mantém as quebras de linha', () => {
    expect(renderMathText('a\nb')).toBe('a<br/>b');
  });
});
