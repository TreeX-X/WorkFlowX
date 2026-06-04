const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(BASE, 'images');

const pages = [
  { file: '01-architecture-zh.html', out: '01-architecture-zh.png', width: 720 },
  { file: '03-token-optimization-zh.html', out: '03-token-optimization-zh.png', width: 720 },
  { file: '05-capabilities-zh.html', out: '05-capabilities-zh.png', width: 720 },
];

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: p.width, height: 800 });
    await page.goto('file:///' + path.join(BASE, p.file).replace(/\\/g, '/'));
    await page.waitForTimeout(500);

    const container = await page.$('.container');
    if (container) {
      await container.screenshot({ path: path.join(OUT, p.out), type: 'png' });
    } else {
      await page.screenshot({ path: path.join(OUT, p.out), type: 'png', fullPage: true });
    }
    console.log('Captured:', p.out);
    await page.close();
  }

  await browser.close();
  console.log('Done. All PNGs captured.');
})();
