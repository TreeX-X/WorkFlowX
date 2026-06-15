const { chromium } = require('playwright');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'docs', 'design', 'WorkFlowX-Logo.html').replace(/\\/g, '/');
const outPath = path.join(__dirname, '..', 'docs', 'assets', 'WorkFlowX-Logo.png');

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

(async () => {
  const browser = await launchBrowser();
  const context = await browser.newContext({
    viewport: { width: 1400, height: 420 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('file:///' + htmlPath);
  await page.waitForTimeout(300);
  const box = await page.locator('.logo-lockup').boundingBox();
  const padding = 72;
  const x = Math.max(0, box.x - padding);
  const y = Math.max(0, box.y - padding);
  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: {
      x,
      y,
      width: Math.min(1400 - x, box.width + padding * 2),
      height: Math.min(420 - y, box.height + padding * 2),
    },
  });
  console.log('Done:', outPath);
  await context.close();
  await browser.close();
})();
