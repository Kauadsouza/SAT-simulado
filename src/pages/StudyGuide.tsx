import { Link } from 'react-router-dom';
import { Note, PageHeading, useLearningWorkspace } from '../components/learning/Workspace';

const stages = [
  { title: 'Começar: suas primeiras frases', subtitle: 'Parte 1 · construa a base', steps: [
    ['Abra Cursos grátis e comece na Lesson 1: Welcome! da VOA.', 'Assista a um trecho curto. Ouça de novo, pause e repita. Termine as atividades dessa lição antes de seguir para a Lesson 2.'],
    ['Em Praticar, faça “Uma primeira conversa”.', 'Ouça ou leia, responda às perguntas e escreva três frases sobre você. Confira a explicação mesmo quando acertar.'],
    ['Em Conversação, escolha “Conhecer alguém”.', 'Repita a frase inicial. Depois copie o contexto para o ChatGPT e tente uma conversa de cinco minutos, usando ajuda quando precisar.'],
    ['Guarde uma frase e anote onde parou.', 'Use “Guardar frase para revisar” e escreva a lição ou o minuto do vídeo na anotação do curso.'],
  ], criterion: 'Continue quando conseguir se apresentar em algumas frases e fazer uma pergunta simples, mesmo com pausas. Se ainda precisar ler tudo, repita esta parte com pequenas variações.', links: [['/cursos', 'Abrir o curso principal'], ['/praticar', 'Fazer a primeira prática'], ['/conversacao', 'Treinar uma apresentação']] },
  { title: 'Continuar: inglês da sua rotina', subtitle: 'Parte 2 · use a base em situações reais', steps: [
    ['Retome a VOA exatamente de onde parou.', 'Siga as lições em ordem. Uma lição pode levar várias sessões; não precisa concluir uma por dia.'],
    ['Faça as próximas práticas A1 nesta ordem.', 'Um pedido no café → Uma rotina possível → Encontrar um lugar. Em cada uma, ouça, responda, escreva e guarde uma expressão útil.'],
    ['Repita o assunto na aba Conversação.', 'Use “Pedir em um café”, “Falar da minha rotina” e “Resolver um imprevisto”. Tente mudar o pedido ou a situação na segunda conversa.'],
    ['Use um complemento só quando surgir uma dificuldade.', 'Se travar no áudio, abra Listening A1 do British Council. Se travar nas frases, use Gramática A1–A2. Depois volte à sua lição principal.'],
  ], criterion: 'Avance quando conseguir trocar perguntas sobre sua rotina, entender a ideia de um áudio A1 após repetir e escrever uma mensagem curta compreensível. Não precisa acertar tudo.', links: [['/cursos', 'Retomar minha lição'], ['/praticar', 'Praticar situações A1'], ['/conversacao', 'Conversar sobre minha rotina']] },
  { title: 'Avançar: contar, explicar e revisar', subtitle: 'Parte 3 · conecte suas ideias', steps: [
    ['Experimente as práticas A2.', 'Faça “O que aconteceu no fim de semana?” e depois “Uma mudança de horário”. Se estiver muito difícil, volte a uma prática A1 e tente novamente em outra sessão.'],
    ['Acrescente leitura e escrita aos poucos.', 'Use Reading A2 para mensagens e avisos. No Write & Improve, comece por uma tarefa Beginner e revise sua própria primeira versão.'],
    ['Leve seus interesses para a conversa.', 'Escolha YouTube, games ou Fórmula 1. Diga o que gosta, explique um motivo e faça uma pergunta. Peça o resumo para guardar uma correção.'],
    ['Compare uma tentativa nova com uma antiga.', 'A cada quatro semanas, repita sua apresentação e releia uma anotação. Só ajuste o nível do plano quando as atividades atuais estiverem confortáveis.'],
  ], criterion: 'Continue ampliando os temas no seu ritmo. As práticas B1 e B2 ficam disponíveis como próximos desafios. SAT, ACT e TOEFL entram quando você decidir preparar uma prova; não são uma etapa obrigatória para aprender o básico.', links: [['/praticar', 'Experimentar as práticas A2'], ['/cursos', 'Abrir leitura e escrita'], ['/', 'Revisar meu plano']] },
] as const;

export function StudyGuide() {
  const { state, save, busy } = useLearningWorkspace();
  const completed = state.checks['study-guide'] ?? [false, false, false];
  const next = completed.findIndex(value => !value);
  return <div className="learn-page">
    <PageHeading eyebrow="SEU CAMINHO · PARTE POR PARTE" title="Abra o guia. Saiba o próximo passo." text="Siga estas três partes na ordem. A VOA é o seu curso principal; as práticas e conversas ajudam você a usar o que aprendeu. Volte aqui sempre que não souber o que fazer." />
    <div className="learn-banner"><span className="learn-task-symbol">{next < 0 ? '✓' : `0${next + 1}`}</span><div><strong>{next < 0 ? 'Você percorreu as três partes. Agora repita e aprofunde.' : `Seu próximo ponto de partida: ${stages[next].title}`}</strong><p>Sem prazo para terminar cada parte. A data de revisão do plano pode mudar; avance pelo que consegue fazer.</p></div><a className="learn-button primary" href={`#parte-${next < 0 ? 3 : next + 1}`}>Ir para minha parte ↓</a></div>
    <section className="learn-card"><span className="learn-eyebrow">COMO USAR EM CADA DIA DE ESTUDO</span><h2>Uma sequência simples para repetir</h2><ol className="learn-instructions"><li><strong>Retome:</strong> leia a anotação do curso e abra a lição onde parou.</li><li><strong>Aprenda:</strong> estude um trecho e confira o que entendeu.</li><li><strong>Use:</strong> escreva algumas frases ou pratique a conversa do mesmo assunto.</li><li><strong>Guarde:</strong> revise uma expressão e anote o próximo passo.</li></ol><p>Seu plano está em {state.settings.minutes} minutos por sessão. Divida esse tempo entre as atividades; não precisa terminar todos os passos de uma parte no mesmo dia. Quando o tempo acabar, anote onde parou e retome dali.</p><Link className="learn-text-link" to="/">Abrir meu checklist diário →</Link></section>
    {stages.map((stage, index) => <section className="learn-card" id={`parte-${index + 1}`} key={stage.title} style={{ scrollMarginTop: 24 }}><div className="learn-section-head"><div><span className="learn-eyebrow">{stage.subtitle}</span><h2>{stage.title}</h2></div><span className="learn-pill">{completed[index] ? 'Parte percorrida ✓' : `Parte ${index + 1} de 3`}</span></div><ol className="learn-instructions">{stage.steps.map(([title, detail]) => <li key={title}><strong>{title}</strong><p>{detail}</p></li>)}</ol><div className="learn-next"><strong>Quando seguir para o próximo passo?</strong><p>{stage.criterion}</p></div><div className="learn-actions">{stage.links.map(([to, label]) => <Link className="learn-button" key={label} to={to}>{label} →</Link>)}</div><label className="learn-check-label"><input type="checkbox" disabled={busy} checked={completed[index] ?? false} onChange={e => { const checked = e.target.checked; void save(s => { const values = [...(s.checks['study-guide'] ?? [false, false, false])]; values[index] = checked; s.checks['study-guide'] = values; }); }} />Percorri esta parte e quero marcar meu avanço</label></section>)}
    <section className="learn-card"><Note id="study-guide-next" title="Meu próximo passo, sem precisar lembrar de cabeça" placeholder="Estou na parte 1 · VOA Lesson 1, minuto… · na próxima sessão vou…" /></section>
  </div>;
}
