import type { Question } from '../lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Math Question Bank — Original questions in SAT style
// ─────────────────────────────────────────────────────────────────────────────

export const MATH_QUESTIONS: Question[] = [

  // ─── ALGEBRA — easy ──────────────────────────────────────────────────────

  {
    id: 'math-alg-e-001',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'If \\(3x + 12 = 27\\), what is the value of \\(x\\)?',
    choices: ['5', '7', '3', '9'],
    answer: 'A',
    explanation: '3x + 12 = 27 → 3x = 15 → x = 5',
    translation: {
      words: { value: 'valor' },
      prompt_pt: 'Se \\(3x + 12 = 27\\), qual é o valor de \\(x\\)?'
    }
  },
  {
    id: 'math-alg-e-002',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'What is the solution to \\(3(x - 1) = 2x + 5\\)?',
    choices: ['\\(x = 8\\)', '\\(x = -8\\)', '\\(x = 2\\)', '\\(x = -2\\)'],
    answer: 'A',
    explanation: '3x − 3 = 2x + 5 → 3x − 2x = 5 + 3 → x = 8.',
    translation: {
      words: { solution: 'solução' },
      prompt_pt: 'Qual é a solução de \\(3(x - 1) = 2x + 5\\)?'
    }
  },
  {
    id: 'math-alg-e-002b',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A store sells notebooks for $4 each. If Maria spent $28 on notebooks, how many notebooks did she buy?',
    choices: ['7', '6', '8', '5'],
    answer: 'A',
    explanation: '28 ÷ 4 = 7 notebooks.',
    translation: {
      words: { notebooks: 'cadernos', spent: 'gastou' },
      prompt_pt: 'Uma loja vende cadernos por $4 cada. Se Maria gastou $28 em cadernos, quantos cadernos ela comprou?'
    }
  },
  {
    id: 'math-alg-e-003',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_inequalities',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'Which value of \\(x\\) satisfies the inequality \\(2x - 5 > 7\\)?',
    choices: ['\\(x = 7\\)', '\\(x = 6\\)', '\\(x = 5\\)', '\\(x = 4\\)'],
    answer: 'A',
    explanation: '2x - 5 > 7 → 2x > 12 → x > 6. Only x = 7 satisfies x > 6.',
    translation: {
      words: { satisfies: 'satisfaz', inequality: 'inequação' },
      prompt_pt: 'Qual valor de \\(x\\) satisfaz a inequação \\(2x - 5 > 7\\)?'
    }
  },
  {
    id: 'math-alg-e-004',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'easy',
    type: 'spr',
    passage: '',
    prompt: 'What is the value of \\(y\\) when \\(4y - 8 = 20\\)?',
    choices: [],
    answer: '7',
    explanation: '4y - 8 = 20 → 4y = 28 → y = 7',
    translation: {
      words: { value: 'valor' },
      prompt_pt: 'Qual é o valor de \\(y\\) quando \\(4y - 8 = 20\\)?'
    }
  },
  {
    id: 'math-alg-e-005',
    section: 'math',
    domain: 'algebra',
    skill: 'systems_linear',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'If \\(x + y = 10\\) and \\(x - y = 4\\), what is the value of \\(x\\)?',
    choices: ['7', '3', '5', '6'],
    answer: 'A',
    explanation: 'Adding both equations: 2x = 14, so x = 7.',
    translation: {
      words: { value: 'valor' },
      prompt_pt: 'Se \\(x + y = 10\\) e \\(x - y = 4\\), qual é o valor de \\(x\\)?'
    }
  },

  // ─── ALGEBRA — medium ─────────────────────────────────────────────────────

  {
    id: 'math-alg-m-001',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The equation \\(kx + 3 = 5x - 9\\) has no solution. What is the value of \\(k\\)?',
    choices: ['5', '3', '8', '\\(-3\\)'],
    answer: 'A',
    explanation: 'For no solution, the x coefficients must be equal (parallel lines) and the constants different. kx + 3 = 5x - 9 → (k - 5)x = -12. For no solution, k - 5 = 0, so k = 5. Then 0 = -12, which is a contradiction — confirming no solution.',
    translation: {
      words: { solution: 'solução', equation: 'equação' },
      prompt_pt: 'A equação \\(kx + 3 = 5x - 9\\) não tem solução. Qual é o valor de \\(k\\)?'
    }
  },
  {
    id: 'math-alg-m-002',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'medium',
    type: 'spr',
    passage: '',
    prompt: 'A plumber charges a flat fee of $45 plus $60 per hour. A customer paid $225. How many hours did the plumber work?',
    choices: [],
    answer: '3',
    explanation: '45 + 60h = 225 → 60h = 180 → h = 3 hours.',
    translation: {
      words: { charges: 'cobra', flat: 'fixo', fee: 'taxa', hour: 'hora', paid: 'pagou', plumber: 'encanador' },
      prompt_pt: 'Um encanador cobra uma taxa fixa de $45 mais $60 por hora. Um cliente pagou $225. Quantas horas o encanador trabalhou?'
    }
  },
  {
    id: 'math-alg-m-002b',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_equations',
    difficulty: 'medium',
    type: 'spr',
    passage: '',
    prompt: 'A taxi charges a flat fee of $2.00 plus $2.50 per mile. If a ride cost $17.00, how many miles was the trip?',
    choices: [],
    answer: '6',
    explanation: '2 + 2.5m = 17 → 2.5m = 15 → m = 6 miles.',
    translation: {
      words: { charges: 'cobra', flat: 'fixo', fee: 'taxa', mile: 'milha', trip: 'viagem', cost: 'custou' },
      prompt_pt: 'Um táxi cobra uma taxa fixa de $2,00 mais $2,50 por milha. Se uma viagem custou $17,00, quantas milhas foi o percurso?'
    }
  },
  {
    id: 'math-alg-m-003',
    section: 'math',
    domain: 'algebra',
    skill: 'systems_linear',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A farmer grows wheat and corn. He plants a total of 120 acres. He plants 3 times as many acres of corn as wheat. How many acres of wheat does he plant?',
    choices: ['30', '40', '60', '90'],
    answer: 'A',
    explanation: 'Let w = wheat, c = corn. w + c = 120, c = 3w. Substituting: w + 3w = 120 → 4w = 120 → w = 30.',
    translation: {
      words: { farmer: 'fazendeiro', grows: 'cultiva', wheat: 'trigo', corn: 'milho', plants: 'planta', acres: 'acres', times: 'vezes' },
      prompt_pt: 'Um fazendeiro cultiva trigo e milho. Ele planta um total de 120 acres. Ele planta 3 vezes mais acres de milho do que de trigo. Quantos acres de trigo ele planta?'
    }
  },
  {
    id: 'math-alg-m-004',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_functions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The function \\(f(x) = -2x + 8\\) is defined for all real numbers. At what value of \\(x\\) does \\(f(x) = 0\\)?',
    choices: ['4', '\\(-4\\)', '8', '2'],
    answer: 'A',
    explanation: '-2x + 8 = 0 → -2x = -8 → x = 4',
    translation: {
      words: { function: 'função', defined: 'definida', value: 'valor', real: 'reais' },
      prompt_pt: 'A função \\(f(x) = -2x + 8\\) está definida para todos os números reais. Em qual valor de \\(x\\) temos \\(f(x) = 0\\)?'
    }
  },

  // ─── ALGEBRA — hard ──────────────────────────────────────────────────────

  {
    id: 'math-alg-h-001',
    section: 'math',
    domain: 'algebra',
    skill: 'systems_linear',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The system of equations below has infinitely many solutions. What is the value of \\(a\\)?\n\\[2x - 3y = 6\\]\n\\[ax - 12y = 24\\]',
    choices: ['8', '4', '6', '3'],
    answer: 'A',
    explanation: 'For infinitely many solutions, the equations must be proportional. The ratio of y-coefficients is -12/-3 = 4, and constant ratio is 24/6 = 4. So the x-coefficient ratio must also be 4: a/2 = 4 → a = 8.',
    translation: {
      words: { system: 'sistema', equations: 'equações', infinitely: 'infinitamente', solutions: 'soluções', value: 'valor' },
      prompt_pt: 'O sistema de equações abaixo tem infinitas soluções. Qual é o valor de \\(a\\)?'
    }
  },
  {
    id: 'math-alg-h-002',
    section: 'math',
    domain: 'algebra',
    skill: 'linear_inequalities',
    difficulty: 'hard',
    type: 'spr',
    passage: '',
    prompt: 'What is the greatest integer value of \\(n\\) such that \\(\\frac{3n - 7}{2} < 5\\)?',
    choices: [],
    answer: '5',
    explanation: '(3n - 7)/2 < 5 → 3n - 7 < 10 → 3n < 17 → n < 17/3 ≈ 5.67. Greatest integer less than 5.67 is 5.',
    translation: {
      words: { greatest: 'maior', integer: 'inteiro', value: 'valor', such: 'tal' },
      prompt_pt: 'Qual é o maior valor inteiro de \\(n\\) tal que \\(\\frac{3n - 7}{2} < 5\\)?'
    }
  },

  // ─── ADVANCED MATH — easy ─────────────────────────────────────────────────

  {
    id: 'math-am-e-001',
    section: 'math',
    domain: 'advanced_math',
    skill: 'quadratic_functions',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'What are the solutions to \\(x^2 - 5x + 6 = 0\\)?',
    choices: ['\\(x = 2\\) and \\(x = 3\\)', '\\(x = -2\\) and \\(x = -3\\)', '\\(x = 1\\) and \\(x = 6\\)', '\\(x = 2\\) and \\(x = -3\\)'],
    answer: 'A',
    explanation: 'x² - 5x + 6 = (x - 2)(x - 3) = 0, so x = 2 or x = 3.',
    translation: {
      words: { solutions: 'soluções' },
      prompt_pt: 'Quais são as soluções de \\(x^2 - 5x + 6 = 0\\)?'
    }
  },
  {
    id: 'math-am-e-002',
    section: 'math',
    domain: 'advanced_math',
    skill: 'exponential_functions',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A bacteria population doubles every 3 hours. If there are 200 bacteria at time \\(t = 0\\), which expression gives the population at time \\(t\\) hours?',
    choices: [
      '\\(200 \\cdot 2^{t/3}\\)',
      '\\(200 \\cdot 2^{3t}\\)',
      '\\(200 + 2t\\)',
      '\\(200 \\cdot 3^{t/2}\\)'
    ],
    answer: 'A',
    explanation: 'For exponential doubling with period 3, the formula is P(t) = 200 · 2^(t/3). At t=3: 200·2^1=400 ✓. At t=6: 200·2^2=800 ✓.',
    translation: {
      words: { bacteria: 'bactéria', population: 'população', doubles: 'dobra', expression: 'expressão' },
      prompt_pt: 'Uma população de bactérias dobra a cada 3 horas. Se há 200 bactérias no tempo \\(t = 0\\), qual expressão dá a população no tempo \\(t\\) horas?'
    }
  },
  {
    id: 'math-am-e-003',
    section: 'math',
    domain: 'advanced_math',
    skill: 'polynomial_functions',
    difficulty: 'easy',
    type: 'spr',
    passage: '',
    prompt: 'If \\(f(x) = x^2 + 3x - 10\\), what is \\(f(2)\\)?',
    choices: [],
    answer: '0',
    explanation: 'f(2) = (2)² + 3(2) - 10 = 4 + 6 - 10 = 0',
    translation: {
      words: {},
      prompt_pt: 'Se \\(f(x) = x^2 + 3x - 10\\), qual é \\(f(2)\\)?'
    }
  },

  // ─── ADVANCED MATH — medium ──────────────────────────────────────────────

  {
    id: 'math-am-m-001',
    section: 'math',
    domain: 'advanced_math',
    skill: 'quadratic_functions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The quadratic function \\(f(x) = x^2 - 6x + k\\) has exactly one real solution. What is the value of \\(k\\)?',
    choices: ['9', '6', '3', '12'],
    answer: 'A',
    explanation: 'For exactly one solution, the discriminant must equal zero: b² - 4ac = 0. Here b = -6, a = 1, c = k. (-6)² - 4(1)(k) = 0 → 36 - 4k = 0 → k = 9.',
    translation: {
      words: { quadratic: 'quadrática', function: 'função', exactly: 'exatamente', solution: 'solução', value: 'valor' },
      prompt_pt: 'A função quadrática \\(f(x) = x^2 - 6x + k\\) tem exatamente uma solução real. Qual é o valor de \\(k\\)?'
    }
  },
  {
    id: 'math-am-m-002',
    section: 'math',
    domain: 'advanced_math',
    skill: 'exponential_functions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The function \\(g(x) = 5 \\cdot (0.8)^x\\) models the amount of a substance remaining after \\(x\\) years. Which of the following best describes this function?',
    choices: [
      'Exponential decay, because the base is less than 1',
      'Exponential growth, because the coefficient is positive',
      'Linear decrease, because x appears only to the first power',
      'Exponential growth, because the initial value is 5'
    ],
    answer: 'A',
    explanation: 'A base between 0 and 1 (here 0.8) causes the function to decrease exponentially. The initial value and coefficient being positive do not determine growth vs. decay; only the base matters.',
    translation: {
      words: { substance: 'substância', remaining: 'restante', decay: 'decaimento', growth: 'crescimento', coefficient: 'coeficiente', describes: 'descreve' },
      prompt_pt: 'A função \\(g(x) = 5 \\cdot (0.8)^x\\) modela a quantidade de uma substância restante após \\(x\\) anos. Qual das alternativas melhor descreve essa função?'
    }
  },
  {
    id: 'math-am-m-003',
    section: 'math',
    domain: 'advanced_math',
    skill: 'quadratic_functions',
    difficulty: 'medium',
    type: 'spr',
    passage: '',
    prompt: 'The graph of \\(y = (x - 3)^2 - 4\\) has a minimum value at a vertex. What is the \\(y\\)-coordinate of the vertex?',
    choices: [],
    answer: '-4',
    explanation: 'The vertex form is y = (x - h)² + k, where the vertex is (h, k). Here h = 3, k = -4, so the y-coordinate of the vertex is -4.',
    translation: {
      words: { graph: 'gráfico', minimum: 'mínimo', vertex: 'vértice', coordinate: 'coordenada' },
      prompt_pt: 'O gráfico de \\(y = (x - 3)^2 - 4\\) tem um valor mínimo em um vértice. Qual é a coordenada \\(y\\) do vértice?'
    }
  },
  {
    id: 'math-am-m-004',
    section: 'math',
    domain: 'advanced_math',
    skill: 'polynomial_functions',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'Which of the following is a factor of \\(x^3 - 4x^2 - 7x + 10\\) given that \\(x = 1\\) is a root?',
    choices: ['\\((x - 1)\\)', '\\((x + 1)\\)', '\\((x - 2)\\)', '\\((x + 5)\\)'],
    answer: 'A',
    explanation: 'If x = 1 is a root, then (x - 1) is a factor. We can verify: 1 - 4 - 7 + 10 = 0 ✓',
    translation: {
      words: { factor: 'fator', root: 'raiz' },
      prompt_pt: 'Qual das alternativas é um fator de \\(x^3 - 4x^2 - 7x + 10\\) dado que \\(x = 1\\) é uma raiz?'
    }
  },

  // ─── ADVANCED MATH — hard ────────────────────────────────────────────────

  {
    id: 'math-am-h-001',
    section: 'math',
    domain: 'advanced_math',
    skill: 'quadratic_functions',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: '',
    prompt: 'The function \\(h(x) = 2x^2 - 8x + k\\) has a range of \\([k - 8, \\infty)\\). For which values of \\(k\\) does \\(h(x)\\) have no real roots?',
    choices: ['\\(k > 8\\)', '\\(k < 8\\)', '\\(k = 8\\)', '\\(k > 0\\)'],
    answer: 'A',
    explanation: 'The vertex minimum is at x = -b/(2a) = 8/4 = 2. Minimum value = h(2) = 2(4) - 8(2) + k = 8 - 16 + k = k - 8. For no real roots, the minimum value must be > 0: k - 8 > 0 → k > 8.',
    translation: {
      words: { range: 'domínio da imagem', roots: 'raízes', values: 'valores' },
      prompt_pt: 'A função \\(h(x) = 2x^2 - 8x + k\\) tem uma imagem de \\([k - 8, \\infty)\\). Para quais valores de \\(k\\) \\(h(x)\\) não tem raízes reais?'
    }
  },
  {
    id: 'math-am-h-002',
    section: 'math',
    domain: 'advanced_math',
    skill: 'exponential_functions',
    difficulty: 'hard',
    type: 'spr',
    passage: '',
    prompt: 'If \\(4^{x+1} = 8^{x-1}\\), what is the value of \\(x\\)?',
    choices: [],
    answer: '5',
    explanation: '4^(x+1) = 8^(x-1) → 2^(2(x+1)) = 2^(3(x-1)) → 2(x+1) = 3(x-1) → 2x+2 = 3x-3 → x = 5. Check: 4^6 = 4096, 8^4 = 4096 ✓',
    translation: {
      words: { value: 'valor' },
      prompt_pt: 'Se \\(4^{x+1} = 8^{x-1}\\), qual é o valor de \\(x\\)?'
    }
  },

  // ─── PROBLEM-SOLVING & DATA ANALYSIS — easy ──────────────────────────────

  {
    id: 'math-psda-e-001',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'ratios_rates',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A recipe calls for 3 cups of flour for every 2 cups of sugar. If a baker uses 9 cups of flour, how many cups of sugar does she need?',
    choices: ['6', '4.5', '3', '12'],
    answer: 'A',
    explanation: 'Ratio: 3 flour : 2 sugar. If flour = 9, multiply ratio by 3: sugar = 2 × 3 = 6.',
    translation: {
      words: { recipe: 'receita', flour: 'farinha', sugar: 'açúcar', baker: 'padeiro', cups: 'xícaras' },
      prompt_pt: 'Uma receita pede 3 xícaras de farinha para cada 2 xícaras de açúcar. Se uma padeira usa 9 xícaras de farinha, quantas xícaras de açúcar ela precisa?'
    }
  },
  {
    id: 'math-psda-e-002',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'percentages',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A jacket originally costs $80. It is on sale for 25% off. What is the sale price?',
    choices: ['$60', '$55', '$65', '$70'],
    answer: 'A',
    explanation: '25% of $80 = $20 discount. Sale price = $80 - $20 = $60.',
    translation: {
      words: { originally: 'originalmente', costs: 'custa', sale: 'promoção', discount: 'desconto', price: 'preço' },
      prompt_pt: 'Uma jaqueta custa originalmente $80. Está em promoção com 25% de desconto. Qual é o preço promocional?'
    }
  },
  {
    id: 'math-psda-e-003',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'data_interpretation',
    difficulty: 'easy',
    type: 'spr',
    passage: 'A survey of 50 students found that 30 prefer math, 15 prefer science, and 5 prefer English.',
    prompt: 'What percentage of students prefer math?',
    choices: [],
    answer: '60',
    explanation: '30/50 × 100 = 60%',
    translation: {
      words: { survey: 'pesquisa', prefer: 'preferem', percentage: 'porcentagem' },
      passage_pt: 'Uma pesquisa com 50 estudantes descobriu que 30 preferem matemática, 15 preferem ciências e 5 preferem inglês.',
      prompt_pt: 'Que porcentagem dos estudantes prefere matemática?'
    }
  },

  // ─── PROBLEM-SOLVING & DATA ANALYSIS — medium ────────────────────────────

  {
    id: 'math-psda-m-001',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'probability',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'A bag contains 4 red marbles, 6 blue marbles, and 5 green marbles.',
    prompt: 'If one marble is drawn at random, what is the probability that it is NOT blue?',
    choices: ['\\(\\frac{3}{5}\\)', '\\(\\frac{2}{5}\\)', '\\(\\frac{6}{15}\\)', '\\(\\frac{1}{3}\\)'],
    answer: 'A',
    explanation: 'Total marbles = 15. Not blue = 4 + 5 = 9. P(not blue) = 9/15 = 3/5.',
    translation: {
      words: { bag: 'saco', contains: 'contém', marbles: 'bolinhas de gude', drawn: 'sorteada', random: 'aleatório', probability: 'probabilidade' },
      passage_pt: 'Um saco contém 4 bolinhas vermelhas, 6 azuis e 5 verdes.',
      prompt_pt: 'Se uma bolinha for sorteada aleatoriamente, qual é a probabilidade de que NÃO seja azul?'
    }
  },
  {
    id: 'math-psda-m-002',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'statistics',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The scores on a math test were: 72, 85, 90, 88, 76, 85, 93, 85, 79, and 67.',
    prompt: 'What is the median score?',
    choices: ['85', '86.5', '82', '85.5'],
    answer: 'A',
    explanation: 'Sorted (10 values): 67, 72, 76, 79, 85, 85, 85, 88, 90, 93. With an even count, the median is the average of the 5th and 6th values: (85 + 85) ÷ 2 = 85.',
    translation: {
      words: { scores: 'notas', median: 'mediana' },
      passage_pt: 'As notas em uma prova de matemática foram: 72, 85, 90, 88, 76, 85, 93, 85, 79 e 67.',
      prompt_pt: 'Qual é a mediana das notas?'
    }
  },
  {
    id: 'math-psda-m-002b',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'statistics',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: 'The scores on a math test were: 72, 85, 90, 88, 76, 85, 93, 79, and 67.',
    prompt: 'What is the median score?',
    choices: ['85', '82', '79', '88'],
    answer: 'A',
    explanation: 'Sorted (9 values): 67, 72, 76, 79, 85, 85, 88, 90, 93. Middle value (5th) = 85.',
    translation: {
      words: { scores: 'notas', median: 'mediana' },
      passage_pt: 'As notas em uma prova de matemática foram: 72, 85, 90, 88, 76, 85, 93, 79 e 67.',
      prompt_pt: 'Qual é a mediana das notas?'
    }
  },
  {
    id: 'math-psda-m-003',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'ratios_rates',
    difficulty: 'medium',
    type: 'spr',
    passage: '',
    prompt: 'A car travels 240 miles in 4 hours. At this rate, how many hours will it take the same car to travel 390 miles?',
    choices: [],
    answer: '6.5',
    explanation: 'Rate = 240/4 = 60 mph. Time = 390/60 = 6.5 hours.',
    translation: {
      words: { travels: 'percorre', miles: 'milhas', rate: 'taxa', hours: 'horas' },
      prompt_pt: 'Um carro percorre 240 milhas em 4 horas. Nessa taxa, quantas horas levará para o mesmo carro percorrer 390 milhas?'
    }
  },

  // ─── PROBLEM-SOLVING & DATA ANALYSIS — hard ──────────────────────────────

  {
    id: 'math-psda-h-001',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'probability',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'A company surveyed 200 employees. Of those, 120 use public transportation, 90 own a car, and 40 use both. Employees who use neither mode use bikes.',
    prompt: 'What fraction of employees use bikes?',
    choices: ['\\(\\frac{3}{20}\\)', '\\(\\frac{1}{4}\\)', '\\(\\frac{3}{10}\\)', '\\(\\frac{7}{20}\\)'],
    answer: 'A',
    explanation: 'By inclusion-exclusion: employees using transit or car = 120 + 90 − 40 = 170. Bike users = 200 − 170 = 30. Fraction = 30/200 = 3/20.',
    translation: {
      words: { surveyed: 'pesquisou', employees: 'funcionários', public: 'público', transportation: 'transporte', fraction: 'fração', bikes: 'bicicletas' },
      passage_pt: 'Uma empresa pesquisou 200 funcionários. Desses, 120 usam transporte público, 90 têm carro e 40 usam ambos. Os que não usam nenhum dos dois usam bicicleta.',
      prompt_pt: 'Que fração dos funcionários usa bicicleta?'
    }
  },
  {
    id: 'math-psda-h-001b',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'probability',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: 'A company surveyed 200 employees. Of those, 120 use public transportation, 90 own a car, and 70 use both.',
    prompt: 'What fraction of the 200 employees use neither public transportation nor own a car?',
    choices: ['\\(\\frac{3}{10}\\)', '\\(\\frac{7}{20}\\)', '\\(\\frac{1}{4}\\)', '\\(\\frac{1}{5}\\)'],
    answer: 'A',
    explanation: 'By inclusion-exclusion: using transit or car = 120 + 90 - 70 = 140. Neither = 200 - 140 = 60. Fraction = 60/200 = 3/10.',
    translation: {
      words: { surveyed: 'pesquisou', employees: 'funcionários', fraction: 'fração', neither: 'nenhum' },
      passage_pt: 'Uma empresa pesquisou 200 funcionários. Desses, 120 usam transporte público, 90 têm carro e 70 usam ambos.',
      prompt_pt: 'Que fração dos 200 funcionários não usa transporte público nem tem carro?'
    }
  },
  {
    id: 'math-psda-h-002',
    section: 'math',
    domain: 'problem_solving_data_analysis',
    skill: 'statistics',
    difficulty: 'hard',
    type: 'spr',
    passage: 'A dataset has a mean of 50 and a standard deviation of 5. A new data point of 65 is added to the dataset of 20 values.',
    prompt: 'What is the new mean, rounded to one decimal place?',
    choices: [],
    answer: '50.7',
    explanation: 'Original sum = 50 × 20 = 1000. New sum = 1000 + 65 = 1065. New mean = 1065/21 ≈ 50.71 ≈ 50.7.',
    translation: {
      words: { dataset: 'conjunto de dados', mean: 'média', standard: 'padrão', deviation: 'desvio', values: 'valores', rounded: 'arredondado' },
      passage_pt: 'Um conjunto de dados tem média de 50 e desvio padrão de 5. Um novo dado de 65 é adicionado ao conjunto de 20 valores.',
      prompt_pt: 'Qual é a nova média, arredondada para uma casa decimal?'
    }
  },

  // ─── GEOMETRY & TRIGONOMETRY — easy ──────────────────────────────────────

  {
    id: 'math-geo-e-001',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'area_volume',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A rectangle has a length of 12 cm and a width of 5 cm. What is its area?',
    choices: ['60 cm²', '34 cm²', '17 cm²', '120 cm²'],
    answer: 'A',
    explanation: 'Area = length × width = 12 × 5 = 60 cm².',
    translation: {
      words: { rectangle: 'retângulo', length: 'comprimento', width: 'largura', area: 'área' },
      prompt_pt: 'Um retângulo tem comprimento de 12 cm e largura de 5 cm. Qual é sua área?'
    }
  },
  {
    id: 'math-geo-e-002',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'triangles',
    difficulty: 'easy',
    type: 'multiple_choice',
    passage: '',
    prompt: 'In a right triangle, one leg measures 3 and the other leg measures 4. What is the length of the hypotenuse?',
    choices: ['5', '7', '6', '\\(\\sqrt{7}\\)'],
    answer: 'A',
    explanation: 'By the Pythagorean theorem: c² = 3² + 4² = 9 + 16 = 25, so c = 5.',
    translation: {
      words: { right: 'reto', triangle: 'triângulo', leg: 'cateto', measures: 'mede', hypotenuse: 'hipotenusa', length: 'comprimento' },
      prompt_pt: 'Em um triângulo retângulo, um cateto mede 3 e o outro mede 4. Qual é o comprimento da hipotenusa?'
    }
  },
  {
    id: 'math-geo-e-003',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'circles',
    difficulty: 'easy',
    type: 'spr',
    passage: '',
    prompt: 'A circle has a radius of 7. What is the area of the circle? (Use \\(\\pi \\approx 3.14\\) and round to the nearest whole number.)',
    choices: [],
    answer: '154',
    explanation: 'Area = πr² = 3.14 × 49 ≈ 153.86 ≈ 154.',
    translation: {
      words: { circle: 'círculo', radius: 'raio', area: 'área', nearest: 'mais próximo', whole: 'inteiro' },
      prompt_pt: 'Um círculo tem raio de 7. Qual é a área do círculo? (Use \\(\\pi \\approx 3.14\\) e arredonde para o inteiro mais próximo.)'
    }
  },

  // ─── GEOMETRY & TRIGONOMETRY — medium ────────────────────────────────────

  {
    id: 'math-geo-m-001',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'trigonometry',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'In a right triangle, the angle \\(\\theta\\) satisfies \\(\\sin \\theta = \\frac{3}{5}\\). What is \\(\\cos \\theta\\)?',
    choices: ['\\(\\frac{4}{5}\\)', '\\(\\frac{3}{4}\\)', '\\(\\frac{5}{3}\\)', '\\(\\frac{1}{5}\\)'],
    answer: 'A',
    explanation: 'If sin θ = 3/5, then the opposite = 3, hypotenuse = 5, adjacent = √(25 - 9) = 4. cos θ = adjacent/hypotenuse = 4/5.',
    translation: {
      words: { angle: 'ângulo', satisfies: 'satisfaz', opposite: 'oposto', adjacent: 'adjacente', hypotenuse: 'hipotenusa' },
      prompt_pt: 'Em um triângulo retângulo, o ângulo \\(\\theta\\) satisfaz \\(\\sin \\theta = \\frac{3}{5}\\). Qual é \\(\\cos \\theta\\)?'
    }
  },
  {
    id: 'math-geo-m-002',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'area_volume',
    difficulty: 'medium',
    type: 'spr',
    passage: '',
    prompt: 'A cylinder has a radius of 3 cm and a height of 8 cm. What is its volume? (Use \\(\\pi \\approx 3.14\\) and round to the nearest whole number.)',
    choices: [],
    answer: '226',
    explanation: 'V = πr²h = 3.14 × 9 × 8 = 3.14 × 72 ≈ 226.08 ≈ 226.',
    translation: {
      words: { cylinder: 'cilindro', radius: 'raio', height: 'altura', volume: 'volume', nearest: 'mais próximo' },
      prompt_pt: 'Um cilindro tem raio de 3 cm e altura de 8 cm. Qual é seu volume? (Use \\(\\pi \\approx 3.14\\) e arredonde para o inteiro mais próximo.)'
    }
  },
  {
    id: 'math-geo-m-003',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'triangles',
    difficulty: 'medium',
    type: 'multiple_choice',
    passage: '',
    prompt: 'Two similar triangles have corresponding sides in a ratio of 2:5. If the area of the smaller triangle is 16 cm², what is the area of the larger triangle?',
    choices: ['100 cm²', '40 cm²', '80 cm²', '200 cm²'],
    answer: 'A',
    explanation: 'The ratio of areas of similar figures equals the square of the ratio of corresponding sides: (2/5)² = 4/25. So larger area = 16 × (25/4) = 100 cm².',
    translation: {
      words: { similar: 'semelhantes', triangles: 'triângulos', corresponding: 'correspondentes', ratio: 'razão', area: 'área', larger: 'maior', smaller: 'menor' },
      prompt_pt: 'Dois triângulos semelhantes têm lados correspondentes na razão 2:5. Se a área do triângulo menor é 16 cm², qual é a área do triângulo maior?'
    }
  },

  // ─── GEOMETRY & TRIGONOMETRY — hard ──────────────────────────────────────

  {
    id: 'math-geo-h-001',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'circles',
    difficulty: 'hard',
    type: 'multiple_choice',
    passage: '',
    prompt: 'A circle with center \\(O\\) has a radius of 10. Chord \\(AB\\) is 16 units long. What is the distance from the center \\(O\\) to the chord \\(AB\\)?',
    choices: ['6', '8', '4', '\\(\\sqrt{44}\\)'],
    answer: 'A',
    explanation: 'The perpendicular from center to chord bisects the chord. Half of AB = 8. By Pythagorean theorem: d² + 8² = 10² → d² = 100 - 64 = 36 → d = 6.',
    translation: {
      words: { center: 'centro', radius: 'raio', chord: 'corda', distance: 'distância', perpendicular: 'perpendicular', bisects: 'bisecciona' },
      prompt_pt: 'Um círculo com centro \\(O\\) tem raio de 10. A corda \\(AB\\) tem 16 unidades de comprimento. Qual é a distância do centro \\(O\\) à corda \\(AB\\)?'
    }
  },
  {
    id: 'math-geo-h-002',
    section: 'math',
    domain: 'geometry_trigonometry',
    skill: 'trigonometry',
    difficulty: 'hard',
    type: 'spr',
    passage: '',
    prompt: 'A 30-foot ladder leans against a wall. The base of the ladder is 18 feet from the wall. How high up the wall does the ladder reach? (Round to the nearest foot.)',
    choices: [],
    answer: '24',
    explanation: 'h² + 18² = 30² → h² = 900 - 324 = 576 → h = 24 feet.',
    translation: {
      words: { ladder: 'escada', leans: 'apoia', wall: 'parede', base: 'base', reach: 'alcança', feet: 'pés', nearest: 'mais próximo' },
      prompt_pt: 'Uma escada de 30 pés apoia-se em uma parede. A base da escada está a 18 pés da parede. A que altura da parede a escada alcança? (Arredonde para o pé mais próximo.)'
    }
  },
];

export default MATH_QUESTIONS;
