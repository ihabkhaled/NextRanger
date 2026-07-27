import { Buffer } from 'node:buffer';
import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

import { digest, FONT_DIRECTORY, FONT_WEIGHTS, readLocaleRecords } from './social-asset-config.mjs';

const MANIFEST_PATH = path.join(FONT_DIRECTORY, 'manifest.json');
const USER_AGENT = 'Mozilla/5.0';
const WRITE_MODE = process.argv.includes('--write');

async function downloadSubsets(record) {
  const family = record.family.replaceAll(' ', '+');
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${family}:wght@${FONT_WEIGHTS.join(';')}` +
    `&text=${encodeURIComponent(record.glyphs)}`;
  const cssResponse = await globalThis.fetch(cssUrl, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!cssResponse.ok) {
    throw new Error(`Font CSS request failed for ${record.locale}: ${cssResponse.status}`);
  }
  const css = await cssResponse.text();
  const fontUrls = {};
  for (const match of css.matchAll(/@font-face\s*\{([\s\S]*?)\}/gu)) {
    const block = match[1] ?? '';
    const weight = Number(block.match(/font-weight:\s*(\d+)/u)?.[1]);
    const fontUrl = block.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('truetype'\)/u)?.[1];
    if (FONT_WEIGHTS.includes(weight) && fontUrl) {
      fontUrls[weight] = fontUrl;
    }
  }
  const subsets = {};
  for (const weight of FONT_WEIGHTS) {
    const fontUrl = fontUrls[weight];
    if (!fontUrl) {
      throw new Error(`Google Fonts returned no TrueType ${weight} subset for ${record.locale}.`);
    }
    const fontResponse = await globalThis.fetch(fontUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!fontResponse.ok) {
      throw new Error(
        `Font download failed for ${record.locale}/${weight}: ${fontResponse.status}`,
      );
    }
    subsets[weight] = Buffer.from(await fontResponse.arrayBuffer());
  }

  return subsets;
}

async function writeFonts(records) {
  await mkdir(FONT_DIRECTORY, { recursive: true });
  for (const filename of await readdir(FONT_DIRECTORY)) {
    if (filename.endsWith('.woff2')) {
      await unlink(path.join(FONT_DIRECTORY, filename));
    }
  }
  const manifest = { generatedBy: 'npm run assets:social:generate', locales: {} };
  for (const record of records) {
    const fonts = await downloadSubsets(record);
    const fontHashes = {};
    for (const weight of FONT_WEIGHTS) {
      const font = fonts[weight];
      await writeFile(path.join(FONT_DIRECTORY, `${record.locale}-${weight}.ttf`), font);
      fontHashes[weight] = digest(font);
    }
    manifest.locales[record.locale] = {
      family: record.family,
      fontHashes,
      messageHash: record.messageHash,
    };
  }
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function verifyFonts(records) {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  for (const record of records) {
    const entry = manifest.locales?.[record.locale];
    if (entry?.family !== record.family || entry?.messageHash !== record.messageHash) {
      throw new Error(`${record.locale} social font is stale. Run npm run assets:social:generate.`);
    }
    for (const weight of FONT_WEIGHTS) {
      const font = await readFile(path.join(FONT_DIRECTORY, `${record.locale}-${weight}.ttf`));
      if (entry.fontHashes?.[weight] !== digest(font)) {
        throw new Error(`${record.locale}/${weight} social font does not match its manifest hash.`);
      }
    }
  }
}

const records = await readLocaleRecords();
const processFonts = WRITE_MODE ? writeFonts : verifyFonts;

await processFonts(records);
