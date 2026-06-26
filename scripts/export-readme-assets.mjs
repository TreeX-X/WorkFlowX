import { chromium } from "playwright";
import ffmpegPath from "ffmpeg-static";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const assetDir = path.join(root, "docs", "assets");
const source = path.join(assetDir, "readme-visuals.html");
const framesDir = path.join(assetDir, ".readme-frames");
const url = pathToFileURL(source).href;

const stills = [
  ["architecture", "zh", "01-architecture-zh.png"],
  ["architecture", "en", "01-architecture.png"],
  ["token", "zh", "03-token-optimization-zh.png"],
  ["token", "en", "03-token-optimization.png"],
  ["capabilities", "zh", "05-capabilities-zh.png"],
  ["capabilities", "en", "05-capabilities.png"],
];

const edgePaths = [
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
];

let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  const executablePath = edgePaths.find((candidate) => existsSync(candidate));
  if (!executablePath) throw error;
  browser = await chromium.launch({ executablePath });
}
const page = await browser.newPage({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1 });

async function waitReady() {
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 10000 });
  await page.waitForTimeout(120);
}

for (const [scene, lang, filename] of stills) {
  await page.goto(`${url}?scene=${scene}&lang=${lang}`);
  await waitReady();
  await page.screenshot({ path: path.join(assetDir, filename), fullPage: false });
}

await rm(framesDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });

async function renderGif(lang, output) {
  const langDir = path.join(framesDir, lang);
  await mkdir(langDir, { recursive: true });
  const frames = 240;
  for (let i = 0; i < frames; i += 1) {
    const t = i / frames;
    await page.goto(`${url}?scene=workflow&lang=${lang}&t=${t.toFixed(5)}`);
    await waitReady();
    await page.screenshot({ path: path.join(langDir, `frame-${String(i).padStart(3, "0")}.png`), fullPage: false });
  }

  const palette = path.join(langDir, "palette.png");
  const input = path.join(langDir, "frame-%03d.png");
  const outputPath = path.join(assetDir, output);

  runFfmpeg([
    "-y",
    "-framerate", "12",
    "-i", input,
    "-vf", "fps=12,scale=960:-1:flags=lanczos,palettegen=stats_mode=diff",
    palette,
  ]);

  runFfmpeg([
    "-y",
    "-framerate", "12",
    "-i", input,
    "-i", palette,
    "-lavfi", "fps=12,scale=960:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3",
    "-loop", "0",
    outputPath,
  ]);
}

function runFfmpeg(args) {
  const result = spawnSync(ffmpegPath, args, { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`ffmpeg failed with exit code ${result.status}`);
  }
}

await renderGif("zh", "06-workflow-animation.gif");
await renderGif("en", "06-workflow-animation-en.gif");

await browser.close();
await rm(framesDir, { recursive: true, force: true });

console.log("README assets exported.");
