const { chromium } = require('playwright');
const path = require('path');

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(__dirname, '..', 'docs', 'assets');

const pages = [
  { file: 'WorkFlowX-Logo.html', out: 'WorkFlowX-Logo.png', width: 960, height: 480 },
  { file: '01-architecture.html', out: '01-architecture.png', width: 1024 },
  { file: '01-architecture-zh.html', out: '01-architecture-zh.png', width: 1024 },
  { file: '03-token-optimization.html', out: '03-token-optimization.png', width: 1024 },
  { file: '03-token-optimization-zh.html', out: '03-token-optimization-zh.png', width: 1024 },
  { file: '05-capabilities.html', out: '05-capabilities.png', width: 1024 },
  { file: '05-capabilities-zh.html', out: '05-capabilities-zh.png', width: 1024 },
];

(async () => {
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  for (const p of pages) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: p.width, height: p.height || 800 });
    await page.goto('file:///' + path.join(BASE, p.file).replace(/\\/g, '/'));
    await page.waitForTimeout(500);

    await page.screenshot({ path: path.join(OUT, p.out), type: 'png', fullPage: true });
    console.log('Captured:', p.out);
    await page.close();
  }

  await browser.close();
  console.log('Done. All PNGs captured.');
})();
