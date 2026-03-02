const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    console.log('[PAGE]', msg.type(), msg.text());
  });

  page.on('pageerror', err => {
    consoleMessages.push({ type: 'pageerror', text: String(err) });
    console.error('[PAGE ERROR]', err);
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      consoleMessages.push({ type: 'response', status: response.status(), url: response.url() });
      console.warn('[RESPONSE]', response.status(), response.url());
    }
  });

  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'headless-check-screenshot.png', fullPage: true });
    console.log('Screenshot saved: headless-check-screenshot.png');
  } catch (err) {
    console.error('Error loading page:', err);
  }

  await browser.close();
  // Write summary
  const fs = require('fs');
  fs.writeFileSync('headless-check-log.json', JSON.stringify(consoleMessages, null, 2));
  console.log('Log saved: headless-check-log.json');
})();
