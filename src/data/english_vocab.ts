/*
 * Vocabulary bank for the English module.
 * Each item powers three trainers: flashcard recall (SRS), listening/dictation
 * (the example sentence is read aloud via TTS), and speaking (the user says the
 * example sentence and is scored on pronunciation).
 *
 * Expand by adding VocabItem objects. `level` follows CEFR (A1 → C2).
 */
import type { CEFRLevel } from '../lib/english_types';

export interface VocabItem {
  id: string;
  level: CEFRLevel;
  word: string;
  pos: string;           // part of speech (noun, verb, adjective…)
  translation: string;   // PT-BR
  example: string;       // natural English sentence using the word
  example_pt: string;    // PT-BR translation of the sentence
}

export const VOCAB: VocabItem[] = [
  // ─── A1 ───────────────────────────────────────────────────────────────────
  { id: 'v-a1-01', level: 'A1', word: 'house', pos: 'substantivo', translation: 'casa', example: 'They live in a small house near the beach.', example_pt: 'Eles moram em uma casa pequena perto da praia.' },
  { id: 'v-a1-02', level: 'A1', word: 'eat', pos: 'verbo', translation: 'comer', example: 'We usually eat dinner at seven.', example_pt: 'Normalmente jantamos às sete.' },
  { id: 'v-a1-03', level: 'A1', word: 'happy', pos: 'adjetivo', translation: 'feliz', example: 'She was happy to see her friends.', example_pt: 'Ela ficou feliz em ver seus amigos.' },
  { id: 'v-a1-04', level: 'A1', word: 'water', pos: 'substantivo', translation: 'água', example: 'Can I have a glass of water, please?', example_pt: 'Posso tomar um copo de água, por favor?' },
  { id: 'v-a1-05', level: 'A1', word: 'friend', pos: 'substantivo', translation: 'amigo', example: 'My best friend lives next door.', example_pt: 'Meu melhor amigo mora na casa ao lado.' },
  { id: 'v-a1-06', level: 'A1', word: 'go', pos: 'verbo', translation: 'ir', example: 'I go to school by bus every day.', example_pt: 'Eu vou para a escola de ônibus todos os dias.' },
  { id: 'v-a1-07', level: 'A1', word: 'book', pos: 'substantivo', translation: 'livro', example: 'This book is very interesting.', example_pt: 'Este livro é muito interessante.' },
  { id: 'v-a1-08', level: 'A1', word: 'big', pos: 'adjetivo', translation: 'grande', example: 'They have a big dog.', example_pt: 'Eles têm um cachorro grande.' },
  { id: 'v-a1-09', level: 'A1', word: 'work', pos: 'verbo', translation: 'trabalhar', example: 'My parents work in a hospital.', example_pt: 'Meus pais trabalham em um hospital.' },
  { id: 'v-a1-10', level: 'A1', word: 'morning', pos: 'substantivo', translation: 'manhã', example: 'I drink coffee every morning.', example_pt: 'Eu tomo café toda manhã.' },

  // ─── A2 ───────────────────────────────────────────────────────────────────
  { id: 'v-a2-01', level: 'A2', word: 'travel', pos: 'verbo', translation: 'viajar', example: 'They love to travel during the summer.', example_pt: 'Eles adoram viajar durante o verão.' },
  { id: 'v-a2-02', level: 'A2', word: 'expensive', pos: 'adjetivo', translation: 'caro', example: 'That restaurant is too expensive for us.', example_pt: 'Aquele restaurante é caro demais para nós.' },
  { id: 'v-a2-03', level: 'A2', word: 'borrow', pos: 'verbo', translation: 'pegar emprestado', example: 'Can I borrow your pen for a minute?', example_pt: 'Posso pegar sua caneta emprestada por um minuto?' },
  { id: 'v-a2-04', level: 'A2', word: 'weather', pos: 'substantivo', translation: 'tempo (clima)', example: 'The weather is nice today.', example_pt: 'O tempo está bom hoje.' },
  { id: 'v-a2-05', level: 'A2', word: 'remember', pos: 'verbo', translation: 'lembrar', example: 'I cannot remember her phone number.', example_pt: 'Não consigo lembrar o número de telefone dela.' },
  { id: 'v-a2-06', level: 'A2', word: 'busy', pos: 'adjetivo', translation: 'ocupado', example: 'She is too busy to answer the phone.', example_pt: 'Ela está ocupada demais para atender o telefone.' },
  { id: 'v-a2-07', level: 'A2', word: 'enough', pos: 'advérbio', translation: 'o suficiente', example: 'We do not have enough money for the trip.', example_pt: 'Não temos dinheiro suficiente para a viagem.' },
  { id: 'v-a2-08', level: 'A2', word: 'arrive', pos: 'verbo', translation: 'chegar', example: 'The train will arrive at noon.', example_pt: 'O trem vai chegar ao meio-dia.' },
  { id: 'v-a2-09', level: 'A2', word: 'usually', pos: 'advérbio', translation: 'geralmente', example: 'I usually wake up early on weekdays.', example_pt: 'Eu geralmente acordo cedo nos dias de semana.' },
  { id: 'v-a2-10', level: 'A2', word: 'neighbor', pos: 'substantivo', translation: 'vizinho', example: 'Our neighbor is very friendly.', example_pt: 'Nosso vizinho é muito amigável.' },

  // ─── B1 ───────────────────────────────────────────────────────────────────
  { id: 'v-b1-01', level: 'B1', word: 'achieve', pos: 'verbo', translation: 'alcançar, atingir', example: 'She worked hard to achieve her goals.', example_pt: 'Ela trabalhou duro para alcançar seus objetivos.' },
  { id: 'v-b1-02', level: 'B1', word: 'reliable', pos: 'adjetivo', translation: 'confiável', example: 'He is a reliable employee who is never late.', example_pt: 'Ele é um funcionário confiável que nunca se atrasa.' },
  { id: 'v-b1-03', level: 'B1', word: 'improve', pos: 'verbo', translation: 'melhorar', example: 'Reading every day will improve your English.', example_pt: 'Ler todos os dias vai melhorar o seu inglês.' },
  { id: 'v-b1-04', level: 'B1', word: 'decision', pos: 'substantivo', translation: 'decisão', example: 'Making that decision was not easy.', example_pt: 'Tomar aquela decisão não foi fácil.' },
  { id: 'v-b1-05', level: 'B1', word: 'available', pos: 'adjetivo', translation: 'disponível', example: 'The doctor is not available right now.', example_pt: 'O médico não está disponível agora.' },
  { id: 'v-b1-06', level: 'B1', word: 'although', pos: 'conjunção', translation: 'embora', example: 'Although it was raining, we went for a walk.', example_pt: 'Embora estivesse chovendo, fomos caminhar.' },
  { id: 'v-b1-07', level: 'B1', word: 'suggest', pos: 'verbo', translation: 'sugerir', example: 'I suggest that we leave early to avoid traffic.', example_pt: 'Eu sugiro que saiamos cedo para evitar o trânsito.' },
  { id: 'v-b1-08', level: 'B1', word: 'experience', pos: 'substantivo', translation: 'experiência', example: 'Living abroad was an amazing experience.', example_pt: 'Morar no exterior foi uma experiência incrível.' },
  { id: 'v-b1-09', level: 'B1', word: 'afford', pos: 'verbo', translation: 'ter condições de pagar', example: 'We cannot afford a new car this year.', example_pt: 'Não temos condições de pagar um carro novo este ano.' },
  { id: 'v-b1-10', level: 'B1', word: 'crowded', pos: 'adjetivo', translation: 'lotado', example: 'The bus was crowded during rush hour.', example_pt: 'O ônibus estava lotado no horário de pico.' },

  // ─── B2 ───────────────────────────────────────────────────────────────────
  { id: 'v-b2-01', level: 'B2', word: 'acknowledge', pos: 'verbo', translation: 'reconhecer, admitir', example: 'She acknowledged that she had made a mistake.', example_pt: 'Ela reconheceu que havia cometido um erro.' },
  { id: 'v-b2-02', level: 'B2', word: 'reluctant', pos: 'adjetivo', translation: 'relutante', example: 'He was reluctant to share his opinion.', example_pt: 'Ele estava relutante em compartilhar sua opinião.' },
  { id: 'v-b2-03', level: 'B2', word: 'overcome', pos: 'verbo', translation: 'superar', example: 'They managed to overcome many difficulties.', example_pt: 'Eles conseguiram superar muitas dificuldades.' },
  { id: 'v-b2-04', level: 'B2', word: 'significant', pos: 'adjetivo', translation: 'significativo', example: 'There has been a significant increase in prices.', example_pt: 'Houve um aumento significativo nos preços.' },
  { id: 'v-b2-05', level: 'B2', word: 'assume', pos: 'verbo', translation: 'presumir, supor', example: 'Do not assume that everyone agrees with you.', example_pt: 'Não presuma que todos concordam com você.' },
  { id: 'v-b2-06', level: 'B2', word: 'consequence', pos: 'substantivo', translation: 'consequência', example: 'Every action has a consequence.', example_pt: 'Toda ação tem uma consequência.' },
  { id: 'v-b2-07', level: 'B2', word: 'thorough', pos: 'adjetivo', translation: 'minucioso, detalhado', example: 'The police conducted a thorough investigation.', example_pt: 'A polícia conduziu uma investigação minuciosa.' },
  { id: 'v-b2-08', level: 'B2', word: 'emphasize', pos: 'verbo', translation: 'enfatizar', example: 'The teacher emphasized the importance of practice.', example_pt: 'O professor enfatizou a importância da prática.' },
  { id: 'v-b2-09', level: 'B2', word: 'whereas', pos: 'conjunção', translation: 'enquanto que', example: 'He likes coffee, whereas she prefers tea.', example_pt: 'Ele gosta de café, enquanto que ela prefere chá.' },
  { id: 'v-b2-10', level: 'B2', word: 'estimate', pos: 'verbo', translation: 'estimar', example: 'Experts estimate that the project will take a year.', example_pt: 'Especialistas estimam que o projeto levará um ano.' },

  // ─── C1 ───────────────────────────────────────────────────────────────────
  { id: 'v-c1-01', level: 'C1', word: 'inevitable', pos: 'adjetivo', translation: 'inevitável', example: 'Change is an inevitable part of life.', example_pt: 'A mudança é uma parte inevitável da vida.' },
  { id: 'v-c1-02', level: 'C1', word: 'undermine', pos: 'verbo', translation: 'minar, enfraquecer', example: 'Constant criticism can undermine a child\'s confidence.', example_pt: 'Críticas constantes podem minar a confiança de uma criança.' },
  { id: 'v-c1-03', level: 'C1', word: 'compelling', pos: 'adjetivo', translation: 'convincente, cativante', example: 'She made a compelling argument for reform.', example_pt: 'Ela apresentou um argumento convincente a favor da reforma.' },
  { id: 'v-c1-04', level: 'C1', word: 'discrepancy', pos: 'substantivo', translation: 'discrepância', example: 'There is a discrepancy between the two reports.', example_pt: 'Há uma discrepância entre os dois relatórios.' },
  { id: 'v-c1-05', level: 'C1', word: 'mitigate', pos: 'verbo', translation: 'mitigar, atenuar', example: 'New policies aim to mitigate the effects of pollution.', example_pt: 'Novas políticas visam mitigar os efeitos da poluição.' },
  { id: 'v-c1-06', level: 'C1', word: 'prevalent', pos: 'adjetivo', translation: 'predominante, comum', example: 'This attitude is prevalent among young voters.', example_pt: 'Essa atitude é predominante entre os jovens eleitores.' },
  { id: 'v-c1-07', level: 'C1', word: 'scrutiny', pos: 'substantivo', translation: 'escrutínio, exame minucioso', example: 'The company\'s finances came under intense scrutiny.', example_pt: 'As finanças da empresa foram submetidas a um intenso escrutínio.' },
  { id: 'v-c1-08', level: 'C1', word: 'comprehensive', pos: 'adjetivo', translation: 'abrangente', example: 'They offered a comprehensive solution to the problem.', example_pt: 'Eles ofereceram uma solução abrangente para o problema.' },
  { id: 'v-c1-09', level: 'C1', word: 'advocate', pos: 'verbo', translation: 'defender, advogar por', example: 'Many scientists advocate for stronger climate action.', example_pt: 'Muitos cientistas defendem ações climáticas mais fortes.' },
  { id: 'v-c1-10', level: 'C1', word: 'ambiguous', pos: 'adjetivo', translation: 'ambíguo', example: 'His answer was deliberately ambiguous.', example_pt: 'A resposta dele foi deliberadamente ambígua.' },

  // ─── C2 ───────────────────────────────────────────────────────────────────
  { id: 'v-c2-01', level: 'C2', word: 'ubiquitous', pos: 'adjetivo', translation: 'onipresente', example: 'Smartphones have become ubiquitous in modern life.', example_pt: 'Os smartphones se tornaram onipresentes na vida moderna.' },
  { id: 'v-c2-02', level: 'C2', word: 'meticulous', pos: 'adjetivo', translation: 'meticuloso', example: 'She kept meticulous records of every transaction.', example_pt: 'Ela mantinha registros meticulosos de cada transação.' },
  { id: 'v-c2-03', level: 'C2', word: 'paradigm', pos: 'substantivo', translation: 'paradigma', example: 'The discovery led to a paradigm shift in physics.', example_pt: 'A descoberta levou a uma mudança de paradigma na física.' },
  { id: 'v-c2-04', level: 'C2', word: 'ephemeral', pos: 'adjetivo', translation: 'efêmero', example: 'Fame can be surprisingly ephemeral.', example_pt: 'A fama pode ser surpreendentemente efêmera.' },
  { id: 'v-c2-05', level: 'C2', word: 'juxtapose', pos: 'verbo', translation: 'justapor, contrastar', example: 'The film juxtaposes wealth and poverty.', example_pt: 'O filme justapõe riqueza e pobreza.' },
  { id: 'v-c2-06', level: 'C2', word: 'pragmatic', pos: 'adjetivo', translation: 'pragmático', example: 'We need a pragmatic approach, not idealism.', example_pt: 'Precisamos de uma abordagem pragmática, não de idealismo.' },
  { id: 'v-c2-07', level: 'C2', word: 'nuance', pos: 'substantivo', translation: 'nuance, sutileza', example: 'He appreciates the nuances of the language.', example_pt: 'Ele aprecia as nuances do idioma.' },
  { id: 'v-c2-08', level: 'C2', word: 'tenacious', pos: 'adjetivo', translation: 'tenaz, persistente', example: 'Her tenacious spirit helped her succeed.', example_pt: 'Seu espírito tenaz a ajudou a ter sucesso.' },
  { id: 'v-c2-09', level: 'C2', word: 'eloquent', pos: 'adjetivo', translation: 'eloquente', example: 'The speaker gave an eloquent and moving speech.', example_pt: 'O orador fez um discurso eloquente e comovente.' },
  { id: 'v-c2-10', level: 'C2', word: 'inadvertently', pos: 'advérbio', translation: 'inadvertidamente, sem querer', example: 'He inadvertently revealed the surprise.', example_pt: 'Ele inadvertidamente revelou a surpresa.' },
];

export const VOCAB_BY_ID = new Map(VOCAB.map((v) => [v.id, v]));

export function vocabForLevel(level: CEFRLevel): VocabItem[] {
  return VOCAB.filter((v) => v.level === level);
}
