const { chromium } = require('playwright');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'docs', 'design', 'WorkFlowX-Logo-v3.html').replace(/\\/g, '/');
const outPath = path.join(__dirname, '..', 'docs', 'assets', 'WorkFlowX-Logo.png');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 960, height: 480 });
  await page.goto('file:///' + htmlPath);
  await page.waitForTimeout(500);
  // Clip: centered crop around the content with comfortable padding
  // Content is ~400x110, centered in 960x480 → clip 560x180 at (200, 150)
  await page.screenshot({
    path: outPath,
    type: 'png',
    clip: { x: 200, y: 150, width: 560, height: 180 },
  });
  console.log('Done:', outPath);
  await browser.close();
})();
