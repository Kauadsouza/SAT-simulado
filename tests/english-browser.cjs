const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

// An isolated local profile; no real account or microphone is used.
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'] });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['microphone', 'clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const base = process.env.ENGLISH_TEST_URL || 'http://127.0.0.1:4179';
  const artifacts = path.resolve('test-artifacts'); fs.mkdirSync(artifacts, { recursive: true });
  async function localAccess() {
    await page.getByRole('button', { name: 'Continuar com o histórico local' }).click({ timeout: 20000 });
    const name = page.getByPlaceholder('Digite seu nome');
    if (await name.isVisible()) { await name.fill('English browser verification'); await page.getByRole('button', { name: 'Entrar →' }).click(); }
    await page.getByRole('navigation', { name: 'Áreas de estudo' }).waitFor();
  }
  const headings = { 'Meu plano': /Seu inglês\./, 'Cursos grátis': /Escolha sua próxima aula/, 'Praticar': /Aprenda fazendo\./, 'Conversação': /Vamos conversar\?/, 'SAT': /Seu espaço para o SAT continua aqui\./, 'ACT': /Conheça o ACT, no formato atual\./, 'TOEFL': /Inglês para entender e participar\./ };
  async function tab(name) { await page.getByRole('navigation').getByRole('link', { name, exact: true }).click(); await page.getByRole('heading', { name: headings[name] }).waitFor(); }
  try {
    await page.goto(base); await localAccess();
    await page.getByRole('heading', { name: /Seu inglês\./ }).waitFor();
    assert.equal(await page.getByRole('button', { name: /Inglês britânico/ }).getAttribute('aria-pressed'), 'true');
    await page.screenshot({ path: path.join(artifacts, 'home-desktop.png'), fullPage: true });
    await page.getByRole('button', { name: 'Ajustar plano' }).click();
    await page.getByLabel('Tempo por sessão').selectOption('15');
    await page.getByLabel('Dias por semana').selectOption('3');
    await page.getByRole('button', { name: 'Salvar plano', exact: true }).click();
    await page.getByRole('heading', { name: 'Seu roteiro de hoje' }).waitFor();
    await page.getByRole('checkbox', { name: 'Concluir: Ouvir e entender' }).click();
    await page.waitForFunction(() => document.querySelector('input[aria-label="Concluir: Ouvir e entender"]').checked);
    await tab('Cursos grátis');
    assert.equal(await page.locator('.learn-course').count(), 8);
    const course = page.locator('.learn-course').first();
    await course.getByRole('combobox').selectOption('in_progress');
    await course.getByText('Anotar onde parei', { exact: true }).click();
    await course.getByLabel('Onde parei').fill('Lesson 2 — repeat the introductions.');
    await course.getByRole('button', { name: 'Salvar anotação' }).click();
    await page.reload(); await localAccess();
    await page.locator('.learn-course').first().waitFor();
    assert.equal(await page.locator('.learn-course').first().getByRole('combobox').inputValue(), 'in_progress');
    await page.locator('.learn-course').first().getByText('Anotar onde parei', { exact: true }).click();
    assert.equal(await page.locator('.learn-course').first().getByLabel('Onde parei').inputValue(), 'Lesson 2 — repeat the introductions.');
    await page.getByRole('button', { name: 'Em andamento', exact: true }).click();
    assert.equal(await page.locator('.learn-course').count(), 1);
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await page.getByRole('button', { name: /Inglês americano/ }).click();
    await page.getByRole('heading', { name: /Escolha sua próxima aula/ }).waitFor();
    assert.equal(await page.locator('.learn-course').count(), 8);
    await page.getByRole('heading', { name: /Let’s Learn English/ }).waitFor();
    await page.getByRole('button', { name: /Inglês britânico/ }).click();
    await page.getByRole('heading', { name: /Escolha sua próxima aula/ }).waitFor();
    await tab('Praticar');
    await page.getByRole('button', { name: 'Conferir o que entendi →' }).click();
    await page.getByRole('radio', { name: 'Music and video games', exact: true }).check();
    await page.getByRole('radio', { name: 'At the library', exact: true }).check();
    await page.getByRole('button', { name: 'Conferir respostas' }).click();
    assert.equal(await page.locator('.learn-correct').count(), 2);
    await page.getByRole('button', { name: 'Agora é minha vez de escrever →' }).click();
    await page.getByLabel('Minha tentativa').fill('I am learning English. I like videos.');
    await page.getByRole('button', { name: 'Salvar anotação' }).click();
    await page.getByRole('button', { name: 'Guardar frase para revisar' }).click();
    await page.getByText('Frase adicionada à revisão.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Marcar esta prática como feita' }).click();
    await page.getByText('Praticada ✓', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Abrir revisão de hoje' }).click();
    await page.getByRole('button', { name: /revelar|mostrar/i }).first().click();
    await page.getByRole('button', { name: 'Bom', exact: true }).click();
    await tab('Conversação');
    await page.getByRole('button', { name: /YouTube e criação/ }).click();
    assert.match(await page.locator('#voice-prompt').inputValue(), /vídeo/);
    await page.getByRole('button', { name: 'Copiar contexto' }).click();
    await page.getByText('Contexto copiado. Agora cole no ChatGPT.', { exact: true }).waitFor();
    await page.getByRole('button', { name: '● Gravar minha tentativa' }).click();
    await page.getByRole('button', { name: '■ Parar gravação' }).waitFor();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: '■ Parar gravação' }).click();
    await page.locator('audio').waitFor();
    assert.match(await page.locator('audio').getAttribute('src'), /^blob:/);
    await tab('ACT');
    for (const answer of ['The list of topics is on the desk.', 'A contrast', '30']) await page.getByRole('radio', { name: answer, exact: true }).check();
    await page.getByRole('button', { name: 'Conferir e entender' }).click();
    assert.equal(await page.locator('.learn-correct').count(), 3);
    await tab('TOEFL');
    for (const chunk of ['Could you', 'tell me', 'what time', 'the lesson starts?']) await page.getByRole('button', { name: chunk, exact: true }).click();
    await page.getByRole('button', { name: 'Conferir frase' }).click();
    await page.getByText('Isso mesmo!', { exact: false }).waitFor();
    await page.getByRole('button', { name: 'Speaking', exact: true }).click();
    await page.getByRole('heading', { name: 'Take an Interview · responder com suas ideias' }).waitFor();
    await tab('SAT');
    await page.getByRole('link', { name: 'Meu painel SAT' }).click();
    await page.waitForURL('**/sat/resultados');
    await tab('Meu plano');
    assert.equal(await page.getByRole('checkbox', { name: 'Concluir: Ouvir e entender' }).isChecked(), true);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const name of ['Meu plano', 'Cursos grátis', 'Praticar', 'Conversação', 'SAT', 'ACT', 'TOEFL']) {
      await tab(name); await page.locator('h1').waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, `horizontal overflow: ${name}`);
      await page.screenshot({ path: path.join(artifacts, `${name.replace(/[^a-z]/gi, '-')}-mobile.png`), fullPage: true });
    }
    await page.getByRole('button', { name: 'Ativar tema claro' }).click();
    await tab('Meu plano');
    await page.screenshot({ path: path.join(artifacts, 'home-mobile-light.png'), fullPage: true });
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log('PASS: navigation, notes/reload, settings/checklist, quizzes, SRS, clipboard, synthetic microphone, legacy SAT, seven mobile routes, light theme, no browser exceptions.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
