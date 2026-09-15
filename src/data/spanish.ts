import type { SpanishLevel } from '../lib/spanish-hub';

export const SPANISH_ACTIVITIES = [
  { id: 'escuchar', name: 'Escutar e entender', detail: 'Um áudio ou vídeo curto de um dos cursos. Primeiro sem legenda, depois confira.', to: '/espanhol/cursos', symbol: '♫' },
  { id: 'usar', name: 'Usar o que aprendeu', detail: 'Leia um texto curto e escreva três frases suas.', to: '/espanhol/praticar', symbol: 'Aa' },
  { id: 'hablar', name: 'Falar em voz alta', detail: 'Uma situação simples, sem precisar falar perfeito.', to: '/espanhol/conversacao', symbol: '¡Hola!' },
  { id: 'revisar', name: 'Lembrar sem olhar', detail: 'Revise as frases de ontem antes de conferir a resposta.', to: '/espanhol/praticar#revisar', symbol: '↻' },
];

export const SPANISH_UNITS: { level: SpanishLevel; title: string; focus: string; phrases: { es: string; pt: string }[]; point: string }[] = [
  {
    level: 'A1',
    title: 'Apresentar-se e sobreviver ao primeiro dia',
    focus: 'Cumprimentos, nome, origem e pedidos básicos.',
    phrases: [
      { es: '¿Cómo te llamas?', pt: 'Como você se chama?' },
      { es: 'Soy de Brasil, vivo en São Paulo.', pt: 'Sou do Brasil, moro em São Paulo.' },
      { es: '¿Puedes hablar más despacio, por favor?', pt: 'Você pode falar mais devagar, por favor?' },
      { es: 'Todavía estoy aprendiendo español.', pt: 'Ainda estou aprendendo espanhol.' },
    ],
    point: 'Em espanhol o verbo já indica quem fala, então “yo” costuma ser omitido: diga “soy de Brasil”, não “yo soy de Brasil” o tempo todo.',
  },
  {
    level: 'A1',
    title: 'Ser e estar, o primeiro divisor de águas',
    focus: 'Característica x estado, e por que “es bueno” ≠ “está bueno”.',
    phrases: [
      { es: 'Mi hermano es tranquilo.', pt: 'Meu irmão é tranquilo (jeito dele).' },
      { es: 'Mi hermano está tranquilo.', pt: 'Meu irmão está tranquilo (agora).' },
      { es: 'La comida está muy rica.', pt: 'A comida está muito gostosa.' },
      { es: '¿Dónde está la estación?', pt: 'Onde fica a estação?' },
    ],
    point: 'Localização de lugar e de pessoa sempre usa estar: “Madrid está en España”. Só a hora e o preço fogem disso (“son las tres”, “¿a cuánto está el kilo?”).',
  },
  {
    level: 'A2',
    title: 'Rotina, passado recente e combinar planos',
    focus: 'Presente, pretérito perfecto e marcar um encontro.',
    phrases: [
      { es: 'Hoy he estudiado una hora.', pt: 'Hoje eu estudei uma hora.' },
      { es: 'Ayer fui al mercado.', pt: 'Ontem eu fui ao mercado.' },
      { es: '¿Quedamos a las siete?', pt: 'A gente se encontra às sete?' },
      { es: 'Me gustaría reservar una mesa.', pt: 'Eu gostaria de reservar uma mesa.' },
    ],
    point: 'Na Espanha, “hoy he comido” (perfecto) para hoje e “ayer comí” (indefinido) para ontem. Na América Latina, “ayer comí” cobre os dois casos.',
  },
  {
    level: 'B1',
    title: 'Opinar, comparar e discordar com educação',
    focus: 'Conectores, subjuntivo inicial e argumentação curta.',
    phrases: [
      { es: 'Creo que tienes razón, aunque yo lo veo distinto.', pt: 'Acho que você tem razão, embora eu veja diferente.' },
      { es: 'No creo que sea tan sencillo.', pt: 'Não acho que seja tão simples.' },
      { es: 'Por un lado… por otro lado…', pt: 'Por um lado… por outro lado…' },
      { es: 'Depende de lo que necesites.', pt: 'Depende do que você precisar.' },
    ],
    point: 'Depois de dúvida ou negação vem subjuntivo: “creo que es” (certeza) vira “no creo que sea” (dúvida). É o mesmo movimento do português, só que obrigatório.',
  },
];

/** Data em que cada link gratuito abaixo foi conferido. */
export const SPANISH_RESEARCH_DATE = '15/09/2026';

export interface SpanishCourse {
  id: string;
  provider: string;
  title: string;
  level: string;
  skill: string;
  mark: string;
  color: 'peach' | 'mint' | 'lavender' | 'sky';
  description: string;
  action: string;
  url: string;
  type: string;
}

export const SPANISH_COURSES: SpanishCourse[] = [
  { id: 'lt-complete', provider: 'Language Transfer', title: 'Complete Spanish', level: 'A1–B1', skill: 'Curso completo', mark: '90', color: 'peach', description: 'Noventa aulas em áudio que constroem o espanhol a partir do que você já sabe em português. Sem cadastro, sem anúncios e sem nada pago.', action: 'Ouça a aula 1 e pause toda vez que ele pedir, respondendo em voz alta antes de ouvir a resposta. Uma aula por sessão já é suficiente.', url: 'https://www.languagetransfer.org/complete-spanish', type: 'Comece aqui' },
  { id: 'dreaming-spanish', provider: 'Dreaming Spanish', title: 'Input compreensível em vídeo', level: 'A1–B2', skill: 'Listening', mark: '♫', color: 'mint', description: 'Vídeos falados inteiramente em espanhol, com desenhos e gestos que deixam tudo compreensível, organizados de superbeginner a avançado.', action: 'Comece pela playlist Superbeginner. Não traduza: assista até pegar a ideia geral, mesmo perdendo palavras pelo caminho.', url: 'https://www.youtube.com/@DreamingSpanish', type: 'Canal gratuito' },
  { id: 'cvc-lecturas', provider: 'Centro Virtual Cervantes', title: 'Lecturas paso a paso', level: 'A1–B2', skill: 'Reading', mark: 'a→b', color: 'sky', description: 'Leituras graduadas do Instituto Cervantes em três níveis, cada uma com atividades de compreensão no fim.', action: 'Escolha uma leitura do nível inicial. Leia inteira antes de consultar qualquer palavra e só depois faça as atividades.', url: 'https://cvc.cervantes.es/aula/lecturas/', type: 'Trilha gratuita' },
  { id: 'cvc-ese', provider: 'Centro Virtual Cervantes', title: 'En sintonía con el español', level: 'A2–B2', skill: 'Listening', mark: '15′', color: 'lavender', description: 'Podcasts de cerca de quinze minutos: um ponto da língua explicado e, em seguida, um áudio real — entrevista, debate ou notícia — usando esse ponto.', action: 'Ouça um episódio inteiro sem pausar. Na segunda escuta, anote apenas três expressões que você realmente usaria.', url: 'https://cvc.cervantes.es/ensenanza/ese/', type: 'Podcast gratuito' },
  { id: 'cvc-ave', provider: 'Instituto Cervantes', title: 'Atividades abertas do AVE', level: 'A1–B2', skill: 'Todas as habilidades', mark: 'AVE', color: 'mint', description: 'Seleção aberta de atividades interativas do curso oficial do Instituto Cervantes, com os níveis A1 a B2 disponíveis por completo.', action: 'Faça as atividades do seu nível atual. Alguns dias depois, refaça as que você errou sem olhar a resposta.', url: 'https://cvc.cervantes.es/ensenanza/actividades_ave/', type: 'Amostra gratuita' },
  { id: 'utexas-spe', provider: 'UT Austin · LAITS', title: 'Spanish Proficiency Exercises', level: 'A1–B2', skill: 'Speaking', mark: '▶', color: 'peach', description: 'Vídeos curtos de falantes nativos de vários países fazendo tarefas reais: apresentar-se, pedir comida, contar um problema. Organizados por nível.', action: 'Escolha uma tarefa do nível Beginning, tente fazê-la sozinho antes de assistir e depois compare com dois falantes de países diferentes.', url: 'https://www.laits.utexas.edu/spe/', type: 'Biblioteca gratuita' },
  { id: 'spanishdict-guide', provider: 'SpanishDict', title: 'Guia de gramática e conjugador', level: 'A1–B2', skill: 'Grammar', mark: 'am', color: 'sky', description: 'Explicações curtas de gramática com exemplos, além de um conjugador que cobre qualquer verbo em qualquer tempo.', action: 'Use quando travar numa frase de verdade. Consulte a regra, escreva duas frases suas e volte ao estudo.', url: 'https://www.spanishdict.com/guide', type: 'Referência gratuita' },
  { id: 'conjuguemos', provider: 'Conjuguemos', title: 'Treino de conjugação', level: 'A1–B2', skill: 'Verbos', mark: '↻', color: 'lavender', description: 'Exercícios de conjugação por tempo verbal — presente, pretérito, subjuntivo — com correção imediata e um cronômetro opcional.', action: 'Escolha um tempo verbal só. Faça cinco minutos e anote os três verbos que mais escaparam.', url: 'https://conjuguemos.com/', type: 'Prática gratuita' },
];

export const SPANISH_ROADMAP: { level: SpanishLevel; title: string; text: string }[] = [
  { level: 'A1', title: 'Sair do portunhol', text: 'Apresentar-se, pedir, perguntar preço e horário, e separar as palavras que enganam quem fala português.' },
  { level: 'A2', title: 'Rotina e imprevistos', text: 'Contar o seu dia, combinar encontros, remarcar planos e falar do passado recente sem travar.' },
  { level: 'B1', title: 'Opinar e argumentar', text: 'Dar opinião, discordar com educação, explicar motivos e acompanhar notícias e conversas reais.' },
  { level: 'B2', title: 'Naturalidade e nuance', text: 'Conversas longas, sotaques diferentes, escrita mais detalhada e o humor que só aparece no uso.' },
];

export const SPANISH_TOPICS: { icon: string; title: string; task: string; starter: string }[] = [
  { icon: '☕', title: 'Pedir em um café', task: 'pedir algo para comer e beber, perguntar o preço e pagar', starter: 'Hola, buenos días. ¿Me pone un café con leche, por favor?' },
  { icon: '🧭', title: 'Pedir informação na rua', task: 'perguntar como chegar a um lugar e confirmar se entendeu', starter: 'Perdona, ¿sabes dónde está la estación de metro más cercana?' },
  { icon: '🏠', title: 'Alugar um quarto', task: 'perguntar sobre preço, contas incluídas e regras da casa', starter: 'Buenas, llamo por el anuncio del piso. ¿Sigue disponible la habitación?' },
  { icon: '🎓', title: 'Falar dos seus estudos', task: 'explicar o que você estuda, por que e o que quer fazer depois', starter: 'Estoy estudiando por mi cuenta y quiero seguir con la universidad fuera.' },
  { icon: '💼', title: 'Uma entrevista simples', task: 'apresentar-se, falar da sua experiência e fazer uma pergunta', starter: 'Encantado. Trabajo con contenido y estoy aprendiendo español para trabajar fuera.' },
  { icon: '🩺', title: 'Resolver um problema', task: 'explicar algo que deu errado e pedir uma solução', starter: 'Disculpa, creo que hay un error con mi pedido.' },
];

/** Palavras que parecem português e significam outra coisa — o erro mais caro para brasileiros. */
export const FALSE_FRIENDS: { es: string; looksLike: string; realMeaning: string; example: string }[] = [
  { es: 'embarazada', looksLike: 'embaraçada', realMeaning: 'grávida', example: 'Mi hermana está embarazada de cinco meses.' },
  { es: 'exquisito', looksLike: 'esquisito', realMeaning: 'delicioso, refinado', example: 'El postre estaba exquisito.' },
  { es: 'oficina', looksLike: 'oficina (mecânica)', realMeaning: 'escritório', example: 'Trabajo en una oficina en el centro.' },
  { es: 'rato', looksLike: 'rato (animal)', realMeaning: 'um momento, um tempinho', example: 'Espérame un rato, por favor.' },
  { es: 'salsa', looksLike: 'salsa (cheiro-verde)', realMeaning: 'molho', example: 'La pasta lleva salsa de tomate.' },
  { es: 'largo', looksLike: 'largo', realMeaning: 'comprido', example: 'El río es muy largo, no ancho.' },
  { es: 'pelado', looksLike: 'pelado (nu)', realMeaning: 'careca, descascado', example: 'Se quedó pelado después del corte.' },
  { es: 'vaso', looksLike: 'vaso', realMeaning: 'copo', example: 'Quiero un vaso de agua.' },
  { es: 'apellido', looksLike: 'apelido', realMeaning: 'sobrenome', example: 'Mi apellido es Souza.' },
  { es: 'borracha', looksLike: 'borracha', realMeaning: 'bêbada', example: 'La goma de borrar se llama goma, no borracha.' },
];

export type SpanishSkill = 'interpretacao' | 'vocabulario' | 'gramatica' | 'falsos_amigos';

export const SKILL_LABEL: Record<SpanishSkill, string> = {
  interpretacao: 'Interpretação de texto',
  vocabulario: 'Vocabulário em contexto',
  gramatica: 'Gramática em uso',
  falsos_amigos: 'Falsos amigos',
};

export interface SpanishQuestion {
  id: string;
  skill: SpanishSkill;
  level: SpanishLevel;
  passage?: string;
  passageNote?: string;
  prompt: string;
  choices: string[];
  answer: number;
  why: string;
}

/** Questões autorais em estilo de prova de linguagem. Não reproduzem nenhuma prova oficial. */
export const SPANISH_QUESTIONS: SpanishQuestion[] = [
  {
    id: 'es-int-01',
    skill: 'interpretacao',
    level: 'A2',
    passage: 'La biblioteca municipal abrirá una sala de estudio nocturna a partir del lunes. El espacio funcionará de ocho de la noche a dos de la madrugada y estará reservado a estudiantes con carné vigente. No será necesario reservar asiento, pero el acceso se cerrará cuando la sala llegue a su capacidad máxima.',
    passageNote: 'Aviso de uma biblioteca municipal',
    prompt: 'De acordo com o texto, para usar a sala noturna é necessário:',
    choices: [
      'reservar um assento com antecedência',
      'apresentar uma carteira de estudante válida',
      'chegar antes das oito da noite',
      'pagar uma taxa de acesso',
    ],
    answer: 1,
    why: 'O texto diz “reservado a estudiantes con carné vigente” — carteira válida. E ainda afirma “no será necesario reservar asiento”, o que elimina a primeira opção.',
  },
  {
    id: 'es-int-02',
    skill: 'interpretacao',
    level: 'B1',
    passage: 'Durante años se creyó que aprender dos idiomas a la vez retrasaba a los niños. Los estudios recientes apuntan en otra dirección: el vocabulario de cada lengua puede crecer más despacio al principio, pero la suma de las dos supera la de un niño monolingüe. El retraso, en realidad, nunca existió; lo que había era una forma incompleta de medirlo.',
    passageNote: 'Trecho de divulgação científica',
    prompt: 'A ideia central do texto é que:',
    choices: [
      'crianças bilíngues aprendem menos palavras no total',
      'o suposto atraso vinha do jeito de medir, não do bilinguismo',
      'aprender dois idiomas deve ser adiado até a escola',
      'o vocabulário das duas línguas cresce sempre mais rápido',
    ],
    answer: 1,
    why: 'A última frase resolve o texto: “el retraso nunca existió; lo que había era una forma incompleta de medirlo”. O atraso era um erro de medição.',
  },
  {
    id: 'es-voc-01',
    skill: 'vocabulario',
    level: 'A2',
    passage: 'Llegué tarde a la reunión porque el tren se averió a mitad de camino.',
    prompt: 'A palavra “averió” indica que o trem:',
    choices: ['acelerou', 'quebrou', 'parou em outra estação', 'mudou de linha'],
    answer: 1,
    why: '“Averiarse” é quebrar, apresentar defeito — a mesma ideia de “avaria” em português. É a única opção que explica o atraso.',
  },
  {
    id: 'es-voc-02',
    skill: 'vocabulario',
    level: 'B1',
    passage: 'El profesor pidió que entregáramos el trabajo a más tardar el viernes.',
    prompt: 'A expressão “a más tardar” equivale, em português, a:',
    choices: ['pelo menos', 'no máximo até', 'de vez em quando', 'daqui a pouco'],
    answer: 1,
    why: '“A más tardar” marca o prazo limite: no máximo até sexta. Não fala de quantidade (“pelo menos”) nem de frequência.',
  },
  {
    id: 'es-voc-03',
    skill: 'vocabulario',
    level: 'A1',
    passage: 'Antes de salir, cogió el paraguas porque estaba lloviendo.',
    prompt: 'No contexto, “cogió” significa:',
    choices: ['pegou', 'esqueceu', 'comprou', 'guardou'],
    answer: 0,
    why: 'Na Espanha “coger” é simplesmente pegar. Atenção: em boa parte da América Latina esse verbo é vulgar, e se usa “tomar” ou “agarrar”.',
  },
  {
    id: 'es-fal-01',
    skill: 'falsos_amigos',
    level: 'A1',
    passage: 'Mi prima está embarazada y va a tener una niña en marzo.',
    prompt: 'A frase diz que a prima está:',
    choices: ['envergonhada', 'grávida', 'atrapalhada', 'apressada'],
    answer: 1,
    why: '“Embarazada” é grávida — um dos falsos amigos mais perigosos. Envergonhada seria “avergonzada”.',
  },
  {
    id: 'es-fal-02',
    skill: 'falsos_amigos',
    level: 'A2',
    passage: 'El chef nos sirvió un plato exquisito que todos repetimos.',
    prompt: 'O prato foi descrito como:',
    choices: ['estranho', 'delicioso', 'simples', 'apimentado'],
    answer: 1,
    why: '“Exquisito” é delicioso, requintado — o oposto de “esquisito”. O detalhe “que todos repetimos” confirma o elogio.',
  },
  {
    id: 'es-fal-03',
    skill: 'falsos_amigos',
    level: 'A2',
    passage: 'Trabajo en una oficina cerca de la plaza; salgo a las seis.',
    prompt: 'A pessoa trabalha em:',
    choices: ['uma oficina mecânica', 'um escritório', 'uma loja', 'uma fábrica'],
    answer: 1,
    why: '“Oficina” é escritório. Oficina mecânica em espanhol é “taller”.',
  },
  {
    id: 'es-gra-01',
    skill: 'gramatica',
    level: 'A1',
    passage: 'La sopa ___ fría; caliéntala un poco antes de servirla.',
    prompt: 'Complete a frase corretamente:',
    choices: ['es', 'está', 'hay', 'tiene'],
    answer: 1,
    why: 'Estado passageiro pede “estar”. “La sopa es fría” diria que ela é servida fria por natureza, como o gaspacho.',
  },
  {
    id: 'es-gra-02',
    skill: 'gramatica',
    level: 'A2',
    passage: 'No encuentro mis llaves. ¿___ has visto?',
    prompt: 'Complete com o pronome correto:',
    choices: ['Lo', 'La', 'Las', 'Les'],
    answer: 2,
    why: '“Llaves” é feminino plural, então o pronome de objeto direto é “las”. Em português diríamos “você as viu?”.',
  },
  {
    id: 'es-gra-03',
    skill: 'gramatica',
    level: 'B1',
    passage: 'No creo que ___ tan difícil aprobar el examen.',
    prompt: 'Complete a frase:',
    choices: ['es', 'sea', 'será', 'fue'],
    answer: 1,
    why: 'Depois de “no creo que” (dúvida ou negação) o verbo vai para o subjuntivo: “sea”. Com certeza seria “creo que es”.',
  },
  {
    id: 'es-int-03',
    skill: 'interpretacao',
    level: 'A2',
    passage: '—¿Te apetece un café? —Acabo de tomarme uno, pero te acompaño igual.',
    passageNote: 'Diálogo curto',
    prompt: 'A segunda pessoa está dizendo que:',
    choices: [
      'quer um café agora',
      'já tomou café, mas vai junto mesmo assim',
      'não gosta de café',
      'vai tomar café mais tarde',
    ],
    answer: 1,
    why: '“Acabo de tomarme uno” = acabei de tomar um. “Te acompaño igual” = mesmo assim eu vou com você. A pessoa recusa a bebida, não a companhia.',
  },
];
