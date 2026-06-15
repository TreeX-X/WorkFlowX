const { chromium } = require('playwright');
const { spawnSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const path = require('path');
const fs = require('fs');

const BASE = path.join(__dirname, '..', 'docs', 'design');
const OUT = path.join(__dirname, '..', 'docs', 'assets');

const WIDTH = 1200;
const HEIGHT = 800;
const FPS = 10;
const PRE_ROLL_MS = 1300;
const DURATION_MS = 34000;
const FRAME_COUNT = Math.ceil((DURATION_MS / 1000) * FPS);

const targets = [
  { html: '06-workflow-animation-v2-zh.html', out: '06-workflow-animation.gif' },
  { html: '06-workflow-animation-v2.html', out: '06-workflow-animation-en.gif' },
];

async function launchBrowser() {
  try {
    return await chromium.launch({ channel: 'msedge', headless: true });
  } catch {
    return await chromium.launch({ headless: true });
  }
}

function fileUrl(file) {
  return 'file:///' + file.replace(/\\/g, '/');
}

function runFfmpeg(tmpDir, outPath) {
  const input = path.join(tmpDir, 'frame-%04d.png');
  const paletteFilter = [
    `[0:v]fps=${FPS},scale=${WIDTH}:-1:flags=lanczos,split[s0][s1]`,
    `[s0]palettegen=max_colors=128:stats_mode=diff[p]`,
    `[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
  ].join(';');

  const result = spawnSync(ffmpeg, [
    '-y',
    '-framerate', String(FPS),
    '-i', input,
    '-filter_complex', paletteFilter,
    '-loop', '0',
    outPath,
  ], { stdio: 'inherit' });

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${outPath}`);
  }
}

(async () => {
  const browser = await launchBrowser();

  for (const target of targets) {
    const tmpDir = path.join(OUT, `.gif-frames-${Date.now()}-${process.pid}-${path.basename(target.out, '.gif')}`);
    fs.mkdirSync(tmpDir, { recursive: true });

    const context = await browser.newContext({
      viewport: { width: WIDTH, height: HEIGHT },
      deviceScaleFactor: 1,
    });
    await context.addInitScript(() => {
      window.__recording = true;
      const nativeSetTimeout = window.setTimeout;
      window.setTimeout = (handler, timeout = 0, ...args) => {
        const scaledTimeout = typeof timeout === 'number' ? timeout * 0.5 : timeout;
        return nativeSetTimeout(handler, scaledTimeout, ...args);
      };
    });

    const page = await context.newPage();
    const htmlPath = path.join(BASE, target.html);
    await page.goto(fileUrl(htmlPath), { waitUntil: 'load' });
    await page.waitForTimeout(PRE_ROLL_MS);

    console.log(`Capturing ${FRAME_COUNT} frames: ${target.html}`);
    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const frame = path.join(tmpDir, `frame-${String(i).padStart(4, '0')}.png`);
      await page.screenshot({ path: frame, type: 'png' });
      await page.waitForTimeout(1000 / FPS);
      if ((i + 1) % 24 === 0 || i === FRAME_COUNT - 1) {
        console.log(`  ${i + 1}/${FRAME_COUNT}`);
      }
    }

    await context.close();

    const outPath = path.join(OUT, target.out);
    console.log(`Encoding GIF: ${target.out}`);
    runFfmpeg(tmpDir, outPath);
    fs.rmSync(tmpDir, { recursive: true, force: true });

    const size = fs.statSync(outPath).size / 1024 / 1024;
    console.log(`Done: ${target.out} (${size.toFixed(2)} MB)`);
  }

  await browser.close();
})();
