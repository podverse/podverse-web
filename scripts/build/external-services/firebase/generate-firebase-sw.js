/**
 * generate-firebase-sw.js
 * Generates `public/firebase-messaging-sw.js` from a template at build time
 * using NEXT_PUBLIC_FIREBASE_* environment variables.
 */
const fs = require('fs');
const path = require('path');

// Choose .env file: use .env.production when running in production
const envFileName = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// Load .env file from project root
require('dotenv').config({ path: path.join(__dirname, '..', '..', '..', '..', envFileName) });

const outPath = path.join(__dirname, '..', '..', '..', '..', 'public', 'firebase-messaging-sw.js');
const templatePath = path.join(__dirname, 'firebase-messaging-sw.template.js');

function readEnv(name, fallback = '') {
  return process.env[name] || fallback;
}

function buildConfig() {
  return {
    apiKey: readEnv('NEXT_PUBLIC_FIREBASE_API_KEY', ''),
    authDomain: readEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', ''),
    projectId: readEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', ''),
    storageBucket: readEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', ''),
    appId: readEnv('NEXT_PUBLIC_FIREBASE_APP_ID', ''),
    messagingSenderId: readEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', ''),
  };
}

function main() {
  if (!fs.existsSync(templatePath)) {
    console.error('Template not found:', templatePath);
    process.exit(1);
  }

  const tpl = fs.readFileSync(templatePath, 'utf8');
  const config = buildConfig();
  const populated = tpl.replace('__FIREBASE_CONFIG__', JSON.stringify(config, null, 2));

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, populated, 'utf8');
  console.log('Wrote', outPath);
}

if (require.main === module) main();
