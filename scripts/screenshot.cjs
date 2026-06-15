const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(__dirname, '..', 'docs', 'assets');

const pages = [
  { file: 'WorkFlowX-Logo.html', out: 'WorkFlowX-Logo.png', width: 1400, height: 420, selector: '.logo-lockup', padding: 72 },
  { file: '01-architecture-v2.html', out: '01-architecture.png', width: 1600, height: 1000 },
  { file: '01-architecture-v2-zh.html', out: '01-architecture-zh.png', width: 1600, height: 1000 },
  { file: '03-token-optimization-v2.html', out: '03-token-optimization.png', width: 1600, height: 1000 },
  { file: '03-token-optimization-v2-zh.html', out: '03-token-optimization-zh.png', width: 1600, height: 1000 },
  { file: '05-capabilities-v2.html', out: '05-capabilities.png', width: 1600, height: 1000 },
  { file: '05-capabilities-v2-zh.html', out: '05-capabilities-zh.png', width: 1600, height: 1000 },
];

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await launchBrowser();

  for (const p of pages) {
    const context = await browser.newContext({
      viewport: { width: p.width, height: p.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('file:///' + path.join(BASE, p.file).replace(/\\/g, '/'), { waitUntil: 'load' });
    await page.waitForTimeout(300);

    if (p.selector) {
      const box = await page.locator(p.selector).boundingBox();
      const padding = p.padding || 0;
      const x = Math.max(0, box.x - padding);
      const y = Math.max(0, box.y - padding);
      await page.screenshot({
        path: path.join(OUT, p.out),
        type: 'png',
        clip: {
          x,
          y,
          width: Math.min(p.width - x, box.width + padding * 2),
          height: Math.min(p.height - y, box.height + padding * 2),
        },
      });
    } else {
      await page.screenshot({ path: path.join(OUT, p.out), type: 'png', fullPage: false });
    }
    console.log('Captured:', p.out);
    await context.close();
  }

  await browser.close();
  console.log('Done. All PNGs captured.');
})();
