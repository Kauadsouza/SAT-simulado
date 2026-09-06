const { chromium } = require('playwright');
(async () => {
  const base = 'http://localhost:5175';
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(base + '/login');
  await page.fill('input[type="text"]', 'Nathaly');
  await page.click('button[type="submit"]');
  await page.waitForURL(base + '/');
  await page.screenshot({ path: 'C:/Users/USUARIO/AppData/Local/Temp/guia_dash.png' });
  await page.goto(base + '/guia');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'C:/Users/USUARIO/AppData/Local/Temp/guia_page.png' });
  // Click Math algebra to expand
  await page.locator('button').filter({ hasText: 'Algebra' }).first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'C:/Users/USUARIO/AppData/Local/Temp/guia_algebra.png' });
  await browser.close();
  console.log('done');
})();
