const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(BASE, 'images');

const pages = [
  { file: '01a-architecture-zh.html', out: '01a-architecture-zh.png', width: 720 },
  { file: '01b-architecture-zh.html', out: '01b-architecture-zh.png', width: 720 },
  { file: '03a-token-optimization-zh.html', out: '03a-token-optimization-zh.png', width: 720 },
  { file: '03b-token-optimization-zh.html', out: '03b-token-optimization-zh.png', width: 720 },
  { file: '05a-capabilities-zh.html', out: '05a-capabilities-zh.png', width: 720 },
  { file: '05b-capabilities-zh.html', out: '05b-capabilities-zh.png', width: 720 },
  { file: '01a-architecture.html', out: '01a-architecture.png', width: 720 },
  { file: '01b-architecture.html', out: '01b-architecture.png', width: 720 },
  { file: '03a-token-optimization.html', out: '03a-token-optimization.png', width: 720 },
  { file: '03b-token-optimization.html', out: '03b-token-optimization.png', width: 720 },
  { file: '05a-capabilities.html', out: '05a-capabilities.png', width: 720 },
  { file: '05b-capabilities.html', out: '05b-capabilities.png', width: 720 },
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
