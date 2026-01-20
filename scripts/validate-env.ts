/**
 * Validates that all required environment variables are set before build.
 * Aborts the build process if any required variables are missing or invalid.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Load .env file based on NODE_ENV
// Next.js loads .env files automatically, but this script runs standalone via ts-node
// In production builds (Docker), env files are copied to .env.production
// In development, use .env.local (if exists) or .env
const nodeEnv = process.env.NODE_ENV || 'development';
const cwd = process.cwd();

if (nodeEnv === 'production') {
  // Production: Try .env.production first (as set in Dockerfile), then .env
  const prodPath = resolve(cwd, '.env.production');
  const envPath = resolve(cwd, '.env');
  
  if (existsSync(prodPath)) {
    config({ path: prodPath });
  } else if (existsSync(envPath)) {
    config({ path: envPath });
  }
} else {
  // Development: Try .env.local first (Next.js priority), then .env
  const localPath = resolve(cwd, '.env.local');
  const envPath = resolve(cwd, '.env');
  
  if (existsSync(localPath)) {
    config({ path: localPath });
  } else if (existsSync(envPath)) {
    config({ path: envPath });
  }
}

// List of required environment variables
const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_PROXY_USER_AGENT',
] as const;

// User-Agent format: BrandName/Environment/Version/AppName
const USER_AGENT_PATTERN = /^[^/]+\/[^/]+\/[^/]+\/[^/]+$/;

function validateUserAgentFormat(value: string): { isValid: boolean; error?: string } {
  if (!USER_AGENT_PATTERN.test(value)) {
    return {
      isValid: false,
      error: `Invalid format. Expected: BrandName/Environment/Version/AppName (e.g., Podverse/Local/2/Web-API)`
    };
  }
  return { isValid: true };
}

function validateEnvVars(): void {
  const missingVars: string[] = [];
  const invalidVars: Array<{ name: string; error: string }> = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar];
    if (!value || value.trim() === '') {
      missingVars.push(envVar);
      continue;
    }

    // Validate User-Agent format if it's the proxy user agent
    if (envVar === 'NEXT_PUBLIC_PROXY_USER_AGENT') {
      const validation = validateUserAgentFormat(value.trim());
      if (!validation.isValid) {
        invalidVars.push({
          name: envVar,
          error: validation.error || 'Invalid format'
        });
      }
    }
  }

  if (missingVars.length > 0) {
    console.error('\n❌ Build aborted: Missing required environment variables:\n');
    missingVars.forEach((envVar) => {
      console.error(`  - ${envVar}`);
    });
    console.error('\nPlease set these variables in your .env file or environment.\n');
    process.exit(1);
  }

  if (invalidVars.length > 0) {
    console.error('\n❌ Build aborted: Invalid environment variable format:\n');
    invalidVars.forEach(({ name, error }) => {
      console.error(`  - ${name}: ${error}`);
      console.error(`    Current value: ${process.env[name]}`);
      console.error(`    Expected format: BrandName/Environment/Version/AppName`);
      console.error(`    Example: Podverse/Local/2/Web-API\n`);
    });
    process.exit(1);
  }

  console.log('✅ All required environment variables are set and valid');
}

// Run validation
validateEnvVars();
