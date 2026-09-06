import { useState } from 'react';
import { MathText } from '../components/MathText';

// ─── Data ─────────────────────────────────────────────────────────────────────

type DomainGuide = {
  id: string;
  section: 'math' | 'rw';
  label: string;
  satWeight: string; // approx % of SAT
  color: string;
  icon: string;
  description: string;
  skills: { name: string; detail: string }[];
  formulas?: { label: string; value: string }[];
  tips: string[];
  commonMistakes: string[];
};

const GUIDES: DomainGuide[] = [
  // ── MATH ────────────────────────────────────────────────────────────────────
  {
    id: 'algebra',
    section: 'math',
    label: 'Algebra',
    satWeight: '~35% do Math',
    color: '#6366f1',
    icon: '📐',
    description: 'O domínio mais testado em Math. Envolve equações lineares, sistemas e funções — base de tudo no SAT Math.',
    skills: [
      { name: 'Equações lineares em 1 variável', detail: 'Resolver ax + b = c, equações com frações, distribuição, e problemas de palavras que geram equações.' },
      { name: 'Equações lineares em 2 variáveis', detail: 'Interpretar y = mx + b; taxa de variação (slope); y-intercept como valor inicial.' },
      { name: 'Sistemas de equações lineares', detail: 'Substituição e eliminação. Saber quando um sistema tem 0, 1 ou infinitas soluções.' },
      { name: 'Inequações lineares', detail: 'Resolver e interpretar inequações em 1 e 2 variáveis. Entender quando inverter o sinal.' },
      { name: 'Funções lineares e modelos', detail: 'Criar funções a partir de contextos reais; interpretar a taxa de variação e o valor inicial.' },
    ],
    formulas: [
      { label: 'Slope', value: '\\(m = \\frac{y_2 - y_1}{x_2 - x_1}\\)' },
      { label: 'Slope-intercept', value: '\\(y = mx + b\\)' },
      { label: 'Point-slope', value: '\\(y - y_1 = m(x - x_1)\\)' },
      { label: 'Standard form', value: '\\(Ax + By = C\\)' },
    ],
    tips: [
      'Leia o problema cuidadosamente para identificar a variável desconhecida.',
      'Em problemas de palavras, defina as variáveis antes de montar a equação.',
      'Para sistemas: se os coeficientes de x forem iguais e constantes diferentes → sem solução. Se tudo for proporcional → infinitas soluções.',
      'Sempre verifique sua resposta substituindo de volta na equação original.',
    ],
    commonMistakes: [
      'Esquecer de inverter o sinal da inequação ao dividir por número negativo.',
      'Confundir slope (inclinação) com y-intercept.',
      'Errar a distribuição ao expandir parênteses.',
    ],
  },
  {
    id: 'advanced_math',
    section: 'math',
    label: 'Advanced Math',
    satWeight: '~35% do Math',
    color: '#8b5cf6',
    icon: '🔢',
    description: 'Funções quadráticas, exponenciais e polinomiais. Exige domínio de álgebra para resolver equações não-lineares.',
    skills: [
      { name: 'Funções quadráticas', detail: 'Vertex form, factored form, standard form. Discriminante para número de raízes. Problemas com vértice, zeros e forma.' },
      { name: 'Funções exponenciais', detail: 'Crescimento e decaimento exponencial. Interpretar base, expoente e coeficiente inicial em contextos reais.' },
      { name: 'Polinômios e fatoração', detail: 'Fatorar expressões, usar o teorema dos zeros, divisão de polinômios (regra de Ruffini).' },
      { name: 'Equações racionais e radicais', detail: 'Resolver equações com frações algébricas e raízes. Verificar soluções extrâneas.' },
      { name: 'Composição de funções', detail: 'Calcular f(g(x)). Interpretar funções compostas em contextos aplicados.' },
    ],
    formulas: [
      { label: 'Fórmula quadrática', value: '\\(x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\\)' },
      { label: 'Discriminante', value: '\\(\\Delta = b^2 - 4ac\\)' },
      { label: 'Vertex form', value: '\\(f(x) = a(x-h)^2 + k\\)' },
      { label: 'Exponential', value: '\\(f(x) = a \\cdot b^x\\)' },
    ],
    tips: [
      'Se o discriminante = 0: uma raiz real. > 0: duas raízes reais. < 0: sem raízes reais.',
      'Vertex em standard form: h = −b/(2a), k = f(h).',
      'Para fatorar ax² + bx + c, procure dois números que multiplicam ac e somam b.',
      'Exponencial: base > 1 = crescimento. 0 < base < 1 = decaimento.',
    ],
    commonMistakes: [
      'Esquecer o ± na fórmula quadrática.',
      'Confundir vértice com raiz.',
      'Não verificar soluções extrâneas em equações racionais/radicais.',
    ],
  },
  {
    id: 'problem_solving_data_analysis',
    section: 'math',
    label: 'Problem Solving & Data Analysis',
    satWeight: '~15% do Math',
    color: '#22d3ee',
    icon: '📊',
    description: 'Raciocínio quantitativo com dados reais — tabelas, gráficos, probabilidade e estatísticas. Requer interpretação mais que cálculo.',
    skills: [
      { name: 'Razões, taxas e proporções', detail: 'Problemas com proporções, taxas unitárias, escalas e unidades de medida.' },
      { name: 'Porcentagem e variação percentual', detail: 'Calcular % de desconto, aumento, variação. Juros simples e compostos.' },
      { name: 'Interpretação de dados', detail: 'Ler tabelas de duas entradas, scatterplots, histogramas. Identificar tendências e outliers.' },
      { name: 'Estatística (média, mediana, moda)', detail: 'Calcular e interpretar medidas de tendência central e variabilidade. Impacto de outliers.' },
      { name: 'Probabilidade', detail: 'Probabilidade simples e condicional. Probabilidade com tabelas de duas entradas.' },
    ],
    tips: [
      'Em problemas de porcentagem, converter % para decimal antes de calcular.',
      'Média = soma / quantidade. Mediana = valor central (ou média dos dois centrais).',
      'Probabilidade condicional P(A|B) = P(A e B) / P(B).',
      'Scatterplots: identifique correlação (positiva/negativa) e interprete o slope da linha de regressão.',
    ],
    commonMistakes: [
      'Confundir média com mediana.',
      'Calcular % de aumento com o valor errado no denominador (use o valor original).',
      'Não usar inclusão-exclusão em contagens com sobreposição.',
    ],
  },
  {
    id: 'geometry_trigonometry',
    section: 'math',
    label: 'Geometry & Trigonometry',
    satWeight: '~15% do Math',
    color: '#10f0a0',
    icon: '📏',
    description: 'Geometria plana, trigonometria básica e geometria analítica. O SAT fornece folha de fórmulas — saiba usá-la.',
    skills: [
      { name: 'Área e perímetro', detail: 'Fórmulas para triângulo, retângulo, círculo, trapézio. Área de figuras compostas.' },
      { name: 'Triângulo e Pitágoras', detail: 'Teorema de Pitágoras, triângulos especiais (30-60-90, 45-45-90), triângulos semelhantes.' },
      { name: 'Círculo e arcos', detail: 'Área, circunferência, comprimento de arco, área de setor. Ângulos inscritos.' },
      { name: 'Trigonometria', detail: 'sin, cos, tan de ângulos agudos em triângulos retângulos. Identidade sin²+cos²=1. Valores especiais.' },
      { name: 'Geometria analítica', detail: 'Distância e ponto médio entre pontos. Equação de círculo no plano cartesiano.' },
    ],
    formulas: [
      { label: 'Pitágoras', value: '\\(a^2 + b^2 = c^2\\)' },
      { label: 'Área triângulo', value: '\\(A = \\frac{1}{2}bh\\)' },
      { label: 'Área círculo', value: '\\(A = \\pi r^2\\)' },
      { label: 'Circunferência', value: '\\(C = 2\\pi r\\)' },
      { label: 'SOHCAHTOA', value: '\\(\\sin\\theta = \\frac{\\text{op}}{\\text{hip}},\\ \\cos\\theta = \\frac{\\text{adj}}{\\text{hip}},\\ \\tan\\theta = \\frac{\\text{op}}{\\text{adj}}\\)' },
      { label: 'Volume cilindro', value: '\\(V = \\pi r^2 h\\)' },
      { label: 'Volume cone', value: '\\(V = \\frac{1}{3}\\pi r^2 h\\)' },
      { label: 'Volume esfera', value: '\\(V = \\frac{4}{3}\\pi r^3\\)' },
    ],
    tips: [
      'O SAT fornece uma folha de fórmulas — use o botão "Fórmulas" durante o exame.',
      'Triângulo 3-4-5 é o mais comum. Lembre-se de 5-12-13 e 8-15-17 também.',
      'SOHCAHTOA: Seno=Oposto/Hipotenusa, Cosseno=Adjacente/Hipotenusa, Tangente=Oposto/Adjacente.',
      '30-60-90: lados na razão 1 : √3 : 2. / 45-45-90: lados na razão 1 : 1 : √2.',
    ],
    commonMistakes: [
      'Usar diâmetro no lugar de raio (ou vice-versa) nas fórmulas do círculo.',
      'Confundir cateto e hipotenusa no Pitágoras.',
      'Esquecer de quadrar o rádio nas fórmulas de área/volume.',
    ],
  },

  // ── READING & WRITING ────────────────────────────────────────────────────────
  {
    id: 'craft_and_structure',
    section: 'rw',
    label: 'Craft and Structure',
    satWeight: '~28% do R&W',
    color: '#f9d423',
    icon: '✍️',
    description: 'Vocabulário em contexto, estrutura e propósito textual, e conexões entre textos. Foca em COMO o texto foi escrito.',
    skills: [
      { name: 'Words in Context (Vocabulário)', detail: 'Escolher a palavra mais precisa e lógica para completar um blank num texto. Foca em nuance e connotação.' },
      { name: 'Text Structure and Purpose', detail: 'Identificar o propósito do texto, função de um trecho, ou como o texto está organizado.' },
      { name: 'Cross-Text Connections', detail: 'Comparar dois textos curtos — identificar acordo, desacordo, ou como um texto responde ao outro.' },
    ],
    tips: [
      'Em Words in Context: leia o parágrafo completo antes de escolher a palavra. Procure pistas contextuais.',
      'Elimine opções óbvias que contradizem o tom do texto.',
      'Para Cross-Text: leia Texto 1 e identifique a afirmação principal antes de ler o Texto 2.',
      'Cuidado com palavras que parecem corretas mas têm conotação errada para o contexto.',
    ],
    commonMistakes: [
      'Escolher a palavra mais óbvia sem checar o contexto completo.',
      'Não prestar atenção no tom (positivo/negativo/neutro) da passagem.',
      'Em Cross-Text, assumir que os textos sempre se contradizem.',
    ],
  },
  {
    id: 'information_and_ideas',
    section: 'rw',
    label: 'Information and Ideas',
    satWeight: '~26% do R&W',
    color: '#ff4d6d',
    icon: '💡',
    description: 'Compreensão de leitura: ideia central, inferências e evidências. O SAT testa se você entende o texto, não apenas o lê.',
    skills: [
      { name: 'Central Ideas and Details', detail: 'Identificar a ideia principal de um parágrafo ou texto. Diferenciar ideia principal de detalhe de suporte.' },
      { name: 'Command of Evidence (Textual)', detail: 'Escolher a citação do texto que melhor suporta uma afirmação dada. Ou identificar que afirmação uma citação suporta.' },
      { name: 'Command of Evidence (Quantitative)', detail: 'Interpretar dados (tabela, gráfico) para completar ou avaliar uma afirmação no texto.' },
      { name: 'Inferences', detail: 'Fazer inferências baseadas no texto — o que o autor implica mas não afirma explicitamente.' },
    ],
    tips: [
      'Leia a pergunta antes de ler a passagem para saber o que procurar.',
      'Em Command of Evidence: a evidência deve DIRETAMENTE suportar a afirmação, não apenas ser sobre o mesmo tema.',
      'A resposta correta deve ser suportada pelo texto — não pelo seu conhecimento externo.',
      'Inferências são afirmações razoáveis baseadas no texto, não conclusões extremas.',
    ],
    commonMistakes: [
      'Escolher respostas que são verdadeiras no mundo real mas não suportadas pelo texto específico.',
      'Em questões de evidência, selecionar trechos que são relacionados mas não provam a afirmação.',
      'Confundir o ponto de vista do autor com o de um personagem citado.',
    ],
  },
  {
    id: 'standard_english_conventions',
    section: 'rw',
    label: 'Standard English Conventions',
    satWeight: '~26% do R&W',
    color: '#10f0a0',
    icon: '📝',
    description: 'Gramática e mecânica do inglês escrito. Pontuação, concordância, pronomes e estrutura de frases.',
    skills: [
      { name: 'Boundaries (Pontuação de sentenças)', detail: 'Usar ponto, vírgula, ponto-e-vírgula e dois pontos corretamente. Evitar run-on sentences e fragments.' },
      { name: 'Subject-Verb Agreement', detail: 'O verbo deve concordar com o sujeito em número (singular/plural), mesmo quando há frases intercaladas.' },
      { name: 'Pronoun Agreement', detail: 'O pronome deve concordar em número e gênero com o antecedente. Cuidado com pronomes indefinidos.' },
      { name: 'Verb Forms (Tense and Aspect)', detail: 'Usar o tempo verbal correto para manter consistência. Formas regulares e irregulares.' },
      { name: 'Modifier Placement', detail: 'Modificadores devem estar próximos ao que modificam. Evitar dangling e misplaced modifiers.' },
    ],
    tips: [
      'Um ponto-e-vírgula (;) liga duas orações independentes — pode ser substituído por um ponto final.',
      'Dois pontos (:) introduzem uma lista, explicação ou citação.',
      'Para verificar concordância sujeito-verbo: ignore as frases intercaladas entre sujeito e verbo.',
      'Pronome "they" pode ser usado como singular neutro em inglês moderno.',
    ],
    commonMistakes: [
      'Usar vírgula onde um ponto ou ponto-e-vírgula seria necessário (comma splice).',
      'Confundir its (possessivo) com it\'s (contração de "it is").',
      'Errar a concordância quando o sujeito está separado do verbo por uma frase longa.',
    ],
  },
  {
    id: 'expression_of_ideas',
    section: 'rw',
    label: 'Expression of Ideas',
    satWeight: '~20% do R&W',
    color: '#a78bfa',
    icon: '🔗',
    description: 'Organização, transições e síntese de informações. Foca em tornar o texto mais claro, coerente e eficaz.',
    skills: [
      { name: 'Transitions', detail: 'Escolher a palavra de transição correta (however, therefore, for example, etc.) que melhor conecta duas ideias.' },
      { name: 'Rhetorical Synthesis', detail: 'Combinar informações de notas ou fontes para criar uma afirmação que atenda a um objetivo específico.' },
      { name: 'Adding/Deleting Information', detail: 'Decidir se uma frase deve ser adicionada ou removida com base no foco ou propósito do parágrafo.' },
      { name: 'Ordering Sentences', detail: 'Reorganizar frases para maximizar clareza e fluxo lógico de um parágrafo.' },
    ],
    tips: [
      'Para Transitions: identifique a relação entre as ideias (contraste, causa-efeito, exemplo, adição) e escolha a transição certa.',
      'Em Rhetorical Synthesis: leia o objetivo na pergunta e escolha a resposta que atende EXATAMENTE àquele objetivo.',
      'Para adicionar/remover: uma frase deve ser mantida se for relevante ao foco; removida se for tangencial ou repetitiva.',
      'Palavras de contraste: however, although, despite, yet, on the other hand.',
    ],
    commonMistakes: [
      'Escolher transições que "soam bem" mas expressam a relação lógica errada.',
      'Em Rhetorical Synthesis, incluir informação extra que não foi pedida na instrução.',
      'Manter frases apenas porque são interessantes, mesmo quando fogem do foco.',
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

function DomainCard({
  guide,
  onExpand,
  expanded,
}: {
  guide: DomainGuide;
  onExpand: () => void;
  expanded: boolean;
}) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${expanded ? guide.color + '55' : 'var(--border-glow)'}`,
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
        boxShadow: expanded ? `0 0 24px ${guide.color}22` : 'none',
      }}
    >
      {/* Header */}
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 p-4 text-left"
        style={{ background: expanded ? `${guide.color}0a` : 'transparent' }}
      >
        <span className="text-2xl shrink-0">{guide.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-primary)' }}>
              {guide.label}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${guide.color}18`, color: guide.color, border: `1px solid ${guide.color}44` }}
            >
              {guide.satWeight}
            </span>
          </div>
          <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {guide.description}
          </p>
        </div>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          style={{ color: guide.color, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-5" style={{ borderTop: `1px solid ${guide.color}22` }}>
          {/* Skills */}
          <div className="mt-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: guide.color }}>
              Habilidades Testadas
            </h3>
            <div className="space-y-2.5">
              {guide.skills.map((skill) => (
                <div key={skill.name} className="flex gap-2.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: guide.color }}
                  />
                  <div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {skill.name}
                    </span>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {skill.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas */}
          {guide.formulas && guide.formulas.length > 0 && (
            <div
              className="rounded-xl p-3 mb-4"
              style={{ background: `${guide.color}08`, border: `1px solid ${guide.color}22` }}
            >
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>
                Fórmulas-chave
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {guide.formulas.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="text-xs font-semibold shrink-0" style={{ color: 'var(--text-secondary)', minWidth: 80 }}>
                      {f.label}:
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      <MathText text={f.value} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: guide.color }}>
              Dicas de Estudo
            </h3>
            <div className="space-y-1.5">
              {guide.tips.map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 text-sm" style={{ color: guide.color }}>✓</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#ff4d6d' }}>
              Erros Comuns
            </h3>
            <div className="space-y-1.5">
              {guide.commonMistakes.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 text-sm">⚠</span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function GuiaPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'math' | 'rw'>('math');

  const visible = GUIDES.filter((g) => g.section === activeSection);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-black tracking-tight mb-1"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 60%, var(--cyan) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Guia de Estudos
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Tópicos, habilidades e dicas para cada área do SAT.
        </p>
      </div>

      {/* SAT Score Structure */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        <h2 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
          Estrutura do SAT Digital
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Reading & Writing', modules: '2 módulos × 27 questões', time: '32 min cada', score: '200–800', color: 'var(--cyan)' },
            { label: 'Math', modules: '2 módulos × 22 questões', time: '35 min cada', score: '200–800', color: 'var(--warning)' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-3" style={{ background: 'var(--bg-secondary)', border: `1px solid ${s.color}33` }}>
              <div className="text-xs font-bold mb-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.modules}</div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.time}</div>
              <div className="text-xs font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>Pontuação: {s.score}</div>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)' }}>
          Total: 200–1600 pontos. O módulo 2 é adaptativo — se você for bem no módulo 1, recebe questões mais difíceis (e maior potencial de pontuação).
        </p>
      </div>

      {/* Section Toggle */}
      <div
        className="flex rounded-xl p-1 mb-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)' }}
      >
        {(['math', 'rw'] as const).map((sec) => (
          <button
            key={sec}
            onClick={() => { setActiveSection(sec); setExpandedId(null); }}
            className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: activeSection === sec
                ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)'
                : 'transparent',
              color: activeSection === sec ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeSection === sec ? '0 2px 12px var(--accent-glow)' : 'none',
            }}
          >
            {sec === 'math' ? '📐 Math' : '📖 Reading & Writing'}
          </button>
        ))}
      </div>

      {/* Domain guides */}
      <div className="space-y-3">
        {visible.map((guide) => (
          <DomainCard
            key={guide.id}
            guide={guide}
            expanded={expandedId === guide.id}
            onExpand={() => setExpandedId(expandedId === guide.id ? null : guide.id)}
          />
        ))}
      </div>

      {/* Bottom tip */}
      <div
        className="rounded-2xl p-4 mt-6"
        style={{
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)' }}>💡 Estratégia geral</p>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          O SAT digital é adaptativo: module 1 define a dificuldade do module 2. Foque primeiro em dominar os tópicos de peso alto (Algebra e Advanced Math somam ~70% do Math; Craft & Structure e Information & Ideas somam ~54% do R&W). Use o botão "Não sei" para identificar seus pontos fracos e priorize essas áreas.
        </p>
      </div>
    </div>
  );
}
