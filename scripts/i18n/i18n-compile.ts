import fs from 'fs';
import path from 'path';

// Deep merge utility, but do not use override value if it is an empty string
function deepMerge(target: any, source: any): any {
  if (typeof target !== 'object' || typeof source !== 'object') return source;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (key in target) {
      // If the override value is an empty string, keep the original
      if (typeof source[key] === 'string' && source[key] === '') {
        result[key] = target[key];
      } else {
        result[key] = deepMerge(target[key], source[key]);
      }
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Recursively add missing keys from messages to overrides with empty string values
// and remove keys from overrides that are not in messages
function fillOverrides(messages: any, overrides: any): any {
  if (typeof messages !== 'object' || messages === null) return {};
  if (typeof overrides !== 'object' || overrides === null) overrides = {};

  const result: any = {};

  // Add or keep only keys that exist in messages
  for (const key of Object.keys(messages)) {
    if (typeof messages[key] === 'object' && messages[key] !== null) {
      result[key] = fillOverrides(messages[key], overrides[key]);
    } else {
      // Only add if not present or is an empty string in overrides
      if (!(key in overrides) || overrides[key] === '') {
        result[key] = '';
      } else {
        result[key] = overrides[key];
      }
    }
  }
  // Do NOT keep keys in overrides that are not in messages
  return result;
}

const messagesDir = path.resolve(__dirname, '../i18n/messages');
const overridesDir = path.resolve(__dirname, '../i18n/overrides');
const compiledDir = path.resolve(__dirname, '../i18n/compiled');

if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

const locales = fs.readdirSync(messagesDir)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

// Always use en.json as the base for filling overrides
const enMessagesPath = path.join(messagesDir, 'en.json');
const enMessages = JSON.parse(fs.readFileSync(enMessagesPath, 'utf8'));

for (const locale of locales) {
  const messagesPath = path.join(messagesDir, `${locale}.json`);
  const overridesPath = path.join(overridesDir, `${locale}.json`);
  const compiledPath = path.join(compiledDir, `${locale}.json`);

  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
  let overrides = {};
  if (fs.existsSync(overridesPath)) {
    overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
  }

  // Fill overrides with missing keys from en.json (not the current locale's messages)
  const filledOverrides = fillOverrides(enMessages, overrides);

  // Do not write overrides/en.json
  if (locale !== 'en') {
    fs.writeFileSync(overridesPath, JSON.stringify(filledOverrides, null, 2), 'utf8');
  }

  const merged = deepMerge(messages, filledOverrides);
  fs.writeFileSync(compiledPath, JSON.stringify(merged, null, 2), 'utf8');
  console.log(`Compiled ${locale}.json`);
}