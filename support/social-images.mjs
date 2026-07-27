import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

import {
  digest,
  FONT_DIRECTORY,
  FONT_WEIGHTS,
  readLocaleRecords,
  SOCIAL_IMAGE_DIRECTORY,
} from './social-asset-config.mjs';

const MANIFEST_PATH = path.join(SOCIAL_IMAGE_DIRECTORY, 'manifest.json');
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const WRITE_MODE = process.argv.includes('--write');
const PAGE_MARKUP = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <main>
      <header>
        <section class="copy">
          <p id="eyebrow"></p>
          <h1 id="title"></h1>
          <p id="description"></p>
        </section>
        <div class="mark" aria-hidden="true">N</div>
      </header>
      <footer>
        <div class="route-line"></div>
        <ol>
          <li>01</li><li>02</li><li>03</li><li>04</li><li class="final">05</li>
        </ol>
        <code id="locale"></code>
      </footer>
    </main>
  </body>
</html>`;
const PAGE_STYLES = `
  * { box-sizing: border-box; }
  html, body { height: 630px; margin: 0; width: 1200px; }
  body { background: #07111f; }
  main {
    background: #f4f7f8;
    border: 24px solid #07111f;
    color: #07111f;
    display: flex;
    flex-direction: column;
    height: 630px;
    justify-content: space-between;
    padding: 48px 56px;
    width: 1200px;
  }
  header { align-items: flex-start; display: flex; justify-content: space-between; }
  .copy { max-width: 860px; }
  [dir="rtl"] .copy { text-align: right; }
  p, h1 { margin: 0; }
  #eyebrow {
    color: #087e8b;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: .18em;
    text-transform: uppercase;
  }
  h1 {
    font-size: 66px;
    font-weight: 900;
    letter-spacing: -.045em;
    line-height: .98;
    margin-top: 26px;
  }
  #description {
    color: #465f6b;
    font-size: 26px;
    line-height: 1.35;
    margin-top: 24px;
    max-width: 820px;
  }
  .mark {
    align-items: center;
    background: #e09f3e;
    border: 6px solid #07111f;
    box-shadow: 10px 10px 0 #087e8b;
    display: flex;
    flex: 0 0 auto;
    font-size: 54px;
    font-weight: 900;
    height: 116px;
    justify-content: center;
    width: 116px;
  }
  footer { align-items: center; display: flex; min-height: 58px; position: relative; }
  .route-line { background: #07111f; height: 8px; inset-inline: 0; position: absolute; }
  ol {
    align-items: center;
    display: flex;
    justify-content: space-between;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 820px;
  }
  li {
    align-items: center;
    background: #e09f3e;
    border: 5px solid #07111f;
    display: flex;
    font-size: 18px;
    font-weight: 900;
    height: 54px;
    justify-content: center;
    position: relative;
    width: 54px;
  }
  li.final { background: #d95d5d; }
  code {
    color: #087e8b;
    direction: ltr;
    font-family: inherit;
    font-size: 24px;
    font-weight: 900;
    margin-inline-start: auto;
    position: relative;
    unicode-bidi: isolate;
  }
`;

async function buildFontStyles(locale) {
  const rules = [];
  for (const weight of FONT_WEIGHTS) {
    const data = await readFile(path.join(FONT_DIRECTORY, `${locale}-${weight}.ttf`));
    rules.push(
      `@font-face { font-family: SocialNoto; font-style: normal; font-weight: ${weight}; ` +
        `src: url(data:font/ttf;base64,${data.toString('base64')}) format('truetype'); }`,
    );
  }
  return `${rules.join('\n')}\n${PAGE_STYLES}\nmain { font-family: SocialNoto, sans-serif; }`;
}

async function writeImages(records, generatorHash) {
  await mkdir(SOCIAL_IMAGE_DIRECTORY, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const manifest = {
    generatedBy: 'npm run assets:social:generate',
    generatorHash,
    locales: {},
  };
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    for (const record of records) {
      const fontStyles = await buildFontStyles(record.locale);
      await page.setContent(PAGE_MARKUP);
      await page.addStyleTag({ content: fontStyles });
      await page.evaluate((value) => {
        globalThis.document.documentElement.dir = value.direction;
        globalThis.document.documentElement.lang = value.locale;
        globalThis.document.querySelector('#eyebrow').textContent = value.copy.eyebrow;
        globalThis.document.querySelector('#title').textContent = value.copy.title;
        globalThis.document.querySelector('#description').textContent = value.copy.description;
        globalThis.document.querySelector('#locale').textContent = `/${value.locale}`;
      }, record);
      await page.evaluate(() => globalThis.document.fonts.ready);
      const imagePath = path.join(SOCIAL_IMAGE_DIRECTORY, `${record.locale}.png`);
      await page.screenshot({ path: imagePath, type: 'png' });
      const image = await readFile(imagePath);
      manifest.locales[record.locale] = {
        imageHash: digest(image),
        messageHash: record.messageHash,
      };
    }
  } finally {
    await browser.close();
  }
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function verifyImages(records, generatorHash) {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  if (manifest.generatorHash !== generatorHash) {
    throw new Error('Social image generator changed. Run npm run assets:social:generate.');
  }
  for (const record of records) {
    const entry = manifest.locales?.[record.locale];
    const image = await readFile(path.join(SOCIAL_IMAGE_DIRECTORY, `${record.locale}.png`));
    if (entry?.messageHash !== record.messageHash || entry.imageHash !== digest(image)) {
      throw new Error(
        `${record.locale} social image is stale. Run npm run assets:social:generate.`,
      );
    }
  }
}

const records = await readLocaleRecords();
const generatorHash = digest(await readFile(SCRIPT_PATH));
const processImages = WRITE_MODE ? writeImages : verifyImages;

await processImages(records, generatorHash);
