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

// The new fillOverrides logic as described:
// - The overrides file should contain all keys/values of the originals file
// - If a value in the override file does not match the value in the originals file, keep the override value
// - If a key is in the originals file but not in the overrides file, remove it from overrides
function fillOverrides(originals: any, overrides: any): any {
  if (typeof originals !== 'object' || originals === null) return {};
  if (typeof overrides !== 'object' || overrides === null) overrides = {};

  const result: any = {};

  for (const key of Object.keys(originals)) {
    const msgVal = originals[key];
    const overrideVal = overrides[key];

    if (typeof msgVal === 'object' && msgVal !== null) {
      result[key] = fillOverrides(msgVal, overrideVal);
    } else {
      // If override value exists and is different from originals, keep override value
      if (overrideVal !== undefined && overrideVal !== msgVal) {
        result[key] = overrideVal;
      } else {
        // Otherwise, use the originals value
        result[key] = msgVal;
      }
    }
  }
  return result;
}

const originalsDir = path.resolve(__dirname, '../../i18n/originals');
const overridesDir = path.resolve(__dirname, '../../i18n/overrides');
const compiledDir = path.resolve(__dirname, '../../i18n/compiled');

if (!fs.existsSync(overridesDir)) {
  fs.mkdirSync(overridesDir, { recursive: true });
}

if (!fs.existsSync(compiledDir)) {
  fs.mkdirSync(compiledDir, { recursive: true });
}

const locales = fs.readdirSync(originalsDir)
  .filter(f => f.endsWith('.json'))
  .map(f => f.replace('.json', ''));

for (const locale of locales) {
  const originalsPath = path.join(originalsDir, `${locale}.json`);
  const overridesPath = path.join(overridesDir, `${locale}.json`);
  const compiledPath = path.join(compiledDir, `${locale}.json`);

  const originals = JSON.parse(fs.readFileSync(originalsPath, 'utf8'));
  let overrides = {};
  if (fs.existsSync(overridesPath)) {
    overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
  }

  let filledOverrides;
  if (locale === 'en-US') {
    filledOverrides = originals;
    fs.writeFileSync(overridesPath, JSON.stringify(originals, null, 2), 'utf8');
  } else {
    // For other locales, fill overrides with all keys/values from originals, keeping only overrides that differ
    filledOverrides = fillOverrides(originals, overrides);
    fs.writeFileSync(overridesPath, JSON.stringify(filledOverrides, null, 2), 'utf8');
  }

  const merged = deepMerge(originals, filledOverrides);
  fs.writeFileSync(compiledPath, JSON.stringify(merged, null, 2), 'utf8');
  console.info(`Compiled ${locale}.json`);
}