import type { EnglishVariant } from '../lib/learning-hub';
import {
  practiceLessons as britishPracticeLessons,
  speakingTopics as britishSpeakingTopics,
  type PracticeLesson,
} from './learning-hub';

export interface EnglishCourse {
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

const britishCourses: EnglishCourse[] = [
  { id: 'bc-speak-a1', provider: 'British Council', title: 'Suas primeiras conversas', level: 'A1', skill: 'Speaking', mark: 'Hi!', color: 'lavender', description: 'Vídeos com inglês britânico e internacional para apresentações, esclarecimentos e expressões úteis.', action: 'Comece por Meeting new people. Pause o vídeo e repita cada expressão em voz alta.', url: 'https://learnenglish.britishcouncil.org/free-resources/speaking/a1', type: 'Comece aqui' },
  { id: 'bc-listen-a1', provider: 'British Council', title: 'Entenda o inglês do dia a dia', level: 'A1', skill: 'Listening', mark: '♫', color: 'mint', description: 'Áudios curtos sobre situações comuns, com preparação e exercícios de compreensão.', action: 'Escolha Ordering in a café. Ouça uma vez sem texto, responda e ouça de novo.', url: 'https://learnenglish.britishcouncil.org/free-resources/listening/a1', type: 'Trilha gratuita' },
  { id: 'bc-read-a1', provider: 'British Council', title: 'Leia avisos, mensagens e horários', level: 'A1', skill: 'Reading', mark: 'a→b', color: 'peach', description: 'Textos curtos do cotidiano, incluindo formulários, menus e um horário de estudos na Inglaterra.', action: 'Comece por A study timetable. Localize primeiro dias, horários e lugares; depois faça os exercícios.', url: 'https://learnenglish.britishcouncil.org/free-resources/reading/a1', type: 'Trilha gratuita' },
  { id: 'bc-grammar', provider: 'British Council', title: 'Gramática que você usa', level: 'A1–A2', skill: 'Grammar', mark: 'am', color: 'sky', description: 'Explicações e exercícios: to be, perguntas, presente e passado em contextos simples.', action: 'Comece por Present simple: to be. Escreva três frases sobre você depois do exercício.', url: 'https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2', type: 'Trilha gratuita' },
  { id: 'bc-vocab-a1', provider: 'British Council', title: 'Vocabulário para viver no Reino Unido', level: 'A1–A2', skill: 'Vocabulary', mark: 'Aa', color: 'mint', description: 'Palavras, pronúncia e ortografia por tema, com lições sobre transporte, rotina e comida britânica.', action: 'Comece por Daily routine ou Food in Britain. Guarde apenas cinco palavras que você realmente usaria.', url: 'https://learnenglish.britishcouncil.org/free-resources/vocabulary/a1-a2', type: 'Trilha gratuita' },
  { id: 'bc-listen-a2', provider: 'British Council', title: 'Acompanhe conversas e avisos', level: 'A2', skill: 'Listening', mark: '02', color: 'sky', description: 'Diálogos, recados, explicações e anúncios para reconhecer a ideia principal e detalhes.', action: 'Faça Changing a meeting time. Na segunda escuta, anote horário, motivo e decisão final.', url: 'https://learnenglish.britishcouncil.org/free-resources/listening/a2', type: 'Próximo passo' },
  { id: 'cambridge', provider: 'Cambridge English', title: 'Pratique em poucos minutos', level: 'A1–B2', skill: 'Todas as habilidades', mark: '5′', color: 'mint', description: 'Atividades curtas que você pode selecionar por nível, habilidade e duração.', action: 'Selecione Basic (A1–A2) e uma atividade de 0–5 minutos. Tente responder antes de consultar.', url: 'https://www.cambridgeenglish.org/learning-english/activities-for-learners/', type: 'Biblioteca gratuita' },
  { id: 'write-improve', provider: 'Cambridge · Write & Improve', title: 'Escreva, revise, tente de novo', level: 'A1–B2', skill: 'Writing', mark: '✎', color: 'lavender', description: 'Prática de escrita com feedback automático e tarefas para diferentes níveis.', action: 'Escolha uma tarefa Beginner. Escreva, leia o feedback e reescreva sem copiar o modelo.', url: 'https://writeandimprove.com/', type: 'Prática gratuita' },
];

const americanCourses: EnglishCourse[] = [
  { id: 'voa', provider: 'VOA Learning English', title: "Let’s Learn English — Level 1", level: 'A1', skill: 'Curso completo', mark: 'Aa', color: 'peach', description: 'Curso americano com 52 lições, vídeo, vocabulário e atividades para começar do básico.', action: 'Comece na Lesson 1: Welcome! Assista a um trecho, repita e faça a atividade. Uma lição pode ocupar vários dias.', url: 'https://learningenglish.voanews.com/p/5644.html', type: 'Comece aqui' },
  { id: 'usa-first', provider: 'USA Learns', title: '1st English Course', level: 'A1', skill: 'Curso completo', mark: '01', color: 'mint', description: 'Vinte unidades em vídeo sobre escola, tempo, compras, moradia, transporte e situações americanas.', action: 'Comece pela Unit 1 e siga em ordem: vocabulário, prática de língua e teste da unidade.', url: 'https://www.usalearns.org/1st-free-online-english-course', type: 'Curso gratuito' },
  { id: 'usa-plus', provider: 'USA Learns', title: 'English 1 Plus', level: 'A1–A2', skill: 'Curso em vídeo', mark: '+', color: 'lavender', description: 'Cinco unidades baseadas na série da VOA sobre Anna e a vida em Washington, D.C.', action: 'Use depois das primeiras unidades do 1st English Course. Faça uma lição por vez e registre onde parou.', url: 'https://www.usalearns.org/free-online-english-courses?isTeacher=False', type: 'Curso gratuito' },
  { id: 'usa-second', provider: 'USA Learns', title: '2nd English Course', level: 'A2–B1', skill: 'Curso completo', mark: '02', color: 'sky', description: 'Vinte unidades sobre trabalho, moradia, família, comunidade e educação nos Estados Unidos.', action: 'Entre quando as atividades A1 estiverem confortáveis. Comece por Workers and the Workplace.', url: 'https://www.usalearns.org/2nd-free-online-english-course', type: 'Próximo curso' },
  { id: 'usa-reading', provider: 'USA Learns', title: 'Practice English and Reading', level: 'B1–B2', skill: 'Reading', mark: 'R', color: 'peach', description: 'Leitura intermediária com áudio, vocabulário, ortografia, compreensão, escrita e pronúncia.', action: 'Escolha um tema que você já conhece. Ouça, leia e resuma três ideias sem traduzir cada palavra.', url: 'https://www.usalearns.org/practice-reading-and-english', type: 'Prática gratuita' },
  { id: 'voa-grammar', provider: 'VOA Learning English', title: 'Everyday Grammar TV', level: 'A2–B2', skill: 'Grammar', mark: 'am', color: 'sky', description: 'Vídeos curtos que ensinam gramática e clareza para estudantes de inglês americano.', action: 'Escolha um episódio ligado a uma dúvida real. Escreva duas frases novas usando a estrutura.', url: 'https://learningenglish.voanews.com/z/4716', type: 'Série gratuita' },
  { id: 'voa-minute', provider: 'VOA Learning English', title: 'English in a Minute', level: 'A2–B2', skill: 'Expressions', mark: '1′', color: 'mint', description: 'Vídeos de um minuto sobre expressões usadas no inglês americano.', action: 'Veja um episódio, repita a expressão e crie um exemplo sobre sua rotina ou seus vídeos.', url: 'https://learningenglish.voanews.com/z/3619', type: 'Série gratuita' },
  { id: 'voa-pronounce', provider: 'VOA Learning English', title: 'How to Pronounce', level: 'A2–B2', skill: 'Pronunciation', mark: '♫', color: 'lavender', description: 'Série de pronúncia americana sobre ritmo, tonicidade, ligações e sons em contexto.', action: 'Escolha um episódio e grave três tentativas. Compare ritmo e clareza, não uma imitação perfeita.', url: 'https://learningenglish.voanews.com/z/6042', type: 'Série gratuita' },
];

export const englishCoursesByVariant: Record<EnglishVariant, EnglishCourse[]> = {
  british: britishCourses,
  american: americanCourses,
};

export const primaryCourseByVariant: Record<EnglishVariant, EnglishCourse> = {
  british: britishCourses[0],
  american: americanCourses[0],
};

export const courseRoadmapByVariant = {
  british: [
    { level: 'A1', title: 'Base para Oxford', text: 'Apresentações, café, horários, transporte, formulários e pedidos de ajuda.' },
    { level: 'A2', title: 'Vida cotidiana no Reino Unido', text: 'Recados, mudanças de planos, moradia, serviços e conversas mais longas.' },
    { level: 'B1', title: 'Estudo e autonomia', text: 'Aulas, opiniões, explicações, notícias e participação em conversas reais.' },
    { level: 'B2', title: 'Clareza e repertório', text: 'Discussões, escrita detalhada, sotaques variados e linguagem acadêmica.' },
  ],
  american: [
    { level: 'A1', title: 'Base americana', text: 'Apresentações, compras, horários, moradia, direções e pedidos simples.' },
    { level: 'A2', title: 'Cotidiano nos Estados Unidos', text: 'Trabalho, comunidade, mídia, conversas e vocabulário em contexto.' },
    { level: 'B1', title: 'Histórias e independência', text: 'Leitura, notícias, explicações, opiniões e situações de trabalho e estudo.' },
    { level: 'B2', title: 'Naturalidade e precisão', text: 'Expressões, pronúncia, escrita detalhada e compreensão de mídia americana.' },
  ],
} satisfies Record<EnglishVariant, { level: string; title: string; text: string }[]>;

const americanSpeakingTopics = britishSpeakingTopics.map(topic => {
  const starters: Record<string, string> = {
    'Conhecer alguém': "Hi! I'm learning English. What do you like to do?",
    'Pedir em um café': 'Can I get a coffee, please?',
    'Falar da minha rotina': 'I usually study in the morning. How about you?',
    'YouTube e criação': 'I want to make a video about my week.',
    Games: 'My favorite game is Minecraft because I can build things.',
    'Fórmula 1': 'I root for Ferrari. Did you watch the race?',
    'Vida acadêmica': 'Can you tell me more about this class?',
    'Resolver um imprevisto': 'Sorry, could you say that again a little more slowly?',
  };
  return { ...topic, starter: starters[topic.title] ?? topic.starter };
});

export const speakingTopicsByVariant = {
  british: britishSpeakingTopics,
  american: americanSpeakingTopics,
} satisfies Record<EnglishVariant, readonly { title: string; task: string; starter: string; icon: string }[]>;

const americanPracticeLessons: PracticeLesson[] = [
  { id: 'us-intro', title: 'Uma primeira conversa', level: 'A1', script: 'Hello! My name is Alex. I am a student. I study English on Mondays and Wednesdays. I like music and video games. My friend Sam likes soccer. We study together at the library.', questions: [
    { question: 'What does Alex like?', options: ['Music and video games', 'Soccer only', 'Cooking'], answer: 0, why: 'Alex diz “I like music and video games”. Quem gosta de soccer é Sam.' },
    { question: 'Where do they study together?', options: ['At a coffee shop', 'At the library', 'At a stadium'], answer: 1, why: 'A última frase informa o lugar: at the library = na biblioteca.' },
  ], phrase: 'Could you say that again?', meaning: 'Você pode repetir?', writing: 'Escreva 3 frases: seu nome, algo que você faz e algo que você gosta. Use I am / I study / I like.', model: 'I am Alex. I study English. I like making videos.' },
  { id: 'us-cafe', title: 'Um pedido no café', level: 'A1', script: 'Good morning. Can I get a small coffee, please? Sure. Would you like milk? Yes, please, but no sugar. Anything to eat? A grilled cheese sandwich, please. That comes to eight dollars. Thank you.', questions: [
    { question: 'What does the customer drink?', options: ['Coffee with milk, no sugar', 'Tea with sugar', 'Orange juice'], answer: 0, why: 'O pedido é a small coffee, com milk, mas no sugar.' },
    { question: 'How much is everything?', options: ['Six dollars', 'Eight dollars', 'Ten dollars'], answer: 1, why: '“That comes to eight dollars” informa o total da compra.' },
  ], phrase: 'Can I get a coffee, please?', meaning: 'Eu posso pedir um café, por favor?', writing: 'Escreva seu pedido de uma bebida e uma comida. Depois pergunte o preço.', model: 'Can I get a coffee and a sandwich, please? How much is that?' },
  { id: 'us-routine', title: 'Uma rotina possível', level: 'A1', script: 'I wake up at seven. I eat breakfast at home. At nine, I study English for thirty minutes. In the afternoon, I make a video. I do not study late at night because I feel tired. On Sunday, I relax.', questions: [
    { question: 'When does the speaker study English?', options: ['At seven', 'At nine', 'Late at night'], answer: 1, why: '“At nine, I study English” indica o horário. Seven é a hora de acordar.' },
    { question: 'Why does the speaker avoid studying late?', options: ['They are tired', 'They make breakfast', 'It is Sunday'], answer: 0, why: '“Because I feel tired” explica o motivo: cansaço.' },
  ], phrase: 'I study a little every day.', meaning: 'Eu estudo um pouco todos os dias.', writing: 'Conte sua rotina em 4 frases. Inclua um horário e algo que você não faz.', model: 'I wake up at eight. I study in the morning. I make videos. I do not study late at night.' },
  { id: 'us-directions', title: 'Encontrar um lugar', level: 'A1', script: 'Excuse me, where is the library? Go straight for two blocks and turn left at the drugstore. The library is across from the park. Is it far? No, it is about a five-minute walk. Thank you for your help.', questions: [
    { question: 'Where should you turn left?', options: ['At the park', 'At the library', 'At the drugstore'], answer: 2, why: 'A instrução é virar à esquerda na drugstore, palavra comum nos Estados Unidos.' },
    { question: 'How long is the walk?', options: ['Fifty minutes', 'Five minutes', 'Fifteen minutes'], answer: 1, why: 'Five = 5; fifteen = 15; fifty = 50. Preste atenção nesses sons.' },
  ], phrase: 'It is across from the park.', meaning: 'Fica em frente ao parque, do outro lado da rua.', writing: 'Descreva como chegar a um lugar imaginário. Use blocks, turn e across from.', model: 'Go straight for one block. Turn right at the coffee shop. The store is across from the library.' },
  { id: 'us-weekend', title: 'O que aconteceu no fim de semana?', level: 'A2', script: 'Last Saturday, Maya planned to shoot a video downtown, but it rained all morning. She stayed in her apartment and edited an old recording instead. In the afternoon, the weather improved. She went for a short walk and took some pictures for her next video.', questions: [
    { question: 'Why did Maya stay in her apartment?', options: ['She lost her camera', 'It was raining', 'She was asleep'], answer: 1, why: 'O plano mudou por causa da chuva: “it rained all morning”.' },
    { question: 'What did she do first?', options: ['Edited a recording', 'Took pictures outside', 'Went for a walk'], answer: 0, why: 'Ela editou em casa antes de sair à tarde. Observe a sequência temporal.' },
  ], phrase: 'I changed my plans because it rained.', meaning: 'Mudei meus planos porque choveu.', writing: 'Conte o que fez ontem em 4–5 frases. Inclua first, then e because.', model: 'Yesterday I stayed in my apartment. First, I studied English. Then I edited a video. I did not go downtown because it rained.' },
  { id: 'us-class-email', title: 'Uma mudança de sala', level: 'A2', script: 'Hi everyone. Our English class will start at ten thirty tomorrow, not ten. The usual room is closed, so please come to room twelve on the second floor. Bring your notebook. You do not need to print the worksheet because I will give you a copy. See you tomorrow. Emma.', questions: [
    { question: 'What time is class tomorrow?', options: ['Ten', 'Twelve', 'Ten thirty'], answer: 2, why: 'A mensagem corrige o horário: ten thirty, not ten.' },
    { question: 'What must students bring?', options: ['A printed worksheet', 'A notebook', 'A laptop'], answer: 1, why: 'Bring your notebook. A professora fornecerá a folha.' },
  ], phrase: 'Could you confirm the room number, please?', meaning: 'Você pode confirmar o número da sala, por favor?', writing: 'Responda à professora: agradeça, confirme o novo horário e faça uma pergunta.', model: 'Hi Emma, thanks for the update. I will be there at ten thirty. Is there an elevator to the second floor?' },
  { id: 'us-video', title: 'Contar uma ideia com clareza', level: 'B1', script: 'Leo used to spend hours choosing equipment for his videos. However, his audience cared more about clear stories than expensive cameras. He decided to plan each video around one question and record with the equipment he already owned. After a month, viewers were leaving more thoughtful comments, even though the number of views had barely changed.', questions: [
    { question: 'What changed in Leo’s approach?', options: ['He bought more cameras', 'He focused on a clear story', 'He stopped planning'], answer: 1, why: 'O foco passou de equipamento para uma pergunta central e uma história clara.' },
    { question: 'What improved?', options: ['The quality of comments', 'The price of equipment', 'The number of cameras'], answer: 0, why: '“More thoughtful comments” indica comentários mais reflexivos; visualizações quase não mudaram.' },
  ], phrase: 'What matters most is a clear message.', meaning: 'O que mais importa é uma mensagem clara.', writing: 'Escreva um parágrafo sobre uma habilidade que quer melhorar. Dê uma razão e um exemplo.', model: 'I want to explain ideas more clearly in my videos. A simple message helps viewers follow the story. For example, I can focus on one useful lesson from my week instead of describing everything.' },
  { id: 'us-learning', title: 'Comparar formas de estudar', level: 'B2', script: 'A study group introduced short discussion sessions after each reading assignment. Although some members initially preferred working alone, most found that explaining an idea revealed gaps in their understanding. The organizer cautioned that attendance alone did not demonstrate improvement: members also needed to revisit difficult material and compare their later responses with earlier ones.', questions: [
    { question: 'What is the organizer’s main caution?', options: ['Discussion should replace reading', 'Attending does not by itself prove learning', 'Only independent study works'], answer: 1, why: 'Participar não basta: é necessário revisar e comparar o desempenho ao longo do tempo.' },
    { question: 'What did explaining an idea help reveal?', options: ['Missing understanding', 'The group’s costs', 'The reading schedule'], answer: 0, why: '“Gaps in their understanding” são lacunas de compreensão.' },
  ], phrase: 'I see your point, but I would add that…', meaning: 'Entendo seu ponto, mas eu acrescentaria que…', writing: 'Em 100–130 palavras, compare estudar sozinho e discutir com alguém. Defenda sua preferência e reconheça uma limitação.', model: 'Studying alone lets me control the pace, while discussion helps me notice unclear ideas. I prefer combining both: first I read and take notes, then I explain the topic to someone else. However, a discussion can be distracting without a clear question.' },
];

export const practiceLessonsByVariant: Record<EnglishVariant, PracticeLesson[]> = {
  british: britishPracticeLessons,
  american: americanPracticeLessons,
};

export const variantDifferenceExamples = {
  british: [
    ['flat', 'apartment'], ['holiday', 'vacation'], ['queue', 'line'], ['postcode', 'ZIP code'], ['city centre', 'downtown'], ['lift', 'elevator'],
  ],
  american: [
    ['apartment', 'flat'], ['vacation', 'holiday'], ['line', 'queue'], ['ZIP code', 'postcode'], ['downtown', 'city centre'], ['elevator', 'lift'],
  ],
} satisfies Record<EnglishVariant, string[][]>;
