import type { SpanishLevel } from '../lib/spanish-hub';

export const SPANISH_ACTIVITIES = [
  { id: 'escuchar', name: 'Escutar e entender', detail: 'Um áudio ou vídeo curto. Primeiro sem legenda, depois confira.', to: '/espanhol/praticar#escutar', symbol: '♫' },
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
