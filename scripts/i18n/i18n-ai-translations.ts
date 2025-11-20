import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config(); // Load environment variables

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type CacheStore = Record<string, Record<string, string>>;
const cachePath = path.resolve('./.translation-cache.json');

let cache: CacheStore = {};
if (fs.existsSync(cachePath)) {
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  } catch {
    console.warn('⚠️ Failed to parse cache. Starting with empty cache.');
  }
}

function saveCache() {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
}

function cleanTranslation(str: string): string {
  const trimmed = str.trim();
  if (trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

async function translateText(keyPath: string, value: string, targetLang: string): Promise<string> {
  if (!cache[targetLang]) {
    cache[targetLang] = {};
  }

  if (cache[targetLang][keyPath]) {
    return cache[targetLang][keyPath]; // Return cached translation
  }

  const prompt = `Translate this text to ${targetLang}, preserving placeholders like {name}, {count}, etc. Return only the translated string:\n\n"${value}"`;

  const chat = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: 'You are a professional translator.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const raw = chat.choices[0].message.content?.trim() ?? value;
  const cleaned = cleanTranslation(raw);

  cache[targetLang][keyPath] = cleaned;
  saveCache();

  return cleaned;
}

// Load existing translated file to merge (if available)
function loadExistingTranslations(filePath: string): any {
  if (fs.existsSync(filePath)) {
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      console.warn(`⚠️ Failed to parse ${filePath}. Ignoring previous translations.`);
    }
  }
  return {};
}

// Reuse existing translations if present in file or cache
async function translateObject(
  obj: any,
  targetLang: string,
  keyPathStack: string[] = [],
  existingTarget: any = {}
): Promise<any> {
  if (typeof obj === 'string') {
    const fullKey = keyPathStack.join('.');
    const existing = existingTarget ?? {};
    const current = existingTarget?.[keyPathStack.at(-1) ?? ''];

    if (typeof current === 'string') {
      return current; // Reuse from existing file
    }

    return await translateText(fullKey, obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map((item, i) =>
        translateObject(item, targetLang, [...keyPathStack, String(i)], existingTarget?.[i])
      )
    );
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      result[key] = await translateObject(
        obj[key],
        targetLang,
        [...keyPathStack, key],
        existingTarget?.[key]
      );
    }
    return result;
  }

  return obj;
}

async function run() {
  const inputPath = path.resolve('./i18n/originals/en.json');
  const enData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const targets = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'el-GR', name: 'Greek' },
  ];

  for (const target of targets) {
    const outputPath = path.resolve(`./i18n/originals/${target.code}.json`);
    const existingTranslated = loadExistingTranslations(outputPath);

    console.info(`\n🌍 Translating to ${target.name}...`);
    const translated = await translateObject(enData, target.name, [], existingTranslated);
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf-8');
    console.info(`✅ Saved: ${outputPath}`);
  }
}

run().catch(console.error);
