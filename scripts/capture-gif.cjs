const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { PNG } = require('pngjs');
const GifEncoder = require('omggif').GifWriter;

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(BASE, 'images', '06-workflow-animation.gif');
const HTML = path.join(BASE, '06-workflow-animation.html');

const WIDTH = 1200;
const HEIGHT = 800;
const DURATION_MS = 29000;
const INTERVAL_MS = 400;

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  await page.goto('file:///' + HTML.replace(/\\/g, '/'));
  await page.waitForTimeout(200);

  const totalFrames = Math.ceil(DURATION_MS / INTERVAL_MS);
  console.log(`Capturing ${totalFrames} frames...`);

  // Collect all frames as RGBA buffers
  const frames = [];
  for (let i = 0; i < totalFrames; i++) {
    await page.waitForTimeout(INTERVAL_MS);
    const buf = await page.screenshot({ type: 'png' });
    const png = PNG.sync.read(buf);
    // Convert RGBA to indexed color (palette) for GIF
    // Quantize to 256 colors using simple approach
    const indexed = quantize(png.data, WIDTH, HEIGHT);
    frames.push(indexed);
    if (i % 10 === 0) console.log(`Frame ${i + 1}/${totalFrames}`);
  }

  await browser.close();

  // Build GIF
  console.log('Encoding GIF...');
  const gifBuf = Buffer.alloc(WIDTH * HEIGHT * totalFrames + 1024);
  const writer = new GifEncoder(gifBuf, WIDTH, HEIGHT, {
    loop: 0, // infinite loop
  });

  for (const frame of frames) {
    writer.addFrame(0, 0, WIDTH, HEIGHT, frame.pixels, {
      palette: frame.palette,
      delay: INTERVAL_MS / 10, // GIF delay is in 1/100s
      disposal: 2,
    });
  }

  const gifSize = writer.end();
  fs.writeFileSync(OUT, gifBuf.slice(0, gifSize));
  console.log(`Done. GIF: ${(gifSize / 1024 / 1024).toFixed(1)} MB → ${OUT}`);
})();

// Simple color quantization to 256 colors with O(1) lookup
function quantize(rgba, w, h) {
  const colorMap = new Map();
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i] >> 3;
    const g = rgba[i + 1] >> 3;
    const b = rgba[i + 2] >> 3;
    const key = (r << 10) | (g << 5) | b;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  const sorted = [...colorMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 256);
  const palette = [];
  for (const [key] of sorted) {
    const r = ((key >> 10) & 0x1F) << 3;
    const g = ((key >> 5) & 0x1F) << 3;
    const b = (key & 0x1F) << 3;
    palette.push((r << 16) | (g << 8) | b); // packed 0xRRGGBB
  }
  // Pad to power-of-2 if needed (256 is already power of 2, but just in case)
  while (palette.length < 256) palette.push(0);

  // Build O(1) lookup table: 32*32*32 = 32768 entries
  const paletteKeys = sorted.map(([k]) => k);
  const paletteR = paletteKeys.map(k => (k >> 10) & 0x1F);
  const paletteG = paletteKeys.map(k => (k >> 5) & 0x1F);
  const paletteB = paletteKeys.map(k => k & 0x1F);

  const lut = new Uint8Array(32768);
  for (let key = 0; key < 32768; key++) {
    const r = (key >> 10) & 0x1F;
    const g = (key >> 5) & 0x1F;
    const b = key & 0x1F;
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let j = 0; j < paletteKeys.length; j++) {
      const dist = (r - paletteR[j]) ** 2 + (g - paletteG[j]) ** 2 + (b - paletteB[j]) ** 2;
      if (dist < bestDist) { bestDist = dist; bestIdx = j; }
    }
    lut[key] = bestIdx;
  }

  const pixels = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const off = i * 4;
    const key = ((rgba[off] >> 3) << 10) | ((rgba[off + 1] >> 3) << 5) | (rgba[off + 2] >> 3);
    pixels[i] = lut[key];
  }

  return { pixels, palette };
}
