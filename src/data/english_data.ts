/**
 * Static seed — English module questions & lesson definitions.
 * Placement test: 15 questions (A1→C2, grammar + vocabulary + reading).
 * Lessons: 2 full lessons for A1 & B1 (10q each); 1 lesson per other level (8q each).
 * Generation: Option A (static) — offline, zero latency, no API key needed.
 * Expand by adding Question objects + referencing their ids in a Lesson.questionIds.
 */
import type { Question, Lesson } from '../lib/english_types';

// ─────────────────────────────────────────────────────────────────
// PLACEMENT TEST — 15 questions, A1 → C2
// ─────────────────────────────────────────────────────────────────
export const PLACEMENT_QUESTIONS: Question[] = [
  // A1 ───────────────────────────────────────────────────────────
  {
    id: 'pt_1',
    level: 'A1',
    skill: 'grammar',
    type: 'multiple_choice',
    prompt: 'She ___ a doctor.',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
    explanation: "Com 'she/he/it', o verbo 'to be' é 'is': She is a doctor.",
  },
  {
    id: 'pt_2',
    level: 'A1',
    skill: 'vocabulary',
    type: 'multiple_choice',
    prompt: "What is the opposite of 'big'?",
    options: ['tall', 'heavy', 'small', 'slow'],
    correctIndex: 2,
    explanation: "'Small' is the antonym of 'big'. 'Tall' refers to height, not general size.",
  },

  // A2 ───────────────────────────────────────────────────────────
  {
    id: 'pt_3',
    level: 'A2',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'Yesterday, I ___ to the cinema with my friends.',
    options: ['go', 'going', 'went', 'gone'],
    correctIndex: 2,
    explanation: "'Went' is the irregular past simple of 'go'. Use past simple for completed actions.",
  },
  {
    id: 'pt_4',
    level: 'A2',
    skill: 'grammar',
    type: 'multiple_choice',
    prompt: 'My sister is ___ than me.',
    options: ['more taller', 'tallest', 'more tall', 'taller'],
    correctIndex: 3,
    explanation: "'Taller' is the comparative of 'tall' (one syllable → add -er). Never use 'more' with -er adjectives.",
  },

  // B1 ───────────────────────────────────────────────────────────
  {
    id: 'pt_5',
    level: 'B1',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'I ___ never been to Japan.',
    options: ['have', 'has', 'had', 'am'],
    correctIndex: 0,
    explanation: "Present Perfect with 'I': 'I have never been…'. 'Has' is used with he/she/it.",
  },
  {
    id: 'pt_6',
    level: 'B1',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'If it rains tomorrow, we ___ stay inside.',
    options: ['would', 'will', 'might', 'could'],
    correctIndex: 1,
    explanation: "First conditional (real future possibility): if + present simple → will + infinitive.",
  },
  {
    id: 'pt_7',
    level: 'B1',
    skill: 'vocabulary',
    type: 'multiple_choice',
    prompt: 'The politician gave a long ___ about climate change.',
    options: ['speech', 'speak', 'tell', 'say'],
    correctIndex: 0,
    explanation: "'Speech' is the noun for a formal public talk. Speak/tell/say are verbs.",
  },

  // B2 ───────────────────────────────────────────────────────────
  {
    id: 'pt_8',
    level: 'B2',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'If I ___ a car, I would drive to work every day.',
    options: ['have', 'had', 'would have', 'was having'],
    correctIndex: 1,
    explanation: "Second conditional (hypothetical present): if + past simple → would + infinitive.",
  },
  {
    id: 'pt_9',
    level: 'B2',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'She was upset because she ___ already lost her keys.',
    options: ['has', 'have', 'had', 'was'],
    correctIndex: 2,
    explanation: "Past Perfect ('had + past participle') for an action before another past event.",
  },
  {
    id: 'pt_10',
    level: 'B2',
    skill: 'vocabulary',
    type: 'multiple_choice',
    prompt: 'The government needs to ___ action on climate change immediately.',
    options: ['do', 'make', 'take', 'have'],
    correctIndex: 2,
    explanation: "'Take action' is the correct collocation. Compare: 'make a decision', 'do homework'.",
  },

  // C1 ───────────────────────────────────────────────────────────
  {
    id: 'pt_11',
    level: 'C1',
    skill: 'grammar',
    type: 'gap_fill',
    prompt: 'If I ___ more money when I was young, I would not be so poor now.',
    options: ['saved', 'had saved', 'would save', 'have saved'],
    correctIndex: 1,
    explanation: "Mixed conditional: if + past perfect (past condition) → would + infinitive (present result).",
  },
  {
    id: 'pt_12',
    level: 'C1',
    skill: 'reading',
    type: 'reading_comprehension',
    passage:
      'Urban beekeeping has experienced a remarkable resurgence in cities worldwide. Far from being an eccentric hobby, it addresses genuine ecological concerns: urban bees often fare better than their rural counterparts due to the diversity of flora in city gardens and parks, and the comparative absence of industrial pesticides.',
    prompt: 'What does the passage suggest about urban bees compared to rural bees?',
    options: [
      'Urban bees are more aggressive.',
      'Urban bees often have better living conditions.',
      'Rural bees benefit more from city gardens.',
      'Urban beekeeping is not ecologically useful.',
    ],
    correctIndex: 1,
    explanation: "The passage states 'urban bees often fare better than their rural counterparts' — i.e., better conditions in the city.",
  },

  // C2 ───────────────────────────────────────────────────────────
  {
    id: 'pt_13',
    level: 'C2',
    skill: 'grammar',
    type: 'multiple_choice',
    prompt: 'Not only ___ the deadline, but the team also delivered exceptional results.',
    options: ['they met', 'did they meet', 'they did meet', 'had they met'],
    correctIndex: 1,
    explanation: "After negative adverbials ('Not only…'), inversion is required: auxiliary before subject.",
  },
  {
    id: 'pt_14',
    level: 'C2',
    skill: 'vocabulary',
    type: 'multiple_choice',
    prompt: 'After years of struggling, her business finally ___ and became very profitable.',
    options: ['took off', 'put off', 'took apart', 'went through'],
    correctIndex: 0,
    explanation: "'Took off' = suddenly became successful. 'Put off' = postponed; 'took apart' = disassembled.",
  },

  // Mixed reading (B1/B2) ────────────────────────────────────────
  {
    id: 'pt_15',
    level: 'B2',
    skill: 'reading',
    type: 'reading_comprehension',
    passage:
      'Social media platforms have fundamentally altered how news is consumed. While traditional outlets once served as gatekeepers, anyone can now publish content instantly. Critics argue this democratisation has come at a cost: misinformation spreads faster than corrections, and engagement algorithms often prioritise sensational content over accurate reporting.',
    prompt: 'According to the text, what is a disadvantage of social media news?',
    options: [
      'News is now published too slowly.',
      'Traditional media has too much power.',
      'False information can spread quickly.',
      'Algorithms only show political content.',
    ],
    correctIndex: 2,
    explanation: "The passage says 'misinformation spreads faster than corrections' — a clear disadvantage.",
  },
];

// ─────────────────────────────────────────────────────────────────
// LESSON QUESTION BANK
// ─────────────────────────────────────────────────────────────────

// A1 Lesson 1 — "The Verb 'To Be'" (10 questions)
const A1L1: Question[] = [
  { id: 'a1l1_1', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ a student.', options: ['am', 'is', 'are', 'be'], correctIndex: 0, explanation: "With 'I', always use 'am': I am a student." },
  { id: 'a1l1_2', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'They ___ from Brazil.', options: ['is', 'am', 'are', 'be'], correctIndex: 2, explanation: "With 'they/we/you', use 'are': They are from Brazil." },
  { id: 'a1l1_3', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'He ___ not hungry.', options: ['am', 'is', 'are', 'be'], correctIndex: 1, explanation: "With 'he/she/it', use 'is': He is not hungry." },
  { id: 'a1l1_4', level: 'A1', skill: 'grammar', type: 'multiple_choice', prompt: '___ you a teacher?', options: ['Am', 'Is', 'Are', 'Be'], correctIndex: 2, explanation: "With 'you', use 'Are': Are you a teacher?" },
  { id: 'a1l1_5', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'Maria and João ___ friends.', options: ['is', 'am', 'are', 'be'], correctIndex: 2, explanation: "Two or more people = plural → 'are'." },
  { id: 'a1l1_6', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'The cat ___ on the table.', options: ['am', 'are', 'is', 'be'], correctIndex: 2, explanation: "'The cat' is singular → 'is'." },
  { id: 'a1l1_7', level: 'A1', skill: 'grammar', type: 'multiple_choice', prompt: "What is the contraction of 'I am not'?", options: ["I not am", "I amn't", "I'm not", "I not"], correctIndex: 2, explanation: "The negative contraction is 'I'm not'. There is no 'amn't' in standard English." },
  { id: 'a1l1_8', level: 'A1', skill: 'grammar', type: 'multiple_choice', prompt: '___ she your sister?', options: ['Are', 'Is', 'Am', 'Be'], correctIndex: 1, explanation: "With 'she/he/it', questions use 'Is': Is she your sister?" },
  { id: 'a1l1_9', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'We ___ in the park right now.', options: ['is', 'am', 'are', 'been'], correctIndex: 2, explanation: "With 'we', use 'are'." },
  { id: 'a1l1_10', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'The books ___ on the shelf.', options: ['is', 'am', 'are', 'be'], correctIndex: 2, explanation: "'The books' is plural → 'are'." },
];

// A1 Lesson 2 — "Present Simple & Daily Routine" (10 questions)
const A1L2: Question[] = [
  { id: 'a1l2_1', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ coffee every morning.', options: ['drink', 'drinks', 'is drinking', 'drank'], correctIndex: 1, explanation: "He/she/it + present simple → add -s: She drinks." },
  { id: 'a1l2_2', level: 'A1', skill: 'grammar', type: 'multiple_choice', prompt: 'What time ___ you wake up?', options: ['are', 'is', 'do', 'does'], correctIndex: 2, explanation: "Questions with 'I/you/we/they' use 'do': What time do you wake up?" },
  { id: 'a1l2_3', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'My father ___ work on Sundays.', options: ["don't", "doesn't", "isn't", 'not'], correctIndex: 1, explanation: "Negatives with he/she/it: doesn't + base verb." },
  { id: 'a1l2_4', level: 'A1', skill: 'vocabulary', type: 'multiple_choice', prompt: "Which activity is typically part of a 'morning routine'?", options: ['Dinner', 'Breakfast', 'Midnight snack', 'Supper'], correctIndex: 1, explanation: "'Breakfast' is the first meal of the day, part of the morning routine." },
  { id: 'a1l2_5', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'They ___ to the gym three times a week.', options: ['goes', 'going', 'go', 'goed'], correctIndex: 2, explanation: "With 'they/we/I/you', use the base form — no -s." },
  { id: 'a1l2_6', level: 'A1', skill: 'vocabulary', type: 'multiple_choice', prompt: 'I usually ___ TV in the evening.', options: ['see', 'look', 'watch', 'view'], correctIndex: 2, explanation: "The correct collocation is 'watch TV'. We 'see' a film, 'look at' a picture." },
  { id: 'a1l2_7', level: 'A1', skill: 'grammar', type: 'multiple_choice', prompt: '___ she speak English?', options: ['Do', 'Does', 'Is', 'Are'], correctIndex: 1, explanation: "She/he/it questions → 'Does': Does she speak English?" },
  { id: 'a1l2_8', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'The train ___ every hour.', options: ['leave', 'leaving', 'left', 'leaves'], correctIndex: 3, explanation: "Schedules use present simple. 'The train' (it) → add -s: leaves." },
  { id: 'a1l2_9', level: 'A1', skill: 'vocabulary', type: 'multiple_choice', prompt: "What does 'always' mean as a frequency adverb?", options: ['Never', 'Sometimes', '100% of the time', '50% of the time'], correctIndex: 2, explanation: "'Always' = every single time (100%). Scale: always > usually > often > sometimes > rarely > never." },
  { id: 'a1l2_10', level: 'A1', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ my teeth twice a day.', options: ['brush', 'brushes', 'am brushing', 'brushing'], correctIndex: 0, explanation: "With 'I', use the base form: I brush." },
];

// A2 Lesson 1 — "Past Simple" (8 questions)
const A2L1: Question[] = [
  { id: 'a2l1_1', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'Last night, we ___ at a new restaurant.', options: ['eat', 'ate', 'eated', 'have eaten'], correctIndex: 1, explanation: "'Ate' is the irregular past simple of 'eat'." },
  { id: 'a2l1_2', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ the exam and got a great result.', options: ['pass', 'passed', 'was passing', 'has passed'], correctIndex: 1, explanation: "'Passed' — regular past simple (verb + -ed)." },
  { id: 'a2l1_3', level: 'A2', skill: 'grammar', type: 'multiple_choice', prompt: 'Where ___ you go on holiday last year?', options: ['are', 'were', 'did', 'do'], correctIndex: 2, explanation: "Past simple questions with most verbs: Did + subject + base verb." },
  { id: 'a2l1_4', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ not feel well yesterday, so I stayed home.', options: ["don't", "didn't", "wasn't", "haven't"], correctIndex: 1, explanation: "Past simple negatives: didn't + base verb." },
  { id: 'a2l1_5', level: 'A2', skill: 'grammar', type: 'multiple_choice', prompt: "What is the correct past simple of 'go'?", options: ['goed', 'gone', 'goes', 'went'], correctIndex: 3, explanation: "'Go' is irregular: go → went (past simple) → gone (past participle)." },
  { id: 'a2l1_6', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'The film ___ two hours ago.', options: ['starts', 'start', 'started', 'is starting'], correctIndex: 2, explanation: "'Two hours ago' signals a past simple action: started." },
  { id: 'a2l1_7', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'She was the ___ student in the class — better than everyone else.', options: ['more good', 'best', 'most good', 'better'], correctIndex: 1, explanation: "'Best' is the superlative of 'good'. Superlatives compare someone to all others." },
  { id: 'a2l1_8', level: 'A2', skill: 'grammar', type: 'multiple_choice', prompt: 'Which sentence uses the past simple correctly?', options: ['I goed to school yesterday.', 'She have lunch at 1pm.', 'They played football on Sunday.', 'He is wake up late this morning.'], correctIndex: 2, explanation: "'Played' is the correct past simple of 'play'. The others have irregular or auxiliary verb errors." },
];

// A2 Lesson 2 — "Present Continuous & 'Going To'" (8 questions)
const A2L2: Question[] = [
  { id: 'a2l2_1', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ reading a book right now.', options: ['is', 'was', 'are', 'be'], correctIndex: 0, explanation: "Present continuous: subject + am/is/are + -ing verb. 'She is reading…'" },
  { id: 'a2l2_2', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'We ___ going to visit Paris next month.', options: ['is', 'am', 'are', 'be'], correctIndex: 2, explanation: "'Going to' for planned future: We are going to visit…" },
  { id: 'a2l2_3', level: 'A2', skill: 'grammar', type: 'multiple_choice', prompt: "___ they playing tennis now?", options: ['Do', 'Does', 'Are', 'Is'], correctIndex: 2, explanation: "Present continuous question with 'they': Are they playing…?" },
  { id: 'a2l2_4', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'He is ___ to study medicine at university.', options: ['go', 'going', 'goes', 'went'], correctIndex: 1, explanation: "'Going to' expresses a future plan: He is going to study…" },
  { id: 'a2l2_5', level: 'A2', skill: 'vocabulary', type: 'multiple_choice', prompt: "Which word means 'to make something happen in the future'?", options: ['remember', 'plan', 'finish', 'repeat'], correctIndex: 1, explanation: "'Plan' means to decide in advance what you will do in the future." },
  { id: 'a2l2_6', level: 'A2', skill: 'grammar', type: 'multiple_choice', prompt: 'Which sentence is present continuous?', options: ['She walks to school.', 'She walked to school.', 'She is walking to school.', 'She will walk to school.'], correctIndex: 2, explanation: "Present continuous: am/is/are + verb-ing. 'She is walking…'" },
  { id: 'a2l2_7', level: 'A2', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ not going to eat meat anymore.', options: ['is', 'am', 'are', 'be'], correctIndex: 1, explanation: "With 'I', use 'am': I am not going to…" },
  { id: 'a2l2_8', level: 'A2', skill: 'vocabulary', type: 'multiple_choice', prompt: "What does 'twice a week' mean?", options: ['Two times a month', 'Every two weeks', 'Two times a week', 'Every other day'], correctIndex: 2, explanation: "'Twice' = two times. 'Twice a week' = 2 times per week." },
];

// B1 Lesson 1 — "Present Perfect" (10 questions)
const B1L1: Question[] = [
  { id: 'b1l1_1', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ been to New York three times.', options: ['was', 'have', 'had', 'am'], correctIndex: 1, explanation: "Present Perfect: have/has + past participle. Use it for life experiences (no specific time)." },
  { id: 'b1l1_2', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'She has ___ finished her project.', options: ['yet', 'just', 'for', 'since'], correctIndex: 1, explanation: "'Just' with Present Perfect = very recently. 'Yet' is for negatives/questions." },
  { id: 'b1l1_3', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: "We haven't seen that film ___.", options: ['already', 'just', 'yet', 'since'], correctIndex: 2, explanation: "'Yet' is used in negatives (and questions): I haven't done it yet." },
  { id: 'b1l1_4', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'He has worked here ___ 2018.', options: ['for', 'since', 'ago', 'during'], correctIndex: 1, explanation: "'Since' + specific point in time. 'For' + duration (e.g., 'for six years')." },
  { id: 'b1l1_5', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'They ___ this house for twenty years.', options: ['live', 'lived', 'are living', 'have lived'], correctIndex: 3, explanation: "Action started in past, continues now → Present Perfect: have lived." },
  { id: 'b1l1_6', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'Have you ever ___ sushi?', options: ['eat', 'ate', 'eating', 'eaten'], correctIndex: 3, explanation: "Present Perfect uses the past participle. eat → ate → eaten." },
  { id: 'b1l1_7', level: 'B1', skill: 'grammar', type: 'multiple_choice', prompt: 'Which sentence is correct?', options: ['I have seen her yesterday.', 'She has just arrived.', 'Did you ever try sushi?', 'He has went to school.'], correctIndex: 1, explanation: "'She has just arrived' is correct. 'Yesterday' needs past simple; 'ever' needs 'Have you ever tried'; 'went' is not a past participle (should be 'gone')." },
  { id: 'b1l1_8', level: 'B1', skill: 'grammar', type: 'multiple_choice', prompt: '___ you ever ridden a horse?', options: ['Did', 'Do', 'Have', 'Are'], correctIndex: 2, explanation: "'Ever' in questions about life experience → Present Perfect: Have you ever…?" },
  { id: 'b1l1_9', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ already read that book twice.', options: ['was', 'has', 'had', 'is'], correctIndex: 1, explanation: "He/she/it → 'has' for Present Perfect: She has already read…" },
  { id: 'b1l1_10', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: "We've been friends ___ we were children.", options: ['for', 'since', 'during', 'from'], correctIndex: 1, explanation: "'Since' + clause describing a starting point in time." },
];

// B1 Lesson 2 — "First Conditional & Modal Verbs" (10 questions)
const B1L2: Question[] = [
  { id: 'b1l2_1', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'If it rains tomorrow, we ___ cancel the picnic.', options: ['would', 'will', 'might', 'should'], correctIndex: 1, explanation: "First conditional: if + present → will + infinitive. Real future possibility." },
  { id: 'b1l2_2', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'You ___ see a doctor if that pain continues.', options: ['must', 'should', 'will', 'can'], correctIndex: 1, explanation: "'Should' = advice/recommendation. 'Must' is stronger (obligation)." },
  { id: 'b1l2_3', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ speak three languages — she grew up multilingual.', options: ['should', 'must', 'can', 'has to'], correctIndex: 2, explanation: "'Can' = ability. She has the ability to speak three languages." },
  { id: 'b1l2_4', level: 'B1', skill: 'grammar', type: 'multiple_choice', prompt: 'Which sentence uses the first conditional correctly?', options: ['If you will study, you will pass.', 'If you study, you will pass.', 'If you studied, you will pass.', 'If you study, you would pass.'], correctIndex: 1, explanation: "First conditional: 'if + present simple' (not 'will') → 'will + base verb'." },
  { id: 'b1l2_5', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'I ___ have left my keys at home — I cannot find them anywhere.', options: ['should', 'will', 'could', 'must'], correctIndex: 3, explanation: "'Must have + past participle' = logical deduction about the past." },
  { id: 'b1l2_6', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'You ___ wear a tie to the interview. It is optional.', options: ["mustn't", "don't have to", "shouldn't", "can't"], correctIndex: 1, explanation: "'Don't have to' = not necessary (but allowed). 'Mustn't' = forbidden. Big difference!" },
  { id: 'b1l2_7', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'If she ___ harder, she will get better results.', options: ['tries', 'will try', 'tried', 'has tried'], correctIndex: 0, explanation: "First conditional 'if' clause: present simple (not 'will'): if she tries." },
  { id: 'b1l2_8', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'Students ___ use their phones during the exam.', options: ["mustn't", "don't have to", "shouldn't have", 'needn\'t'], correctIndex: 0, explanation: "'Mustn't' = prohibited/forbidden. Using phones in an exam is not allowed." },
  { id: 'b1l2_9', level: 'B1', skill: 'vocabulary', type: 'multiple_choice', prompt: "What does 'might' express?", options: ['Certainty', 'Ability', 'Possibility', 'Obligation'], correctIndex: 2, explanation: "'Might' = possibility (maybe, perhaps). Compare: can = ability, must = strong obligation." },
  { id: 'b1l2_10', level: 'B1', skill: 'grammar', type: 'gap_fill', prompt: 'If they do not hurry, they ___ miss the train.', options: ['would', 'will', 'might', 'should'], correctIndex: 1, explanation: "First conditional for a real, likely future consequence." },
];

// B2 Lesson 1 — "Past Perfect & Conditionals" (8 questions)
const B2L1: Question[] = [
  { id: 'b2l1_1', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'If I ___ taller, I would play basketball professionally.', options: ['am', 'was', 'were', 'would be'], correctIndex: 2, explanation: "Second conditional uses 'were' for all subjects (formal): If I were taller…" },
  { id: 'b2l1_2', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'By the time we arrived, the film ___ already started.', options: ['already started', 'was starting', 'has started', 'had'], correctIndex: 3, explanation: "Past Perfect ('had + past participle') for an action before another past event." },
  { id: 'b2l1_3', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'If she ___ the map, she would not have got lost.', options: ['checked', 'has checked', 'had checked', 'would check'], correctIndex: 2, explanation: "Third conditional: if + past perfect → would have + past participle. Hypothetical past." },
  { id: 'b2l1_4', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'He was exhausted because he ___ all day.', options: ['works', 'worked', 'has worked', 'had been working'], correctIndex: 3, explanation: "Past perfect continuous: had been + -ing. Continuous action leading up to a past moment." },
  { id: 'b2l1_5', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'The book ___ written by a famous Brazilian author.', options: ['is', 'was', 'has', 'were'], correctIndex: 1, explanation: "Passive voice past: 'was/were + past participle'. The book was written…" },
  { id: 'b2l1_6', level: 'B2', skill: 'grammar', type: 'multiple_choice', prompt: 'Which sentence is in the passive voice?', options: ['The chef cooked the meal.', 'The meal was cooked by the chef.', 'The chef had cooked the meal.', 'The chef will cook the meal.'], correctIndex: 1, explanation: "Passive: subject receives the action ('The meal was cooked'). Active: subject does the action." },
  { id: 'b2l1_7', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'She ___ to Paris twice before she moved there.', options: ['went', 'has gone', 'had been', 'goes'], correctIndex: 2, explanation: "'Had been' = Past Perfect for experience before another past event." },
  { id: 'b2l1_8', level: 'B2', skill: 'grammar', type: 'gap_fill', prompt: 'What would you do if you ___ a million dollars?', options: ['win', 'won', 'had won', 'would win'], correctIndex: 1, explanation: "Second conditional: if + past simple → would + infinitive." },
];

// C1 Lesson 1 — "Advanced Grammar: Inversion, Clefts & Modals" (8 questions)
const C1L1: Question[] = [
  { id: 'c1l1_1', level: 'C1', skill: 'grammar', type: 'gap_fill', prompt: 'Not only ___ late, but she also forgot her presentation.', options: ['she arrived', 'she did arrive', 'did she arrive', 'had she arrived'], correctIndex: 2, explanation: "After negative adverbials ('Not only…'), subject-verb inversion is required." },
  { id: 'c1l1_2', level: 'C1', skill: 'grammar', type: 'gap_fill', prompt: 'Had I known about the problem, I ___ helped earlier.', options: ['would', 'would have', 'will have', 'had'], correctIndex: 1, explanation: "Inverted third conditional: 'Had I known…' = 'If I had known…' → would have + participle." },
  { id: 'c1l1_3', level: 'C1', skill: 'grammar', type: 'gap_fill', prompt: 'The report will ___ completed by the end of the week.', options: ['be', 'have', 'has been', 'being'], correctIndex: 0, explanation: "Future passive: will + be + past participle. 'The report will be completed…'" },
  { id: 'c1l1_4', level: 'C1', skill: 'grammar', type: 'gap_fill', prompt: "It was her hard work ___ led to her success.", options: ['which', 'that', 'what', 'who'], correctIndex: 1, explanation: "Cleft sentence: 'It was X that…'. 'That' is standard in cleft constructions (emphasises the subject)." },
  { id: 'c1l1_5', level: 'C1', skill: 'vocabulary', type: 'multiple_choice', prompt: 'She speaks so naturally she could ___ for a native speaker.', options: ['pass', 'mistake', 'take', 'hold'], correctIndex: 0, explanation: "'Pass for' = to be accepted as/mistaken for: 'she could pass for a native speaker'." },
  { id: 'c1l1_6', level: 'C1', skill: 'vocabulary', type: 'multiple_choice', prompt: 'The new policy is likely to ___ significant changes in the industry.', options: ['bring about', 'bring up', 'bring on', 'bring down'], correctIndex: 0, explanation: "'Bring about' = to cause or produce a change. 'Bring up' = raise a topic." },
  {
    id: 'c1l1_7',
    level: 'C1',
    skill: 'reading',
    type: 'reading_comprehension',
    passage: 'Decision fatigue — the deterioration of decision quality after a long session of decision-making — has significant implications for policymakers and individuals alike. Research suggests that important choices should be made earlier in the day, when cognitive resources are at their freshest.',
    prompt: 'What practical advice does the text imply for individuals?',
    options: ['Avoid making any decisions after midday.', 'Make important decisions when you are most mentally fresh.', 'Decision quality is not affected by fatigue.', 'Individuals should delegate all decisions to others.'],
    correctIndex: 1,
    explanation: "The text says 'important choices should be made earlier in the day when cognitive resources are freshest' — i.e., when you are most alert.",
  },
  { id: 'c1l1_8', level: 'C1', skill: 'grammar', type: 'gap_fill', prompt: 'I wish I ___ more time to spend with my family.', options: ['had', 'have', 'would have', 'will have'], correctIndex: 0, explanation: "'Wish + past simple' expresses a desire to change a present (unreal) situation." },
];

// C2 Lesson 1 — "Idioms, Inversion & C2 Vocabulary" (8 questions)
const C2L1: Question[] = [
  { id: 'c2l1_1', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: 'After years of struggle, everything finally ___ into place for the young entrepreneur.', options: ['came', 'fell', 'got', 'went'], correctIndex: 1, explanation: "'Fall into place' = things arrange themselves in a satisfying, natural way." },
  { id: 'c2l1_2', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: "The politician's speech was deliberately ___; it avoided any clear commitment.", options: ['ambiguous', 'verbose', 'eloquent', 'pedantic'], correctIndex: 0, explanation: "'Ambiguous' = open to more than one interpretation, intentionally vague." },
  { id: 'c2l1_3', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: 'She has an uncanny ability to ___ the mood in any room.', options: ['read', 'see', 'feel', 'sense'], correctIndex: 0, explanation: "'Read the room' = understand the emotional atmosphere of a situation." },
  {
    id: 'c2l1_4',
    level: 'C2',
    skill: 'reading',
    type: 'reading_comprehension',
    passage: "His prose, though ostensibly concerned with mundane domestic life, operates as a palimpsest — each surface detail obscuring and simultaneously revealing the subterranean anxieties of a post-war generation grappling with its own obsolescence.",
    prompt: "What does 'palimpsest' most closely mean in this literary context?",
    options: ['A text with one layer of clear, transparent meaning.', 'A piece of writing where one layer of meaning covers and reveals another.', 'A style that focuses entirely on historical events.', 'A linear narrative with no underlying symbolism.'],
    correctIndex: 1,
    explanation: "A palimpsest is a manuscript where old writing was erased but traces remained. Literarily: layers of meaning where surface content conceals/reveals deeper significance.",
  },
  { id: 'c2l1_5', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: "The company's latest acquisition was ___, designed to eliminate competition before it gained a foothold.", options: ['preemptive', 'reactionary', 'tentative', 'perfunctory'], correctIndex: 0, explanation: "'Preemptive' = done to prevent something before it happens." },
  { id: 'c2l1_6', level: 'C2', skill: 'grammar', type: 'multiple_choice', prompt: 'Not until he had lost everything ___ to appreciate what truly mattered.', options: ['he began', 'did he begin', 'he did begin', 'began he'], correctIndex: 1, explanation: "'Not until' triggers inversion: 'Not until… did he begin'. Formal literary construction." },
  { id: 'c2l1_7', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: "The author's use of irony serves to ___ the gap between official rhetoric and lived reality.", options: ['underscore', 'undermine', 'overlook', 'conceal'], correctIndex: 0, explanation: "'Underscore' = to emphasise or highlight. The irony highlights the gap." },
  { id: 'c2l1_8', level: 'C2', skill: 'vocabulary', type: 'multiple_choice', prompt: "The findings were ___ in that they confirmed the theory while raising deeper questions.", options: ['paradoxical', 'superfluous', 'tentative', 'inconclusive'], correctIndex: 0, explanation: "'Paradoxical' = seemingly contradictory but true. Confirming + raising new questions is a paradox." },
];

// ─────────────────────────────────────────────────────────────────
// LESSON QUESTION BANK (all lesson questions in one array)
// ─────────────────────────────────────────────────────────────────
export const LESSON_QUESTIONS: Question[] = [
  ...A1L1, ...A1L2,
  ...A2L1, ...A2L2,
  ...B1L1, ...B1L2,
  ...B2L1,
  ...C1L1,
  ...C2L1,
];

// ─────────────────────────────────────────────────────────────────
// LESSON DEFINITIONS
// ─────────────────────────────────────────────────────────────────
export const LESSONS: Lesson[] = [
  // A1
  { id: 'a1-1', level: 'A1', title: "The Verb 'To Be'", description: "Learn when to use 'am', 'is', and 'are'.", questionIds: A1L1.map((q) => q.id) },
  { id: 'a1-2', level: 'A1', title: 'Present Simple & Daily Routine', description: 'How to talk about habits and routines.', questionIds: A1L2.map((q) => q.id) },
  // A2
  { id: 'a2-1', level: 'A2', title: 'Past Simple', description: 'Talking about completed events in the past.', questionIds: A2L1.map((q) => q.id) },
  { id: 'a2-2', level: 'A2', title: "Present Continuous & 'Going To'", description: 'Actions happening now and future plans.', questionIds: A2L2.map((q) => q.id) },
  // B1
  { id: 'b1-1', level: 'B1', title: 'Present Perfect', description: 'Connecting past experiences to the present.', questionIds: B1L1.map((q) => q.id) },
  { id: 'b1-2', level: 'B1', title: 'First Conditional & Modal Verbs', description: 'Real possibilities and expressing obligation, advice, ability.', questionIds: B1L2.map((q) => q.id) },
  // B2
  { id: 'b2-1', level: 'B2', title: 'Past Perfect & Conditionals', description: 'Hypothetical situations and sequencing past events.', questionIds: B2L1.map((q) => q.id) },
  // C1
  { id: 'c1-1', level: 'C1', title: 'Advanced Grammar', description: 'Inversion, cleft sentences, mixed conditionals.', questionIds: C1L1.map((q) => q.id) },
  // C2
  { id: 'c2-1', level: 'C2', title: 'Idioms & Advanced Vocabulary', description: 'Mastering idiomatic English and C2-level precision.', questionIds: C2L1.map((q) => q.id) },
];

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────

/** Lookup map: question id → Question */
export const QUESTION_MAP: Map<string, Question> = new Map([
  ...PLACEMENT_QUESTIONS.map((q): [string, Question] => [q.id, q]),
  ...LESSON_QUESTIONS.map((q): [string, Question] => [q.id, q]),
]);

/** Total lessons per CEFR level — used for progress calculation */
export const LESSONS_PER_LEVEL = LESSONS.reduce(
  (acc, l) => { acc[l.level] = (acc[l.level] ?? 0) + 1; return acc; },
  {} as Record<string, number>,
);
