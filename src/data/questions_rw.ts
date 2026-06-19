import type { Question } from '../lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Reading & Writing Question Bank
// Original questions in SAT style — NOT copied from College Board materials.
// ─────────────────────────────────────────────────────────────────────────────

export const RW_QUESTIONS: Question[] = [

  // ─── CRAFT & STRUCTURE — easy ─────────────────────────────────────────────

  {
    id: 'rw-cs-e-001',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The museum curator was known for her ability to arrange exhibits in a way that was both visually appealing and educational. Her latest display on ancient pottery was particularly _______, attracting visitors from around the region.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['compelling', 'ordinary', 'confusing', 'outdated'],
    answer: 'A',
    explanation: '"Compelling" means fascinating or persuasive, which fits the context of an exhibit that attracted many visitors. "Ordinary" contradicts the positive description. "Confusing" and "outdated" are negative and don\'t align with the curator\'s reputation.',
    translation: {
      words: { curator: 'curadora', arrange: 'organizar', appealing: 'atraente', display: 'exposição', pottery: 'cerâmica', attracting: 'atraindo', compelling: 'cativante', ordinary: 'comum', confusing: 'confuso', outdated: 'desatualizado' },
      passage_pt: 'A curadora do museu era conhecida por sua habilidade de organizar exibições de forma visualmente atraente e educacional. Sua última exposição sobre cerâmica antiga era particularmente _______, atraindo visitantes de toda a região.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?',
      choices_pt: ['cativante', 'comum', 'confuso', 'desatualizado']
    }
  },
  {
    id: 'rw-cs-e-002',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'After months of negotiations, the two companies finally reached an agreement. The deal was described as _______ by both sides, suggesting that each party felt they had gained something valuable from the arrangement.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['mutually beneficial', 'one-sided', 'temporary', 'controversial'],
    answer: 'A',
    explanation: '"Mutually beneficial" directly matches the clue that "each party felt they had gained something valuable." The other choices contradict this mutual satisfaction.',
    translation: {
      words: { negotiations: 'negociações', reached: 'alcançaram', agreement: 'acordo', described: 'descrito', arrangement: 'arranjo', mutually: 'mutuamente', beneficial: 'benéfico', controversial: 'controverso' },
      passage_pt: 'Após meses de negociações, as duas empresas finalmente chegaram a um acordo. O negócio foi descrito como _______ por ambos os lados, sugerindo que cada parte sentiu ter ganhado algo valioso.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?',
      choices_pt: ['mutuamente benéfico', 'unilateral', 'temporário', 'controverso']
    }
  },
  {
    id: 'rw-cs-e-003',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'text_structure_and_purpose',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Plants need sunlight, water, and nutrients from the soil to survive. Without any one of these three essentials, a plant will weaken and eventually die. Gardeners who understand these basic requirements can keep their plants healthy with relatively little effort.',
    prompt: 'What is the main purpose of this text?',
    choices: [
      'To explain the basic requirements for plant survival',
      'To argue that gardening is a simple hobby',
      'To compare different types of plants',
      'To describe the history of gardening'
    ],
    answer: 'A',
    explanation: 'The text\'s primary focus is explaining the three things plants need to survive — sunlight, water, and nutrients. The other options introduce topics not addressed in the passage.',
    translation: {
      words: { nutrients: 'nutrientes', essentials: 'essenciais', eventually: 'eventualmente', requirements: 'requisitos', relatively: 'relativamente' },
      passage_pt: 'As plantas precisam de luz solar, água e nutrientes do solo para sobreviver. Sem qualquer um desses três itens essenciais, uma planta irá enfraquecer e eventualmente morrer. Jardineiros que entendem esses requisitos básicos podem manter suas plantas saudáveis com relativamente pouco esforço.',
      prompt_pt: 'Qual é o propósito principal deste texto?',
      choices_pt: ['Explicar os requisitos básicos para a sobrevivência das plantas', 'Argumentar que jardinagem é um hobby simples', 'Comparar diferentes tipos de plantas', 'Descrever a história da jardinagem']
    }
  },
  {
    id: 'rw-cs-e-004',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'cross_text_connections',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Text 1: Regular exercise has been shown to improve mental health by releasing endorphins, chemicals in the brain that reduce feelings of stress and anxiety.\n\nText 2: While many people believe that physical activity is primarily beneficial for the body, recent studies suggest that its effects on mood and cognitive function are equally significant.',
    prompt: 'Based on the two texts, how does Text 2 relate to the claim made in Text 1?',
    choices: [
      'Text 2 supports Text 1 by broadening the scope of physical activity\'s mental benefits',
      'Text 2 contradicts Text 1 by arguing that exercise has no mental benefits',
      'Text 2 focuses on different research methods than Text 1',
      'Text 2 questions the reliability of the studies mentioned in Text 1'
    ],
    answer: 'A',
    explanation: 'Text 1 claims exercise improves mental health via endorphins. Text 2 supports this by noting that effects on mood and cognitive function are "equally significant" to physical benefits — extending, not contradicting, the claim in Text 1.',
    translation: {
      words: { endorphins: 'endorfinas', anxiety: 'ansiedade', cognitive: 'cognitivo', significant: 'significativo', physical: 'físico', primarily: 'principalmente' },
      passage_pt: 'Texto 1: Foi demonstrado que o exercício regular melhora a saúde mental ao liberar endorfinas, substâncias químicas no cérebro que reduzem sentimentos de estresse e ansiedade.\n\nTexto 2: Embora muitas pessoas acreditem que a atividade física é benéfica principalmente para o corpo, estudos recentes sugerem que seus efeitos no humor e na função cognitiva são igualmente significativos.',
      prompt_pt: 'Com base nos dois textos, como o Texto 2 se relaciona com a afirmação feita no Texto 1?'
    }
  },

  // ─── CRAFT & STRUCTURE — medium ──────────────────────────────────────────

  {
    id: 'rw-cs-m-001',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The philosopher\'s argument, though elegant in its simplicity, was ultimately _______ — it failed to account for the complex interplay between individual agency and structural constraints that shapes human behavior.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['reductive', 'visionary', 'exhaustive', 'pragmatic'],
    answer: 'A',
    explanation: '"Reductive" means oversimplifying a complex issue, which perfectly describes an argument that fails to account for the interplay of individual and structural factors. "Visionary" is positive, "exhaustive" means thorough (the opposite of the criticism), and "pragmatic" means practical.',
    translation: {
      words: { philosopher: 'filósofo', elegant: 'elegante', ultimately: 'em última análise', account: 'considerar', interplay: 'interação', agency: 'agência', constraints: 'restrições', reductive: 'reducionista', visionary: 'visionário', exhaustive: 'exaustivo', pragmatic: 'pragmático' },
      passage_pt: 'O argumento do filósofo, embora elegante em sua simplicidade, era em última análise _______ — ele não conseguia considerar a complexa interação entre a agência individual e as restrições estruturais que moldam o comportamento humano.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?'
    }
  },
  {
    id: 'rw-cs-m-002',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The scientist\'s findings were met with considerable _______ from the academic community. Many of her colleagues refused to accept her conclusions without further empirical evidence, demanding that she replicate her results under controlled conditions.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['skepticism', 'enthusiasm', 'indifference', 'reverence'],
    answer: 'A',
    explanation: '"Skepticism" means doubt or questioning, which directly aligns with colleagues "refusing to accept" findings without more evidence. "Enthusiasm" is positive, "indifference" suggests they didn\'t care, and "reverence" means deep respect.',
    translation: {
      words: { considerable: 'considerável', academic: 'acadêmica', colleagues: 'colegas', conclusions: 'conclusões', empirical: 'empírico', replicate: 'replicar', controlled: 'controlado', skepticism: 'ceticismo', enthusiasm: 'entusiasmo', indifference: 'indiferença', reverence: 'reverência' },
      passage_pt: 'As descobertas da cientista foram recebidas com considerável _______ da comunidade acadêmica. Muitos de seus colegas se recusaram a aceitar suas conclusões sem mais evidências empíricas, exigindo que ela replicasse seus resultados em condições controladas.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?'
    }
  },
  {
    id: 'rw-cs-m-003',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'text_structure_and_purpose',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Although the novel was published to critical acclaim in the 1960s, it remained largely obscure for decades, overshadowed by the author\'s other works. Only after a major film adaptation in 2015 did readers rediscover it — and with that rediscovery came a reassessment of its place in the literary canon.',
    prompt: 'Which choice best describes the function of the phrase "and with that rediscovery came a reassessment of its place in the literary canon"?',
    choices: [
      'It indicates a consequence of the novel\'s renewed popularity',
      'It provides the primary reason the novel was initially overlooked',
      'It challenges the critical reception the novel originally received',
      'It introduces evidence that the film adaptation was unsuccessful'
    ],
    answer: 'A',
    explanation: 'The phrase follows the description of readers rediscovering the novel ("Only after...did readers rediscover it"), then explains what happened as a result — a consequence. The other options misrepresent the logical relationship.',
    translation: {
      words: { acclaim: 'aclamação', obscure: 'obscuro', overshadowed: 'ofuscado', adaptation: 'adaptação', reassessment: 'reavaliação', canon: 'cânone', rediscovery: 'redescoberta' },
      passage_pt: 'Embora o romance tenha sido publicado com grande aclamação crítica nos anos 1960, permaneceu em grande parte obscuro por décadas, ofuscado pelas outras obras do autor. Somente após uma grande adaptação cinematográfica em 2015 os leitores o redescobriram — e com essa redescoberta veio uma reavaliação de seu lugar no cânone literário.',
      prompt_pt: 'Qual escolha melhor descreve a função da frase "e com essa redescoberta veio uma reavaliação de seu lugar no cânone literário"?'
    }
  },

  // ─── CRAFT & STRUCTURE — hard ────────────────────────────────────────────

  {
    id: 'rw-cs-h-001',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The historian\'s monograph was praised for its rigorous archival research, but critics noted that its interpretive framework remained _______ to traditional historiographical models, refusing to engage with the post-colonial critiques that had reshaped the field.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['beholden', 'antithetical', 'oblivious', 'peripheral'],
    answer: 'A',
    explanation: '"Beholden" means obligated or indebted to something — precisely describing a framework that remains dependent on ("refusing to break from") traditional models. "Antithetical" would mean opposed to them. "Oblivious" suggests unawareness rather than conscious reliance. "Peripheral" would mean tangentially related.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-cs-h-002',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'cross_text_connections',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'Text 1: Proponents of "slow science" argue that the pressure to publish frequently leads researchers to prioritize quantity over quality, resulting in a proliferation of incremental studies that rarely advance fundamental understanding.\n\nText 2: A longitudinal analysis of citation patterns reveals that papers produced under high-output institutional cultures tend to attract fewer citations per paper than those from lower-output environments, suggesting that productivity pressures may indeed compromise scientific impact.',
    prompt: 'How does the evidence in Text 2 function in relation to the argument made in Text 1?',
    choices: [
      'It provides empirical support for the claim that productivity pressures diminish research quality',
      'It refutes the premise that publication frequency is related to research quality',
      'It shifts the focus from individual researchers to institutional incentive structures',
      'It qualifies the argument in Text 1 by showing that the problem is limited to certain disciplines'
    ],
    answer: 'A',
    explanation: 'Text 2\'s citation data (fewer citations per paper under high-output cultures) directly supports Text 1\'s claim that pressure to publish compromises quality. The other choices mischaracterize the relationship: Text 2 doesn\'t refute, it supports; it doesn\'t narrow scope to specific disciplines; and while it does mention institutions, that\'s not its primary function relative to Text 1.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── INFORMATION & IDEAS — easy ──────────────────────────────────────────

  {
    id: 'rw-ii-e-001',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'central_ideas_and_details',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Dolphins are remarkably intelligent animals. They have been observed using tools, such as marine sponges, to protect their snouts while foraging on the seafloor. They also demonstrate self-awareness, recognizing themselves in mirrors — a trait shared by only a handful of species, including humans and great apes.',
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'Dolphins display several behaviors that indicate high intelligence',
      'Dolphins are the most intelligent animals in the ocean',
      'Tool use is the primary indicator of animal intelligence',
      'Dolphins have developed special techniques for finding food'
    ],
    answer: 'A',
    explanation: 'The text provides two examples (tool use and self-awareness) that together support the opening claim that dolphins are "remarkably intelligent." Option A correctly identifies this central idea without overstating it (B claims they are the "most" intelligent, which is not stated).',
    translation: {
      words: { remarkably: 'notavelmente', observed: 'observados', sponges: 'esponjas', protect: 'proteger', snouts: 'focinhos', foraging: 'forrageando', seafloor: 'fundo do mar', 'self-awareness': 'autoconsciência', recognizing: 'reconhecendo' },
      passage_pt: 'Golfinhos são animais notavelmente inteligentes. Foram observados usando ferramentas, como esponjas marinhas, para proteger seus focinhos enquanto forrageiam no fundo do mar. Eles também demonstram autoconsciência, reconhecendo-se em espelhos — uma característica compartilhada por apenas algumas espécies, incluindo humanos e grandes primatas.',
      prompt_pt: 'Qual escolha melhor declara a ideia principal do texto?'
    }
  },
  {
    id: 'rw-ii-e-002',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_textual',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The library introduced a new digital lending program in January. Within three months, over 2,000 residents had signed up for digital library cards. Usage of the physical library also increased during this period, as the digital program raised awareness of library services generally.',
    prompt: 'Which finding from the text most directly supports the claim that the digital program benefited the library beyond digital lending?',
    choices: [
      'Usage of the physical library also increased during this period',
      'Over 2,000 residents signed up for digital library cards',
      'The library introduced the digital lending program in January',
      'The digital program raised awareness of library services generally'
    ],
    answer: 'A',
    explanation: 'The claim is that the program benefited the library "beyond digital lending." The physical library usage increase is the most direct evidence of this — it shows benefit to the non-digital part of the library.',
    translation: {
      words: { digital: 'digital', lending: 'empréstimo', residents: 'moradores', awareness: 'conscientização', introduced: 'introduziu' },
      passage_pt: 'A biblioteca introduziu um novo programa de empréstimo digital em janeiro. Dentro de três meses, mais de 2.000 moradores se cadastraram para cartões de biblioteca digitais. O uso da biblioteca física também aumentou durante esse período, pois o programa digital aumentou a conscientização sobre os serviços da biblioteca em geral.',
      prompt_pt: 'Qual descoberta do texto apoia mais diretamente a afirmação de que o programa digital beneficiou a biblioteca além do empréstimo digital?'
    }
  },
  {
    id: 'rw-ii-e-003',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'inferences',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The city\'s new recycling bins were placed on every corner in the downtown area. In the weeks following their installation, the amount of litter collected by street-cleaning crews dropped by 40 percent.',
    prompt: 'Which conclusion is most strongly supported by the text?',
    choices: [
      'The presence of the recycling bins likely contributed to the reduction in litter',
      'Street-cleaning crews became more efficient after the bins were installed',
      'People in the downtown area were unaware of recycling before the bins arrived',
      'The city plans to expand the recycling program to other neighborhoods'
    ],
    answer: 'A',
    explanation: 'The text establishes a temporal sequence — bins placed, litter dropped — that strongly implies a causal link. The other options introduce claims (crew efficiency, prior unawareness, future expansion) not supported by the text.',
    translation: {
      words: { recycling: 'reciclagem', installation: 'instalação', litter: 'lixo', crews: 'equipes', dropped: 'caiu', presence: 'presença', contributed: 'contribuiu', reduction: 'redução' },
      passage_pt: 'As novas lixeiras de reciclagem da cidade foram colocadas em cada esquina da área central. Nas semanas após sua instalação, a quantidade de lixo coletado pelas equipes de limpeza de ruas caiu 40%.',
      prompt_pt: 'Qual conclusão é mais fortemente apoiada pelo texto?'
    }
  },

  // ─── INFORMATION & IDEAS — medium ────────────────────────────────────────

  {
    id: 'rw-ii-m-001',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_quantitative',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'A study of migratory bird populations tracked three species across a 20-year period. Species A maintained stable population levels throughout the study, with counts fluctuating no more than 5% year to year. Species B showed a steady decline, losing approximately 30% of its population over the two decades. Species C experienced dramatic fluctuations, with populations sometimes doubling then halving within a five-year span.\n\n[Table: Species B population counts at years 0, 5, 10, 15, and 20 were 10,000; 9,200; 8,400; 7,800; and 7,000 respectively]',
    prompt: 'Which of the following statements is most directly supported by the table?',
    choices: [
      'Species B\'s population decline was not uniform across all five-year periods',
      'Species B will likely reach zero population within the next decade',
      'The study underestimates the rate of decline for Species B',
      'Species B\'s population declined more rapidly than Species A\'s'
    ],
    answer: 'A',
    explanation: 'The declines were: 800 (years 0–5), 800 (5–10), 600 (10–15), 800 (15–20). The period 10–15 shows a smaller decline (600) vs. the others (~800), making the decline non-uniform. Option B extrapolates beyond data, C contradicts data, and D requires Species A data not shown.',
    translation: {
      words: { migratory: 'migratório', populations: 'populações', tracked: 'acompanhadas', species: 'espécies', stable: 'estável', fluctuating: 'flutuando', decline: 'declínio', approximately: 'aproximadamente', fluctuations: 'flutuações', dramatic: 'dramáticas' },
      passage_pt: 'Um estudo das populações de aves migratórias acompanhou três espécies por um período de 20 anos. A espécie A manteve níveis populacionais estáveis ao longo do estudo, com contagens flutuando não mais de 5% de ano para ano. A espécie B mostrou um declínio constante, perdendo aproximadamente 30% de sua população ao longo das duas décadas. A espécie C experimentou flutuações dramáticas, com populações às vezes dobrando e depois caindo pela metade em um período de cinco anos.',
      prompt_pt: 'Qual das seguintes afirmações é mais diretamente apoiada pela tabela?'
    }
  },
  {
    id: 'rw-ii-m-002',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'central_ideas_and_details',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The concept of "parasocial relationships" describes the one-sided connections people form with media figures — celebrities, athletes, or fictional characters — without any real interaction. Psychologists have found that such relationships can fulfill genuine social needs: people experiencing loneliness may turn to these figures for a sense of companionship. However, researchers caution that while these relationships are not inherently harmful, problems arise when individuals begin to prioritize them over real-world social connections.',
    prompt: 'Which choice best describes the overall structure of the text?',
    choices: [
      'It introduces a concept, explains its potential benefits, then notes a possible risk',
      'It argues that parasocial relationships are more valuable than real relationships',
      'It refutes the claim that parasocial relationships fulfill social needs',
      'It presents conflicting expert opinions about the nature of media consumption'
    ],
    answer: 'A',
    explanation: 'The text follows a three-part structure: (1) defines parasocial relationships, (2) notes they can fulfill social needs (benefit), (3) warns that prioritizing them over real connections is problematic (risk). This matches option A precisely.',
    translation: {
      words: { parasocial: 'parassocial', celebrities: 'celebridades', fictional: 'fictícios', interaction: 'interação', loneliness: 'solidão', companionship: 'companhia', inherently: 'inerentemente', prioritize: 'priorizar' },
      passage_pt: 'O conceito de "relações parassociais" descreve as conexões unilaterais que as pessoas formam com figuras da mídia — celebridades, atletas ou personagens fictícios — sem qualquer interação real. Psicólogos descobriram que tais relações podem satisfazer necessidades sociais genuínas: pessoas que experimentam solidão podem recorrer a essas figuras em busca de uma sensação de companhia. No entanto, pesquisadores alertam que, embora essas relações não sejam inerentemente prejudiciais, problemas surgem quando os indivíduos começam a priorizá-las em detrimento das conexões sociais do mundo real.',
      prompt_pt: 'Qual escolha melhor descreve a estrutura geral do texto?'
    }
  },

  // ─── INFORMATION & IDEAS — hard ──────────────────────────────────────────

  {
    id: 'rw-ii-h-001',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'inferences',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'Linguist Noam Chomsky proposed the theory of Universal Grammar (UG), which posits that humans are innately equipped with a mental framework enabling language acquisition. A key prediction of UG is that all human languages should share certain deep structural properties, regardless of surface differences. However, recent typological surveys cataloguing the structural features of over 2,500 languages have identified numerous cases where proposed universals simply do not hold — verb-subject-object word orders, for instance, occur in ways that UG-based models struggle to accommodate.',
    prompt: 'What can most reasonably be inferred from the text about the current status of Universal Grammar?',
    choices: [
      'The empirical record from large-scale typological surveys has complicated Chomsky\'s original predictions',
      'Chomsky has revised Universal Grammar to account for the word order variations identified by recent surveys',
      'Universal Grammar has been definitively refuted by typological evidence and is no longer a viable theory',
      'The structural diversity found across languages confirms that Universal Grammar applies only to phonology'
    ],
    answer: 'A',
    explanation: 'The text states that typological surveys have found "numerous cases where proposed universals simply do not hold," which complicates UG\'s predictions. Option B is not stated; option C overstates the conclusion (the text says "struggle," not "disproved"); option D introduces phonology, which is not mentioned.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── STANDARD ENGLISH CONVENTIONS — easy ─────────────────────────────────

  {
    id: 'rw-sec-e-001',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The team prepared extensively for the competition. _______ they had practiced every day for six months.',
    prompt: 'Which choice completes the text with the most appropriate punctuation and connection?',
    choices: [
      'In fact,',
      'However,',
      'Therefore,',
      'Unless'
    ],
    answer: 'A',
    explanation: '"In fact" is an additive connective that introduces emphasis or elaboration, appropriate for a sentence that provides a specific detail supporting the previous claim. "However" indicates contrast, "Therefore" indicates conclusion, and "Unless" introduces a condition — none of which fit.',
    translation: {
      words: { prepared: 'se preparou', extensively: 'extensivamente', competition: 'competição', practiced: 'praticou' },
      passage_pt: 'A equipe se preparou extensivamente para a competição. _______ eles haviam praticado todos os dias por seis meses.',
      prompt_pt: 'Qual escolha completa o texto com a pontuação e conexão mais adequadas?'
    }
  },
  {
    id: 'rw-sec-e-002',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Each of the students in the advanced class _______ required to submit a portfolio by the end of the semester.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['is', 'are', 'were', 'being'],
    answer: 'A',
    explanation: 'The subject is "Each," which is singular and requires the singular verb "is." "Are" is plural. "Were" is past tense, which contradicts the present-tense context. "Being" is non-finite and creates a fragment.',
    translation: {
      words: { required: 'obrigado', submit: 'entregar', portfolio: 'portfólio', semester: 'semestre' },
      passage_pt: 'Cada um dos alunos da turma avançada _______ obrigado a entregar um portfólio até o final do semestre.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },
  {
    id: 'rw-sec-e-003',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Maya enjoys hiking on weekends _______ her brother prefers to stay indoors and read.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      '; however,',
      ', and',
      ', because',
      '. Although'
    ],
    answer: 'A',
    explanation: 'The two clauses are independent and express a contrast. "; however," correctly joins two independent clauses while signaling contrast. ", and" joins clauses but doesn\'t signal contrast. ", because" makes the second clause a subordinate cause, which changes the meaning. ". Although" creates a sentence fragment.',
    translation: {
      words: { enjoys: 'gosta', hiking: 'caminhada', prefers: 'prefere', indoors: 'dentro de casa' },
      passage_pt: 'Maya gosta de fazer trilhas nos fins de semana _______ seu irmão prefere ficar em casa e ler.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },
  {
    id: 'rw-sec-e-004',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The researchers _______ their results at the annual conference last spring.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['presented', 'have presented', 'are presenting', 'will present'],
    answer: 'A',
    explanation: 'The time marker "last spring" indicates a specific past event, requiring simple past tense: "presented." Present perfect ("have presented") cannot be used with specific past time markers. "Are presenting" is present progressive. "Will present" is future.',
    translation: {
      words: { researchers: 'pesquisadores', results: 'resultados', annual: 'anual', conference: 'conferência', presented: 'apresentaram' },
      passage_pt: 'Os pesquisadores _______ seus resultados na conferência anual na primavera passada.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },

  // ─── STANDARD ENGLISH CONVENTIONS — medium ───────────────────────────────

  {
    id: 'rw-sec-m-001',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The documentary was praised for its detailed archival footage _______ critics noted that its narrative structure was occasionally disjointed.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      '; nevertheless,',
      ', nevertheless',
      ': nevertheless,',
      ', and nevertheless,'
    ],
    answer: 'A',
    explanation: 'Two independent clauses joined with a contrasting conjunctive adverb require a semicolon before the adverb and a comma after it: "; nevertheless,". Option B lacks the semicolon. Option C uses a colon, which is incorrect before an independent clause used contrastively. Option D is redundant.',
    translation: {
      words: { documentary: 'documentário', praised: 'elogiado', archival: 'de arquivo', footage: 'imagens', narrative: 'narrativa', occasionally: 'ocasionalmente', disjointed: 'desconexo', nevertheless: 'no entanto' },
      passage_pt: 'O documentário foi elogiado por suas detalhadas imagens de arquivo _______ os críticos observaram que sua estrutura narrativa era ocasionalmente desconexa.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },
  {
    id: 'rw-sec-m-002',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Neither the lead researcher nor the graduate students _______ been able to replicate the original findings under the new experimental conditions.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['have', 'has', 'had', 'having'],
    answer: 'A',
    explanation: 'With "Neither...nor," the verb agrees with the closest subject. The closest subject is "the graduate students" (plural), requiring "have." "Has" would be used if the closer element were singular. "Had" shifts to past perfect without indication. "Having" creates a fragment.',
    translation: {
      words: { researcher: 'pesquisador', graduate: 'pós-graduandos', replicate: 'replicar', experimental: 'experimental', conditions: 'condições', findings: 'resultados' },
      passage_pt: 'Nem a pesquisadora principal nem os pós-graduandos _______ conseguido replicar os resultados originais nas novas condições experimentais.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },
  {
    id: 'rw-sec-m-003',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Maria\'s research _______ a systematic review of over three hundred peer-reviewed articles, covered a wide range of perspectives on urban food security.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      ', which involved',
      'which involved',
      ', involving',
      'it involved'
    ],
    answer: 'A',
    explanation: '", which involved" correctly introduces a non-restrictive relative clause that provides additional information about Maria\'s research. Without the comma, "which involved" would be punctuated incorrectly. ", involving" creates an ambiguous participial phrase. "it involved" creates a run-on sentence.',
    translation: {
      words: { systematic: 'sistemática', 'peer-reviewed': 'revisados por pares', perspectives: 'perspectivas', security: 'segurança' },
      passage_pt: 'A pesquisa de Maria _______ uma revisão sistemática de mais de trezentos artigos revisados por pares, cobriu uma ampla gama de perspectivas sobre a segurança alimentar urbana.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },

  // ─── STANDARD ENGLISH CONVENTIONS — hard ─────────────────────────────────

  {
    id: 'rw-sec-h-001',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The committee\'s decision to restructure the funding allocations _______ one that several members contested vigorously, arguing that the proposed changes would disproportionately disadvantage smaller research institutions.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      'was',
      'being',
      ', which was',
      'it was'
    ],
    answer: 'A',
    explanation: '"Was" provides the main verb for the subject "The committee\'s decision," completing the sentence grammatically. "Being" creates a fragment. ", which was" would require a comma before the clause but still creates a grammatical issue without a main verb. "It was" creates a run-on by repeating the subject pronominally.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-sec-h-002',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The newly identified protein, along with the three enzymes previously described in the literature, _______ a critical role in regulating the inflammatory cascade that underlies the pathology.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['plays', 'play', 'playing', 'have played'],
    answer: 'A',
    explanation: 'The subject "The newly identified protein" is singular. "Along with the three enzymes previously described" is a prepositional phrase modifying the subject, not part of a compound subject — therefore the verb must be singular: "plays." "Play" (plural), "playing" (non-finite), and "have played" (plural present perfect) are all incorrect.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── EXPRESSION OF IDEAS — easy ──────────────────────────────────────────

  {
    id: 'rw-eoi-e-001',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'rhetorical_synthesis',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'A student is writing a paragraph about the benefits of public libraries. The student wants to emphasize that libraries serve people of all income levels. Which choice most effectively accomplishes this goal?\n\nNotes:\n- Libraries provide free access to books, internet, and other resources\n- Anyone with a library card can access all services\n- Low-income families often rely on libraries for computer access\n- Libraries host community events open to all residents',
    prompt: 'Which choice most effectively uses the notes to accomplish the student\'s goal?',
    choices: [
      'By providing free services accessible to any cardholder, libraries ensure that economic background does not limit access to information and community resources.',
      'Libraries host a variety of community events that bring residents together for educational and recreational activities.',
      'Public libraries have expanded their collections significantly in recent decades to include digital media and online databases.',
      'Many residents visit their local library multiple times per week to take advantage of the quiet study spaces available.'
    ],
    answer: 'A',
    explanation: 'Option A directly addresses the goal — emphasizing that libraries serve people of all income levels — by combining the "free services" and "any cardholder" notes. The other options focus on events, collection expansion, or study spaces, none of which directly address economic inclusivity.',
    translation: {
      words: { emphasize: 'enfatizar', income: 'renda', accessible: 'acessível', cardholder: 'portador de cartão', economic: 'econômico', background: 'origem' },
      passage_pt: 'Um estudante está escrevendo um parágrafo sobre os benefícios das bibliotecas públicas e quer enfatizar que as bibliotecas atendem pessoas de todos os níveis de renda.',
      prompt_pt: 'Qual escolha usa mais efetivamente as notas para alcançar o objetivo do estudante?'
    }
  },
  {
    id: 'rw-eoi-e-002',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The new park design included several innovative features. _______, a network of walking paths connected each section of the park, making it easy for visitors to explore the entire space.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: [
      'For example,',
      'In contrast,',
      'As a result,',
      'Nevertheless,'
    ],
    answer: 'A',
    explanation: '"For example" introduces a specific instance of the "several innovative features" mentioned in the first sentence, making it the logical transition. "In contrast" signals opposition. "As a result" signals consequence. "Nevertheless" signals concession — none of these fit the additive/exemplifying relationship.',
    translation: {
      words: { innovative: 'inovador', network: 'rede', walking: 'caminhada', paths: 'caminhos', connected: 'conectou', explore: 'explorar' },
      passage_pt: 'O novo design do parque incluiu vários recursos inovadores. _______, uma rede de trilhas conectou cada seção do parque, facilitando para os visitantes explorar todo o espaço.',
      prompt_pt: 'Qual escolha completa o texto com a transição mais lógica?'
    }
  },

  // ─── EXPRESSION OF IDEAS — medium ────────────────────────────────────────

  {
    id: 'rw-eoi-m-001',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Early studies suggested that caffeine was harmful to cardiovascular health. _______, a body of more recent research has found that moderate caffeine consumption is not only benign but may even offer protective effects for the heart.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: [
      'However,',
      'Furthermore,',
      'Similarly,',
      'Thus,'
    ],
    answer: 'A',
    explanation: 'The second sentence presents a finding that directly contradicts the first ("harmful" vs. "benign" or "protective"), requiring a contrastive transition. "However" signals this contrast. "Furthermore" adds information, "Similarly" draws a parallel, and "Thus" signals a logical consequence — none fit a reversal.',
    translation: {
      words: { caffeine: 'cafeína', cardiovascular: 'cardiovascular', moderate: 'moderado', consumption: 'consumo', benign: 'benigno', protective: 'protetor', furthermore: 'além disso', similarly: 'similarmente' },
      passage_pt: 'Estudos iniciais sugeriram que a cafeína era prejudicial à saúde cardiovascular. _______, um conjunto de pesquisas mais recentes descobriu que o consumo moderado de cafeína não é apenas benigno, mas pode até oferecer efeitos protetores para o coração.',
      prompt_pt: 'Qual escolha completa o texto com a transição mais lógica?'
    }
  },
  {
    id: 'rw-eoi-m-002',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'rhetorical_synthesis',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'A writer is composing an essay arguing that remote work policies benefit employers. The writer wants to introduce a counterargument and then refute it. Which of the following options best accomplishes this goal?\n\nNotes:\n- Remote workers report higher job satisfaction\n- Some managers worry that remote work reduces team cohesion\n- Studies show remote employees maintain or exceed productivity benchmarks\n- Companies save on office overhead costs with remote arrangements',
    prompt: 'Which choice most effectively accomplishes the writer\'s goal?',
    choices: [
      'While some managers worry that remote work fragments team dynamics, productivity data consistently shows that remote employees meet or exceed in-office performance benchmarks.',
      'Remote workers consistently report higher job satisfaction than their in-office counterparts, suggesting that remote arrangements improve overall morale.',
      'Companies that adopt remote work policies can significantly reduce overhead costs, increasing profitability without sacrificing output.',
      'Studies of remote work arrangements have found numerous benefits for both employers and employees across various industries.'
    ],
    answer: 'A',
    explanation: 'Option A introduces the counterargument (managers worry about team cohesion) and then refutes it with evidence (productivity data). This matches the stated goal exactly. Options B, C, and D present benefits without addressing any counterargument.',
    translation: {
      words: { counterargument: 'contra-argumento', refute: 'refutar', cohesion: 'coesão', benchmarks: 'parâmetros', overhead: 'custos operacionais', productivity: 'produtividade', fragments: 'fragmenta' },
      passage_pt: 'Um escritor está compondo um ensaio argumentando que as políticas de trabalho remoto beneficiam os empregadores. O escritor quer introduzir um contra-argumento e depois refutá-lo.',
      prompt_pt: 'Qual escolha cumpre mais efetivamente o objetivo do escritor?'
    }
  },

  // ─── EXPRESSION OF IDEAS — hard ──────────────────────────────────────────

  {
    id: 'rw-eoi-h-001',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'Many economists contend that carbon taxes are the most efficient mechanism for reducing greenhouse gas emissions, as they create direct price signals that incentivize firms to internalize environmental costs. _______, implementation has proven politically challenging in numerous jurisdictions, where industries subject to the tax lobby vigorously against its adoption, often successfully.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: [
      'In practice, however,',
      'As a consequence,',
      'In addition,',
      'To illustrate,'
    ],
    answer: 'A',
    explanation: '"In practice, however," signals both a shift from theory to application ("in practice") and a contrast between the theoretical efficiency and the political difficulty ("however"). "As a consequence" would suggest the political difficulty is a result of the efficiency claim. "In addition" adds more supporting info. "To illustrate" introduces an example.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-eoi-h-002',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'rhetorical_synthesis',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'A scholar is writing an article examining the reliability of oral histories as primary sources. The scholar wants to acknowledge a legitimate methodological concern while arguing that oral histories remain valuable despite it. Which of the following best accomplishes this?\n\nNotes:\n- Oral histories are subject to memory distortion and retrospective bias\n- They preserve perspectives absent from official archives\n- Triangulation with documentary sources can mitigate reliability concerns\n- They capture emotional and cultural dimensions inaccessible in written records',
    prompt: 'Which choice most effectively accomplishes the scholar\'s goal?',
    choices: [
      'Although oral histories are susceptible to memory distortion, their capacity to preserve marginalized perspectives and capture experiential dimensions absent from official records makes them indispensable to comprehensive historical scholarship.',
      'Oral histories should be treated with caution, as retrospective bias can significantly distort the accuracy of individual recollections over time.',
      'Scholars who use oral histories must triangulate their findings with documentary evidence to compensate for the inherent unreliability of personal memory.',
      'Oral histories provide unique access to the emotional and cultural dimensions of historical experience that no other primary source can fully replicate.'
    ],
    answer: 'A',
    explanation: 'Option A acknowledges the concern (memory distortion) with "Although" then argues for the value (preserves marginalized perspectives, captures experiential dimensions) using notes from both columns. Options B and C focus only on the limitation or mitigation. Option D argues for value without acknowledging the concern.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── More RW questions to reach a fuller bank ────────────────────────────

  {
    id: 'rw-cs-e-005',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The young athlete was known for her _______ approach to training — she arrived first and left last, never missing a single practice session during the entire season.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['diligent', 'casual', 'erratic', 'reluctant'],
    answer: 'A',
    explanation: '"Diligent" means hardworking and dedicated, which fits arriving first, leaving last, and never missing practice. The other options contradict this behavior.',
    translation: {
      words: { athlete: 'atleta', approach: 'abordagem', training: 'treinamento', diligent: 'diligente', casual: 'casual', erratic: 'errático', reluctant: 'relutante', missing: 'faltando', session: 'sessão' },
      passage_pt: 'A jovem atleta era conhecida por sua abordagem _______ ao treinamento — ela chegava primeiro e saía por último, nunca faltando uma única sessão de prática durante toda a temporada.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?'
    }
  },
  {
    id: 'rw-ii-e-004',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'central_ideas_and_details',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Coffee plants thrive in what is known as the "coffee belt" — a band of tropical and subtropical regions located roughly between the Tropics of Cancer and Capricorn. The warm temperatures, abundant rainfall, and high altitudes found in countries like Ethiopia, Colombia, and Vietnam create ideal growing conditions for the coffee plant.',
    prompt: 'According to the text, which of the following best explains why the "coffee belt" is suitable for growing coffee?',
    choices: [
      'The region provides the specific combination of temperature, rainfall, and altitude that coffee plants require',
      'Countries in the coffee belt have the largest populations of coffee drinkers',
      'The coffee belt includes the most fertile agricultural land on Earth',
      'Coffee plants can only grow at altitudes above 2,000 meters'
    ],
    answer: 'A',
    explanation: 'The text explicitly states that "warm temperatures, abundant rainfall, and high altitudes... create ideal growing conditions." Option A accurately summarizes this. The other options introduce claims not present in the text.',
    translation: {
      words: { tropical: 'tropical', subtropical: 'subtropical', altitude: 'altitude', abundant: 'abundante', rainfall: 'chuva', suitable: 'adequada', fertile: 'fértil' },
      passage_pt: 'As plantas de café prosperam no que é conhecido como o "cinturão do café" — uma faixa de regiões tropicais e subtropicais localizada aproximadamente entre os Trópicos de Câncer e Capricórnio. As temperaturas quentes, a abundante chuva e as altas altitudes encontradas em países como Etiópia, Colômbia e Vietnã criam condições ideais de cultivo para a planta do café.',
      prompt_pt: 'De acordo com o texto, qual das seguintes opções melhor explica por que o "cinturão do café" é adequado para o cultivo do café?'
    }
  },
  {
    id: 'rw-sec-e-005',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The concert was sold out months in advance _______ demand for tickets was overwhelming.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      '; the',
      '; however, the',
      ', so the',
      'but the'
    ],
    answer: 'A',
    explanation: 'The second clause ("demand for tickets was overwhelming") explains the first. A semicolon correctly joins two independent clauses without a conjunction. Option C also works grammatically but option A is cleaner. Option B adds unnecessary contrast. Option D requires a comma before "but."',
    translation: {
      words: { sold: 'esgotado', months: 'meses', advance: 'antecedência', overwhelming: 'avassaladora' },
      passage_pt: 'O concerto foi esgotado meses antes _______ a demanda por ingressos era avassaladora.',
      prompt_pt: 'Qual escolha completa o texto de forma que esteja em conformidade com as convenções do inglês padrão?'
    }
  },
  {
    id: 'rw-eoi-e-003',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Many scientists initially dismissed the theory. _______, subsequent experiments produced results that were impossible to explain without it, forcing even the theory\'s harshest critics to reconsider.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: [
      'Over time, however,',
      'As a result,',
      'For instance,',
      'Similarly,'
    ],
    answer: 'A',
    explanation: '"Over time, however" signals both a temporal progression and a contrast with the initial dismissal. The second sentence contradicts the first (dismissal → reconsideration), requiring a contrastive connective. "As a result" implies causation, "for instance" introduces an example, "similarly" indicates comparison.',
    translation: {
      words: { initially: 'inicialmente', dismissed: 'descartaram', subsequent: 'subsequentes', experiments: 'experimentos', impossible: 'impossível', reconsider: 'reconsiderar', harshest: 'mais severos', critics: 'críticos' },
      passage_pt: 'Muitos cientistas inicialmente descartaram a teoria. _______, experimentos subsequentes produziram resultados impossíveis de explicar sem ela, forçando até os críticos mais severos da teoria a reconsiderar.',
      prompt_pt: 'Qual escolha completa o texto com a transição mais lógica?'
    }
  },

  // More medium/hard RW questions

  {
    id: 'rw-cs-m-004',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The author\'s use of fragmented sentences throughout the novel was _______ — rather than reflecting stylistic carelessness, each break served to mirror the protagonist\'s deteriorating psychological state.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['deliberate', 'accidental', 'inconsistent', 'conventional'],
    answer: 'A',
    explanation: '"Deliberate" means intentional, which aligns with the claim that each break "served to mirror" something — a purposeful artistic choice. "Accidental" is the opposite. "Inconsistent" suggests variation without purpose. "Conventional" implies the technique was typical rather than specifically intentional.',
    translation: {
      words: { fragmented: 'fragmentadas', carelessness: 'descuido', protagonist: 'protagonista', deteriorating: 'deteriorando', psychological: 'psicológico', deliberate: 'deliberado', inconsistent: 'inconsistente', conventional: 'convencional' },
      passage_pt: 'O uso de frases fragmentadas pelo autor ao longo do romance era _______ — em vez de refletir descuido estilístico, cada quebra servia para espelhar o estado psicológico em deterioração do protagonista.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?'
    }
  },
  {
    id: 'rw-ii-m-003',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_textual',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Researchers studying ancient Roman trade networks have found that a single type of ceramic vessel — the amphora — can tell us a great deal about economic patterns. Because amphoras were used to transport goods like olive oil and wine, and because their clay composition is traceable to specific production regions, archaeologists can map trade routes by analyzing where different amphora types appear in the archaeological record. This has revealed that Rome\'s trading relationships extended far beyond the Mediterranean, reaching into northern Europe and sub-Saharan Africa.',
    prompt: 'Which quote from the text most directly supports the claim that amphoras are useful for reconstructing ancient trade patterns?',
    choices: [
      '"their clay composition is traceable to specific production regions"',
      '"a single type of ceramic vessel — the amphora"',
      '"Rome\'s trading relationships extended far beyond the Mediterranean"',
      '"Researchers studying ancient Roman trade networks"'
    ],
    answer: 'A',
    explanation: 'The claim is about why amphoras are useful for tracing trade. The traceability of clay composition to specific regions is the mechanism that makes this possible — it enables archaeologists to follow the vessels\' origins. The other quotes either just identify the vessel or state a conclusion, not the mechanism.',
    translation: {
      words: { amphora: 'ânfora', ceramic: 'cerâmica', traceable: 'rastreável', composition: 'composição', archaeologists: 'arqueólogos', archaeological: 'arqueológico', Mediterranean: 'Mediterrâneo', networks: 'redes' },
      passage_pt: 'Pesquisadores que estudam redes comerciais da Roma antiga descobriram que um único tipo de recipiente cerâmico — a ânfora — pode nos dizer muito sobre padrões econômicos. Como as ânforas eram usadas para transportar bens como azeite e vinho, e porque sua composição de argila é rastreável a regiões de produção específicas, os arqueólogos podem mapear rotas comerciais analisando onde diferentes tipos de ânforas aparecem no registro arqueológico.',
      prompt_pt: 'Qual citação do texto apoia mais diretamente a afirmação de que as ânforas são úteis para reconstruir padrões comerciais antigos?'
    }
  },
  {
    id: 'rw-cs-h-003',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'text_structure_and_purpose',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The novelist Chimamanda Ngozi Adichie delivered a TED talk in 2009 titled "The Danger of a Single Story." In it, she argued that when people are exposed to only one narrative about a particular place or group — what she called a "single story" — they risk developing a dangerously incomplete understanding of that place or group. Crucially, Adichie\'s concern was not merely that single stories omit positive aspects of a subject; rather, she contended that any singular, totalizing narrative — whether ostensibly positive or negative — flattens the rich complexity and internal diversity that characterize any human community.',
    prompt: 'The primary purpose of the final sentence is to:',
    choices: [
      'Clarify that Adichie\'s critique applies not only to negative stereotypes but to any reductive narrative',
      'Refute the premise that single stories are always associated with negative portrayals',
      'Introduce a new argument that contradicts Adichie\'s original claim',
      'Provide an example of a positive single story that Adichie found acceptable'
    ],
    answer: 'A',
    explanation: 'The sentence begins with "Crucially" and introduces a refinement: Adichie\'s concern isn\'t just about negative stories but about any totalizing narrative — positive OR negative. This clarifies the scope of her argument, preventing a common misreading. Option B mischaracterizes refutation. Option C is wrong (the sentence elaborates, not contradicts). Option D is unsupported.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-ii-h-002',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_quantitative',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'A public health study examined the relationship between urban green space coverage and rates of anxiety disorders across 50 cities. Cities were categorized into three groups based on green space coverage: low (<10% of urban area), medium (10–25%), and high (>25%). The study found that cities in the high coverage group had a mean anxiety disorder prevalence of 12.3%, compared to 15.8% for medium-coverage cities and 19.1% for low-coverage cities.\n\n[Footnote: These figures represent age-standardized prevalence rates per 100 residents]',
    prompt: 'A researcher claims that "reducing green space coverage below 10% would dramatically worsen mental health outcomes." Which of the following best evaluates this claim based on the data?',
    choices: [
      'The claim goes beyond what the data support, since the study only compares existing categories and cannot establish what would happen below the low-coverage threshold',
      'The claim is fully supported because the data show a clear negative correlation between green space and anxiety',
      'The claim is unsupported because the data show no statistically significant difference between coverage groups',
      'The claim is confirmed by the observation that low-coverage cities have the highest anxiety rates in the study'
    ],
    answer: 'A',
    explanation: 'The data compare three categories of cities as they currently exist — it cannot tell us what would happen if coverage fell further below 10%, because no such cities appear in the dataset. This is an extrapolation beyond the data. Option B overstates support for a claim about going below the threshold. Option C misreads the data (there are clear differences). Option D conflates confirming a trend with confirming a specific hypothetical intervention.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPANSION BATCH 1 — +20 original questions (all domains, all difficulties)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── CRAFT & STRUCTURE ─────────────────────────────────────────────────────
  {
    id: 'rw-cs-e-201',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'The coach was known for being _______ with praise; she complimented her players only when they truly earned it, which made her rare words of encouragement especially meaningful.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['sparing', 'generous', 'reckless', 'confused'],
    answer: 'A',
    explanation: '"Sparing" means giving or using only a little of something. The clue "only when they truly earned it" and "rare words" shows the coach praised infrequently. "Generous" is the opposite; "reckless" and "confused" do not fit.',
    translation: {
      words: { coach: 'treinadora', praise: 'elogio', complimented: 'elogiava', earned: 'mereciam', rare: 'raras', encouragement: 'incentivo', meaningful: 'significativas', sparing: 'parcimoniosa', generous: 'generosa', reckless: 'imprudente' },
      passage_pt: 'A treinadora era conhecida por ser _______ com elogios; ela elogiava suas jogadoras apenas quando realmente mereciam, o que tornava suas raras palavras de incentivo especialmente significativas.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?',
      choices_pt: ['parcimoniosa', 'generosa', 'imprudente', 'confusa']
    }
  },
  {
    id: 'rw-cs-m-201',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: "Although the senator's proposal was initially met with skepticism, her _______ presentation of the data gradually won over even her most vocal critics.",
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['cogent', 'tedious', 'evasive', 'careless'],
    answer: 'A',
    explanation: '"Cogent" means clear, logical, and convincing — exactly what would win over skeptical critics. "Tedious," "evasive," and "careless" are all negative and would not persuade anyone.',
    translation: {
      words: { senator: 'senadora', proposal: 'proposta', skepticism: 'ceticismo', gradually: 'gradualmente', vocal: 'ferrenhos', critics: 'críticos', cogent: 'convincente', tedious: 'tediosa', evasive: 'evasiva', careless: 'descuidada' },
      passage_pt: 'Embora a proposta da senadora tenha sido inicialmente recebida com ceticismo, sua apresentação _______ dos dados gradualmente conquistou até seus críticos mais ferrenhos.',
      prompt_pt: 'Qual escolha completa o texto com a palavra ou frase mais lógica e precisa?',
      choices_pt: ['convincente', 'tediosa', 'evasiva', 'descuidada']
    }
  },
  {
    id: 'rw-cs-m-202',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'text_structure_and_purpose',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Marine biologist Dr. Elena Ruiz begins her lecture not with statistics about coral decline, but with a vivid description of a thriving reef she explored as a child. Only after her audience is immersed in this image does she reveal that the reef no longer exists.',
    prompt: 'What is the main rhetorical effect of how Dr. Ruiz structures the opening of her lecture?',
    choices: [
      'It builds an emotional connection before revealing a loss, making the information that follows more impactful',
      'It downplays the seriousness of coral decline by focusing on positive memories',
      'It suggests that statistics are always less reliable than personal experience',
      'It implies that the audience is already expert in marine biology'
    ],
    answer: 'A',
    explanation: 'Ruiz first immerses the audience in a vivid, positive image and only then reveals the reef is gone — priming an emotional response that makes the loss (and any data to come) hit harder. The other choices misread her purpose.',
    translation: {
      words: { lecture: 'palestra', decline: 'declínio', vivid: 'vívida', thriving: 'próspero', reef: 'recife', immersed: 'imersa', reveal: 'revelar' },
      passage_pt: 'A bióloga marinha Dra. Elena Ruiz começa sua palestra não com estatísticas sobre o declínio dos corais, mas com uma descrição vívida de um recife próspero que explorou quando criança. Só depois que a plateia está imersa nessa imagem ela revela que o recife não existe mais.',
      prompt_pt: 'Qual é o principal efeito retórico do modo como a Dra. Ruiz estrutura a abertura de sua palestra?',
      choices_pt: [
        'Cria uma conexão emocional antes de revelar uma perda, tornando a informação seguinte mais impactante',
        'Minimiza a gravidade do declínio dos corais ao focar em memórias positivas',
        'Sugere que estatísticas são sempre menos confiáveis que a experiência pessoal',
        'Implica que a plateia já é especialista em biologia marinha'
      ]
    }
  },
  {
    id: 'rw-cs-h-201',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'cross_text_connections',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: "Text 1: Economist Adam Smith argued that individuals pursuing their own self-interest are, as if guided by an \"invisible hand,\" led to promote the good of society as a whole.\n\nText 2: Behavioral economists have complicated this view, demonstrating that individuals frequently act against their own long-term interests — over-borrowing, under-saving — in ways that can destabilize the very markets Smith believed self-interest would optimize.",
    prompt: "Based on the texts, how would the behavioral economists in Text 2 most likely respond to Smith's argument in Text 1?",
    choices: [
      "They would argue that Smith's model underestimates how often individuals fail to act in their own rational self-interest",
      "They would fully endorse Smith's claim that self-interest reliably benefits society",
      'They would contend that markets cannot function at all without strict government control',
      'They would argue that human self-interest does not actually exist'
    ],
    answer: 'A',
    explanation: 'Text 2 shows people often act against their long-term interests, undermining Smith\'s premise that self-interest reliably optimizes markets. So behavioral economists would say Smith underestimates human irrationality. B contradicts Text 2; C and D overstate claims the text never makes.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-cs-h-202',
    section: 'reading_writing',
    domain: 'craft_and_structure',
    skill: 'words_in_context',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The critic praised the memoir for its _______ tone: the author neither wallows in self-pity nor minimizes her suffering, but instead recounts her hardships with an almost clinical detachment that paradoxically heightens their emotional weight.',
    prompt: 'Which choice completes the text with the most logical and precise word or phrase?',
    choices: ['dispassionate', 'melodramatic', 'indignant', 'effusive'],
    answer: 'A',
    explanation: '"Dispassionate" means calm and unemotional — it matches "clinical detachment" and the author neither wallowing nor minimizing. "Melodramatic" and "effusive" mean overly emotional (the opposite); "indignant" means angry, which the passage rules out.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── INFORMATION & IDEAS ───────────────────────────────────────────────────
  {
    id: 'rw-ii-m-201',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'central_ideas_and_details',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The Antikythera mechanism, recovered from an ancient shipwreck in 1901, is an intricate bronze device of interlocking gears. For decades its purpose baffled researchers. Modern imaging has now revealed that it was an astronomical calculator, able to predict the positions of the sun, moon, and planets — a level of mechanical sophistication not seen again in Europe for over a thousand years.',
    prompt: 'Which choice best states the main idea of the text?',
    choices: [
      'A long-mysterious ancient device has been identified as a remarkably advanced astronomical calculator',
      'The Antikythera mechanism was recovered from a shipwreck in 1901',
      'Modern imaging technology has a wide range of uses in archaeology',
      'Ancient European engineers were more skilled than modern ones'
    ],
    answer: 'A',
    explanation: 'The passage builds to the revelation that this once-baffling device is a surprisingly advanced astronomical calculator — that is the central idea. B is a supporting detail, C is too broad, and D is an unsupported overstatement.',
    translation: {
      words: { recovered: 'recuperado', shipwreck: 'naufrágio', intricate: 'intrincado', gears: 'engrenagens', baffled: 'intrigou', imaging: 'imageamento', sophistication: 'sofisticação' },
      passage_pt: 'O mecanismo de Antikythera, recuperado de um antigo naufrágio em 1901, é um intrincado dispositivo de bronze com engrenagens interligadas. Por décadas, seu propósito intrigou os pesquisadores. O imageamento moderno revelou agora que era uma calculadora astronômica, capaz de prever as posições do sol, da lua e dos planetas — um nível de sofisticação mecânica não visto novamente na Europa por mais de mil anos.',
      prompt_pt: 'Qual escolha melhor expressa a ideia principal do texto?',
      choices_pt: [
        'Um dispositivo antigo, por muito tempo misterioso, foi identificado como uma calculadora astronômica notavelmente avançada',
        'O mecanismo de Antikythera foi recuperado de um naufrágio em 1901',
        'A tecnologia moderna de imageamento tem muitos usos na arqueologia',
        'Os engenheiros europeus antigos eram mais habilidosos que os modernos'
      ]
    }
  },
  {
    id: 'rw-ii-m-202',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_textual',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'A student hypothesizes that adding a small amount of salt to water before boiling significantly raises the water\'s boiling temperature, dramatically speeding up cooking.',
    prompt: "Which finding, if true, would most directly weaken the student's hypothesis?",
    choices: [
      "Adding the typical amount of salt used in cooking raises water's boiling point by only a fraction of a degree",
      'Salt water tastes noticeably different from fresh water',
      'Salt dissolves more quickly in hot water than in cold water',
      'Many professional chefs add salt to their pasta water'
    ],
    answer: 'A',
    explanation: 'The hypothesis claims a *significant* rise in boiling temperature. A shows the rise is negligible, directly undercutting that claim. The other options are about taste, dissolving rate, or chef habits — none addresses the temperature claim.',
    translation: {
      words: { hypothesizes: 'levanta a hipótese', boiling: 'fervura', significantly: 'significativamente', raises: 'eleva', dramatically: 'drasticamente', weaken: 'enfraquecer', fraction: 'fração' },
      passage_pt: 'Um estudante levanta a hipótese de que adicionar uma pequena quantidade de sal à água antes de ferver eleva significativamente a temperatura de fervura, acelerando drasticamente o cozimento.',
      prompt_pt: 'Qual descoberta, se verdadeira, enfraqueceria mais diretamente a hipótese do estudante?',
      choices_pt: [
        'Adicionar a quantidade típica de sal usada na culinária eleva o ponto de fervura em apenas uma fração de grau',
        'A água salgada tem sabor perceptivelmente diferente da água doce',
        'O sal se dissolve mais rápido em água quente do que em água fria',
        'Muitos chefs profissionais adicionam sal à água do macarrão'
      ]
    }
  },
  {
    id: 'rw-ii-m-203',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'inferences',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'Unlike most owls, which hunt at night, the burrowing owl is frequently active during daylight hours. This species also nests underground, often in burrows abandoned by prairie dogs, rather than in trees.',
    prompt: 'Which choice most logically completes the text? The burrowing owl, therefore, differs from typical owls in both its _______',
    choices: [
      'timing of activity and choice of nesting site.',
      'diet and migration patterns.',
      'wingspan and feather coloration.',
      'average lifespan and hunting technique.'
    ],
    answer: 'A',
    explanation: 'The passage gives exactly two contrasts with typical owls: being active by day (timing of activity) and nesting underground (nesting site). The other options name traits the text never discusses.',
    translation: {
      words: { owls: 'corujas', hunt: 'caçam', burrowing: 'cavadora', daylight: 'luz do dia', nests: 'faz ninho', underground: 'subterrâneo', burrows: 'tocas', abandoned: 'abandonadas' },
      passage_pt: 'Diferentemente da maioria das corujas, que caçam à noite, a coruja-buraqueira é frequentemente ativa durante o dia. Essa espécie também faz ninho no subsolo, muitas vezes em tocas abandonadas por cães-da-pradaria, em vez de em árvores.',
      prompt_pt: 'Qual escolha completa o texto de forma mais lógica? A coruja-buraqueira, portanto, difere das corujas típicas tanto em seu _______',
      choices_pt: [
        'horário de atividade quanto na escolha do local do ninho.',
        'dieta quanto nos padrões de migração.',
        'envergadura quanto na coloração das penas.',
        'expectativa de vida quanto na técnica de caça.'
      ]
    }
  },
  {
    id: 'rw-ii-h-201',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'command_of_evidence_quantitative',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'A study tracked reading comprehension scores of students who read either on paper or on screens. On average, paper readers scored 8 percent higher on tests of deep comprehension, but the two groups performed nearly identically on tests of simple fact retrieval.',
    prompt: 'Which statement is best supported by the data?',
    choices: [
      'The advantage of paper reading appears specific to deeper comprehension rather than to basic recall',
      'Reading on screens harms every form of comprehension',
      'Students who read on paper are generally more intelligent',
      'Simple fact retrieval matters more than deep comprehension'
    ],
    answer: 'A',
    explanation: 'Paper readers led only on deep comprehension and tied on fact retrieval, so any advantage is specific to deep comprehension. B overstates (no harm shown on recall), while C and D draw conclusions the data do not support.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-ii-h-202',
    section: 'reading_writing',
    domain: 'information_and_ideas',
    skill: 'inferences',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'The fossil record shows that the ancestors of modern whales were four-legged land mammals. Over millions of years their forelimbs became flippers, their hind limbs all but disappeared, and their nostrils migrated to the top of the head as blowholes. Yet modern whale embryos still briefly develop tiny hind-limb buds before reabsorbing them.',
    prompt: 'The detail about whale embryos developing hind-limb buds most strongly suggests that',
    choices: [
      "a species' evolutionary history can leave traces in its development even after the related structures vanish in adults",
      'modern whales will eventually regrow functional hind limbs',
      'whale embryos are physically identical to those of land mammals',
      'the fossil record of whales is unreliable'
    ],
    answer: 'A',
    explanation: 'Embryos briefly forming structures that adults no longer have is evidence that developmental stages can preserve ancestral features. B is an unwarranted prediction, C overstates "identical," and D contradicts the passage, which treats the fossil record as informative.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── STANDARD ENGLISH CONVENTIONS ──────────────────────────────────────────
  {
    id: 'rw-sec-e-201',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: "By the end of the season, the young striker had scored fifteen goals _______ she was named the league's most valuable player.",
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [', and', ', ', ' ', ' and'],
    answer: 'A',
    explanation: 'Two independent clauses ("the striker had scored fifteen goals" and "she was named MVP") must be joined by a comma plus a coordinating conjunction: ", and". A bare comma is a comma splice, a space is a run-on, and "and" without a comma is nonstandard here.',
    translation: {
      words: { season: 'temporada', striker: 'atacante', scored: 'marcou', goals: 'gols', named: 'nomeada', league: 'liga', valuable: 'valiosa' },
      passage_pt: 'Ao fim da temporada, a jovem atacante havia marcado quinze gols _______ ela foi nomeada a jogadora mais valiosa da liga.',
      prompt_pt: 'Qual escolha completa o texto de acordo com as convenções do inglês padrão?',
      choices_pt: [', and (vírgula + conjunção)', ', (só vírgula)', ' (espaço/sem pontuação)', ' and (sem vírgula)']
    }
  },
  {
    id: 'rw-sec-m-201',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The collection of rare coins, accumulated over three generations by the Moreau family, _______ now on display at the national museum.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['is', 'are', 'were', 'being'],
    answer: 'A',
    explanation: 'The subject is "collection," which is singular, so the verb must be "is." The plural "coins" sits inside a prepositional phrase and does not control the verb. "Being" is not a finite verb.',
    translation: {
      words: { collection: 'coleção', rare: 'raras', coins: 'moedas', accumulated: 'acumulada', generations: 'gerações', display: 'exposição', museum: 'museu' },
      passage_pt: 'A coleção de moedas raras, acumulada ao longo de três gerações pela família Moreau, _______ agora em exposição no museu nacional.',
      prompt_pt: 'Qual escolha completa o texto de acordo com as convenções do inglês padrão?',
      choices_pt: ['is (está – singular)', 'are (estão – plural)', 'were (estavam)', 'being (gerúndio)']
    }
  },
  {
    id: 'rw-sec-m-202',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The recipe calls for three uncommon ingredients _______ saffron, star anise, and dried lime.',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [':', ';', ', and', '— and'],
    answer: 'A',
    explanation: 'A colon correctly introduces a list after a complete independent clause. A semicolon would need a second independent clause, and ", and" or "— and" are nonstandard for introducing this list.',
    translation: {
      words: { recipe: 'receita', calls: 'pede', uncommon: 'incomuns', ingredients: 'ingredientes', saffron: 'açafrão', anise: 'anis', dried: 'seca', lime: 'limão' },
      passage_pt: 'A receita pede três ingredientes incomuns _______ açafrão, anis-estrelado e limão seco.',
      prompt_pt: 'Qual escolha completa o texto de acordo com as convenções do inglês padrão?',
      choices_pt: [': (dois-pontos)', '; (ponto e vírgula)', ', and', '— and']
    }
  },
  {
    id: 'rw-sec-h-201',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'form_structure_and_sense',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'Having studied the migratory patterns of monarch butterflies for over a decade, _______',
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: [
      'the entomologist could predict their arrival within days.',
      'the arrival of the butterflies could be predicted within days.',
      'it was possible to predict their arrival within days.',
      'their arrival could be predicted within days.'
    ],
    answer: 'A',
    explanation: 'The introductory participial phrase "Having studied…" must modify the person who did the studying. Only "the entomologist" can logically follow the comma; the other options create a dangling modifier by attaching the phrase to "arrival," "it," or "their arrival".',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-sec-h-202',
    section: 'reading_writing',
    domain: 'standard_english_conventions',
    skill: 'sentence_boundaries',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: "The novel was rejected by twelve publishers _______ it went on to win the nation's most prestigious literary award and to sell millions of copies.",
    prompt: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    choices: ['; nevertheless,', ', nevertheless', ' nevertheless', '; nevertheless'],
    answer: 'A',
    explanation: '"Nevertheless" is a conjunctive adverb linking two independent clauses, so it needs a semicolon before it and a comma after it: "; nevertheless,". A bare comma creates a comma splice, and the other options omit required punctuation.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },

  // ─── EXPRESSION OF IDEAS ───────────────────────────────────────────────────
  {
    id: 'rw-eoi-e-201',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: 'Most cacti store water in their thick stems to survive long droughts. _______ some desert plants survive by growing extremely long roots that reach deep underground water.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['By contrast,', 'For example,', 'As a result,', 'In conclusion,'],
    answer: 'A',
    explanation: 'The second sentence describes a *different* survival strategy, so a contrast transition is needed. "For example" would signal an instance of the same idea, "As a result" signals cause-effect, and "In conclusion" signals a summary.',
    translation: {
      words: { cacti: 'cactos', store: 'armazenam', stems: 'caules', droughts: 'secas', roots: 'raízes', reach: 'alcançam', underground: 'subterrânea' },
      passage_pt: 'A maioria dos cactos armazena água em seus caules grossos para sobreviver a longas secas. _______ algumas plantas do deserto sobrevivem desenvolvendo raízes extremamente longas que alcançam a água subterrânea profunda.',
      prompt_pt: 'Qual escolha completa o texto com a transição mais lógica?',
      choices_pt: ['By contrast, (Em contraste,)', 'For example, (Por exemplo,)', 'As a result, (Como resultado,)', 'In conclusion, (Em conclusão,)']
    }
  },
  {
    id: 'rw-eoi-m-201',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: "The new tutoring program was expensive to run and required dozens of volunteers. _______ it raised participating students' average test scores by nearly 20 percent, a result administrators called well worth the cost.",
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Nonetheless,', 'Therefore,', 'Likewise,', 'For instance,'],
    answer: 'A',
    explanation: 'There is a contrast between the program\'s high cost and its worthwhile benefit, so a concessive transition like "Nonetheless" fits. "Therefore" signals a result, "Likewise" a similarity, and "For instance" an example.',
    translation: {
      words: { tutoring: 'reforço/tutoria', expensive: 'cara', required: 'exigia', volunteers: 'voluntários', raised: 'elevou', scores: 'notas', administrators: 'administradores' },
      passage_pt: 'O novo programa de tutoria era caro de operar e exigia dezenas de voluntários. _______ ele elevou as notas médias dos alunos participantes em quase 20 por cento, um resultado que os administradores consideraram valer o custo.',
      prompt_pt: 'Qual escolha completa o texto com a transição mais lógica?',
      choices_pt: ['Nonetheless, (Ainda assim,)', 'Therefore, (Portanto,)', 'Likewise, (Da mesma forma,)', 'For instance, (Por exemplo,)']
    }
  },
  {
    id: 'rw-eoi-m-202',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'rhetorical_synthesis',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'While researching, a student took the following notes:\n• The axolotl is a salamander native to lakes near Mexico City.\n• Unlike most amphibians, it never undergoes metamorphosis; it keeps its gills for life.\n• It can regenerate lost limbs, parts of its heart, and even portions of its brain.\n• It is critically endangered in the wild.',
    prompt: "The student wants to emphasize the axolotl's unusual regenerative ability. Which choice most effectively uses relevant information from the notes to accomplish this goal?",
    choices: [
      'The axolotl, a salamander native to Mexico, can regenerate not only lost limbs but even parts of its heart and brain.',
      'The axolotl is a critically endangered salamander native to lakes near Mexico City.',
      'Unlike most amphibians, the axolotl never undergoes metamorphosis.',
      'The axolotl, found near Mexico City, keeps its gills for its entire life.'
    ],
    answer: 'A',
    explanation: 'The goal is to emphasize regenerative ability. Only A foregrounds regeneration of limbs, heart, and brain. The other choices emphasize habitat, endangerment, or metamorphosis instead.',
    translation: {
      words: { notes: 'anotações', salamander: 'salamandra', native: 'nativa', metamorphosis: 'metamorfose', gills: 'guelras', regenerate: 'regenerar', limbs: 'membros', endangered: 'ameaçada' },
      passage_pt: 'Durante a pesquisa, um estudante fez as seguintes anotações:\n• O axolote é uma salamandra nativa de lagos perto da Cidade do México.\n• Diferente da maioria dos anfíbios, ele nunca passa por metamorfose; mantém as guelras a vida toda.\n• Ele pode regenerar membros perdidos, partes do coração e até porções do cérebro.\n• Está criticamente ameaçado de extinção na natureza.',
      prompt_pt: 'O estudante quer enfatizar a incomum capacidade regenerativa do axolote. Qual escolha usa as informações das anotações de forma mais eficaz para isso?',
      choices_pt: [
        'O axolote, uma salamandra nativa do México, pode regenerar não só membros perdidos, mas até partes do coração e do cérebro.',
        'O axolote é uma salamandra criticamente ameaçada, nativa de lagos perto da Cidade do México.',
        'Diferente da maioria dos anfíbios, o axolote nunca passa por metamorfose.',
        'O axolote, encontrado perto da Cidade do México, mantém suas guelras a vida inteira.'
      ]
    }
  },
  {
    id: 'rw-eoi-h-201',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'transitions',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'Critics initially dismissed Impressionist paintings as unfinished sketches, mocking their loose brushwork and unblended colors. _______ these very techniques — once derided as evidence of incompetence — are now celebrated as deliberate innovations that captured fleeting effects of light in ways traditional methods could not.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['Today, by contrast,', 'For this reason,', 'Similarly,', 'In addition,'],
    answer: 'A',
    explanation: 'The passage reverses from past dismissal to present celebration, so a contrasting, time-marking transition ("Today, by contrast") fits best. "For this reason" signals cause, while "Similarly" and "In addition" signal agreement or accumulation, not reversal.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
  {
    id: 'rw-eoi-h-202',
    section: 'reading_writing',
    domain: 'expression_of_ideas',
    skill: 'rhetorical_synthesis',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: "While researching, a student took the following notes:\n• Tardigrades, also called water bears, are microscopic animals.\n• They can survive being frozen, boiled, dehydrated, and exposed to the vacuum of space.\n• They achieve this by entering a 'tun' state, suspending their metabolism almost completely.\n• In 2007, living tardigrades were sent into open space and survived.",
    prompt: 'The student wants to introduce tardigrades and their resilience to an audience unfamiliar with them. Which choice most effectively accomplishes this goal?',
    choices: [
      'Tardigrades, microscopic animals also known as water bears, are famous for surviving extremes — from boiling and freezing to the vacuum of space.',
      'In 2007, living tardigrades were sent into open space and survived.',
      "Tardigrades enter a 'tun' state, suspending their metabolism almost completely.",
      'Tardigrades are microscopic animals.'
    ],
    answer: 'A',
    explanation: 'For an unfamiliar audience, the sentence should both identify tardigrades and convey their resilience. A does both. B and C assume background knowledge and give only one detail, while D introduces them but omits the resilience the student wants to highlight.',
    translation: { words: {}, passage_pt: '', prompt_pt: '' }
  },
];

export default RW_QUESTIONS;
