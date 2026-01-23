import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { OpenAI } from 'openai';

config({ path: path.resolve('.env.openai') });

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

// Batch translate multiple strings at once for better performance
async function translateBatch(
  items: Array<{ keyPath: string; value: string }>,
  targetLang: string
): Promise<Record<string, string>> {
  if (!cache[targetLang]) {
    cache[targetLang] = {};
  }

  // Filter out already cached items
  const uncached = items.filter(item => !cache[targetLang][item.keyPath]);
  if (uncached.length === 0) {
    return items.reduce((acc, item) => {
      acc[item.keyPath] = cache[targetLang][item.keyPath];
      return acc;
    }, {} as Record<string, string>);
  }

  const systemPrompt = `You are a professional translator. Follow these guidelines:
- Preserve placeholders like {name}, {count}, etc. exactly as they appear
- Preserve the exact punctuation from the source text (if source has no period, do not add one)
- For labels and headers, use succinct translations according to local language usage
- For labels and headers: translate if a commonly-used native equivalent exists, otherwise keep the English term if it's internationally recognized in that language's community
- Prioritize clarity and local usage patterns over literal translation
- Return ONLY valid JSON with the structure: {"key": "translation", ...}`;

  // Create a JSON object with keys and values
  const batchInput = uncached.reduce((acc, item) => {
    acc[item.keyPath] = item.value;
    return acc;
  }, {} as Record<string, string>);

  const chat = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Translate all values to ${targetLang}:\n\n${JSON.stringify(batchInput, null, 2)}` },
    ],
    response_format: { type: 'json_object' }
  });

  const raw = chat.choices[0].message.content?.trim() ?? '{}';
  const translations = JSON.parse(raw);

  // Update cache with new translations
  for (const [keyPath, translation] of Object.entries(translations)) {
    if (typeof translation === 'string') {
      cache[targetLang][keyPath] = cleanTranslation(translation);
    }
  }
  saveCache();

  // Return all translations (cached + new)
  return items.reduce((acc, item) => {
    acc[item.keyPath] = cache[targetLang][item.keyPath];
    return acc;
  }, {} as Record<string, string>);
}

async function translateText(keyPath: string, value: string, targetLang: string): Promise<string> {
  const result = await translateBatch([{ keyPath, value }], targetLang);
  return result[keyPath];
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

// Collect strings to translate, then batch process them
async function translateObject(
  obj: any,
  targetLang: string,
  keyPathStack: string[] = [],
  existingTarget: any = {}
): Promise<any> {
  // First pass: collect all strings that need translation
  const stringsToTranslate: Array<{ keyPath: string; value: string; path: string[] }> = [];
  
  function collectStrings(o: any, stack: string[], existing: any) {
    if (typeof o === 'string') {
      const fullKey = stack.join('.');
      const current = existing?.[stack.at(-1) ?? ''];
      if (typeof current !== 'string') {
        stringsToTranslate.push({ keyPath: fullKey, value: o, path: [...stack] });
      }
    } else if (Array.isArray(o)) {
      o.forEach((item, i) => collectStrings(item, [...stack, String(i)], existing?.[i]));
    } else if (typeof o === 'object' && o !== null) {
      Object.keys(o).forEach(key => collectStrings(o[key], [...stack, key], existing?.[key]));
    }
  }
  
  collectStrings(obj, keyPathStack, existingTarget);
  
  // Batch translate in chunks of 50
  const BATCH_SIZE = 50;
  const translations: Record<string, string> = {};
  
  for (let i = 0; i < stringsToTranslate.length; i += BATCH_SIZE) {
    const batch = stringsToTranslate.slice(i, i + BATCH_SIZE);
    console.log(`[${targetLang}] Translating batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(stringsToTranslate.length / BATCH_SIZE)}...`);
    const batchResults = await translateBatch(batch, targetLang);
    Object.assign(translations, batchResults);
  }
  
  // Second pass: rebuild object with translations
  function rebuildWithTranslations(o: any, stack: string[], existing: any): any {
    if (typeof o === 'string') {
      const fullKey = stack.join('.');
      const current = existing?.[stack.at(-1) ?? ''];
      if (typeof current === 'string') {
        return current; // Use existing translation
      }
      return translations[fullKey] || o;
    }
    
    if (Array.isArray(o)) {
      return o.map((item, i) => rebuildWithTranslations(item, [...stack, String(i)], existing?.[i]));
    }
    
    if (typeof o === 'object' && o !== null) {
      const result: Record<string, any> = {};
      for (const key of Object.keys(o)) {
        result[key] = rebuildWithTranslations(o[key], [...stack, key], existing?.[key]);
      }
      return result;
    }
    
    return o;
  }
  
  return rebuildWithTranslations(obj, keyPathStack, existingTarget);
}

async function run() {
  const inputPath = path.resolve('./i18n/originals/en-US.json');
  const enData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

  const targets = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'el-GR', name: 'Greek' },
  ];

  // Parallelize by language for faster processing
  await Promise.all(targets.map(async (target) => {
    const outputPath = path.resolve(`./i18n/originals/${target.code}.json`);
    const existingTranslated = loadExistingTranslations(outputPath);

    console.info(`\n🌍 Translating to ${target.name}...`);
    const translated = await translateObject(enData, target.name, [], existingTranslated);
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2), 'utf-8');
    console.info(`✅ Saved: ${outputPath}`);
  }));
}

run().catch(console.error);
