/**
 * Validates that all required environment variables are set before build.
 * Aborts the build process if any required variables are missing or invalid.
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { ValidationResult, ValidationSummary, validateRequired, validateOptional, getAllAvailableOrListMessage, validateSupportedLocalesList, validateLocale, SERVER_ENV_VALUES, isValidServerEnv } from 'podverse-helpers';

// Valid themes for theme validation
const VALID_THEMES = ['dark', 'light', 'dracula'];

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

/**
 * Validates all environment variables and returns a comprehensive summary
 */
const validateAllEnvironmentVariables = (): ValidationSummary => {
  const results: ValidationResult[] = [];
  
  // Proxy Configuration
  results.push(validateProxyUserAgent());

  // API Configuration (SSR)
  results.push(validateRequired('NEXT_PUBLIC_SSR_API_PROTOCOL', 'API Configuration (SSR)'));
  results.push(validateRequired('NEXT_PUBLIC_SSR_API_HOST', 'API Configuration (SSR)'));
  results.push(validateSSRApiPort());

  // API Configuration (Client)
  results.push(validateRequired('NEXT_PUBLIC_API_PROTOCOL', 'API Configuration (Client)'));
  results.push(validateRequired('NEXT_PUBLIC_API_HOST', 'API Configuration (Client)'));
  results.push(validateApiPort());
  results.push(validateRequired('NEXT_PUBLIC_API_PREFIX', 'API Configuration (Client)'));
  results.push(validateRequired('NEXT_PUBLIC_API_VERSION', 'API Configuration (Client)'));

  // Web Configuration
  results.push(validateRequired('NEXT_PUBLIC_WEB_PROTOCOL', 'Web Configuration'));
  results.push(validateRequired('NEXT_PUBLIC_WEB_DOMAIN', 'Web Configuration'));

  // Brand & Features
  results.push(validateOptional('NEXT_PUBLIC_BRAND_NAME', 'Brand & Features', 'Blank'));
  results.push(validatePollingInterval());
  results.push(validateSupportedLocalesList('NEXT_PUBLIC_FEATURES_SUPPORTED_LOCALES', 'Brand & Features'));
  results.push(validateLocale('NEXT_PUBLIC_FEATURES_DEFAULT_LOCALE', 'Brand & Features', true));
  results.push(validateSupportedThemes());
  results.push(validateThemeDefault());

  // Lightning Keysend
  results.push(validateOptional('NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_NAME', 'Lightning Keysend', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_TYPE', 'Lightning Keysend', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_ADDRESS', 'Lightning Keysend', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_KEY', 'Lightning Keysend', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_APP_VALUE_LIGHTNING_KEYSEND_CUSTOM_VALUE', 'Lightning Keysend', 'Blank'));

  // Notifications
  results.push(validateOptional('NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY', 'Notifications', 'Blank'));

  // Account
  results.push(validateOptional('NEXT_PUBLIC_ACCOUNT_SIGNUP_MODE', 'Account', 'Use Default ("sign-up")'));
  results.push(validateOptional('NEXT_PUBLIC_CONTACT_EMAIL', 'Account', 'Blank'));

  // Social Media
  results.push(validateOptional('NEXT_PUBLIC_SOCIAL_ACTIVITY_PUB', 'Social Media', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_SOCIAL_DISCORD', 'Social Media', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_SOCIAL_GITHUB', 'Social Media', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_SOCIAL_MATRIX', 'Social Media', 'Blank'));
  results.push(validateOptional('NEXT_PUBLIC_SOCIAL_X', 'Social Media', 'Blank'));

  // General
  results.push(validateServerEnv());

  // Calculate summary
  const total = results.length;
  const passed = results.filter(r => r.isValid && r.isSet).length;
  const failed = results.filter(r => !r.isValid).length;
  const requiredMissing = results.filter(r => r.isRequired && !r.isValid).length;
  // Count as skipped only if not set and message is "Skipped" (exclude "Use Default" and "Blank")
  const skipped = results.filter(r => !r.isRequired && !r.isSet && r.message === 'Skipped').length;
  // Count defaults used (passed validations with "Use Default" or "Blank" messages)
  const defaultsUsed = results.filter(r => r.isValid && r.isSet && (r.message.includes('Use Default') || r.message === 'Blank')).length;

  return {
    total,
    passed,
    failed,
    requiredMissing,
    skipped,
    defaultsUsed,
    results
  };
};

/**
 * Validates the NEXT_PUBLIC_PROXY_USER_AGENT environment variable.
 * The User-Agent MUST follow the format: BrandName Bot Environment/AppName/Version
 * Example: "Podverse Bot Local/Web-API/5"
 */
const validateProxyUserAgent = (): ValidationResult => {
  const userAgent = process.env.NEXT_PUBLIC_PROXY_USER_AGENT || '';
  const USER_AGENT_PATTERN = /^[^/]+\/[^/]+\/[^/]+$/;

  if (!userAgent) {
    return {
      name: 'NEXT_PUBLIC_PROXY_USER_AGENT',
      isSet: false,
      isValid: false,
      isRequired: true,
      message: 'Missing - must follow format: BrandName Bot Environment/AppName/Version',
      category: 'Proxy Configuration'
    };
  }

  const trimmedUserAgent = userAgent.trim();
  
  if (!USER_AGENT_PATTERN.test(trimmedUserAgent)) {
    return {
      name: 'NEXT_PUBLIC_PROXY_USER_AGENT',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Invalid format: "${userAgent}" - must follow format: BrandName Bot Environment/AppName/Version`,
      category: 'Proxy Configuration'
    };
  }

  // Check that "Bot" is included in the first part (before the first slash)
  const parts = trimmedUserAgent.split('/');
  if (parts.length > 0 && !parts[0].includes('Bot')) {
    return {
      name: 'NEXT_PUBLIC_PROXY_USER_AGENT',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Missing "Bot" in first part: "${userAgent}"`,
      category: 'Proxy Configuration'
    };
  }

  return {
    name: 'NEXT_PUBLIC_PROXY_USER_AGENT',
    isSet: true,
    isValid: true,
    isRequired: true,
    message: 'Valid format',
    category: 'Proxy Configuration'
  };
};

/**
 * Validates NEXT_PUBLIC_SSR_API_PORT (must be a positive number if set, optional)
 */
const validateSSRApiPort = (): ValidationResult => {
  const value = process.env.NEXT_PUBLIC_SSR_API_PORT || '';
  const isSet = value !== '';

  if (!isSet) {
    return {
      name: 'NEXT_PUBLIC_SSR_API_PORT',
      isSet: false,
      isValid: true,
      isRequired: false,
      message: 'Blank',
      category: 'API Configuration (SSR)'
    };
  }

  const numValue = Number(value);
  if (isNaN(numValue) || numValue <= 0) {
    return {
      name: 'NEXT_PUBLIC_SSR_API_PORT',
      isSet: true,
      isValid: false,
      isRequired: false,
      message: `Invalid number: "${value}"`,
      category: 'API Configuration (SSR)'
    };
  }

  return {
    name: 'NEXT_PUBLIC_SSR_API_PORT',
    isSet: true,
    isValid: true,
    isRequired: false,
    message: 'Set',
    category: 'API Configuration (SSR)'
  };
};

/**
 * Validates NEXT_PUBLIC_API_PORT (must be a positive number if set, optional)
 */
const validateApiPort = (): ValidationResult => {
  const value = process.env.NEXT_PUBLIC_API_PORT || '';
  const isSet = value !== '';

  if (!isSet) {
    return {
      name: 'NEXT_PUBLIC_API_PORT',
      isSet: false,
      isValid: true,
      isRequired: false,
      message: 'Blank',
      category: 'API Configuration (Client)'
    };
  }

  const numValue = Number(value);
  if (isNaN(numValue) || numValue <= 0) {
    return {
      name: 'NEXT_PUBLIC_API_PORT',
      isSet: true,
      isValid: false,
      isRequired: false,
      message: `Invalid number: "${value}"`,
      category: 'API Configuration (Client)'
    };
  }

  return {
    name: 'NEXT_PUBLIC_API_PORT',
    isSet: true,
    isValid: true,
    isRequired: false,
    message: 'Set',
    category: 'API Configuration (Client)'
  };
};

/**
 * Validates NEXT_PUBLIC_POLLING_INTERVAL_MS (must be a positive number if set)
 */
const validatePollingInterval = (): ValidationResult => {
  const value = process.env.NEXT_PUBLIC_POLLING_INTERVAL_MS || '';
  const isSet = value !== '';

  if (!isSet) {
    return {
      name: 'NEXT_PUBLIC_POLLING_INTERVAL_MS',
      isSet: false,
      isValid: true,
      isRequired: false,
      message: 'Use Default (3000)',
      category: 'Brand & Features'
    };
  }

  const numValue = Number(value);
  if (isNaN(numValue) || numValue <= 0) {
    return {
      name: 'NEXT_PUBLIC_POLLING_INTERVAL_MS',
      isSet: true,
      isValid: false,
      isRequired: false,
      message: `Invalid number: "${value}"`,
      category: 'Brand & Features'
    };
  }

  return {
    name: 'NEXT_PUBLIC_POLLING_INTERVAL_MS',
    isSet: true,
    isValid: true,
    isRequired: false,
    message: 'Set',
    category: 'Brand & Features'
  };
};


/**
 * Validates NEXT_PUBLIC_SUPPORTED_THEMES
 * Must be "all-available" or comma-delimited list
 */
const validateSupportedThemes = (): ValidationResult => {
  const value = process.env.NEXT_PUBLIC_SUPPORTED_THEMES || '';
  const isSet = value !== '';

  if (!isSet || value.trim() === '') {
    return {
      name: 'NEXT_PUBLIC_SUPPORTED_THEMES',
      isSet: false,
      isValid: false,
      isRequired: true,
      message: `Missing - ${getAllAvailableOrListMessage(VALID_THEMES)}`,
      category: 'Brand & Features'
    };
  }

  const trimmedValue = value.trim();

  // Allow "all-available" as a special value
  if (trimmedValue === 'all-available') {
    return {
      name: 'NEXT_PUBLIC_SUPPORTED_THEMES',
      isSet: true,
      isValid: true,
      isRequired: true,
      message: 'Set to "all-available"',
      category: 'Brand & Features'
    };
  }

  // Validate comma-delimited list of themes
  const themes = trimmedValue.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
  
  if (themes.length === 0) {
    return {
      name: 'NEXT_PUBLIC_SUPPORTED_THEMES',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Empty after parsing - ${getAllAvailableOrListMessage(VALID_THEMES)}`,
      category: 'Brand & Features'
    };
  }

  // Check that all themes are valid
  const invalidThemes = themes.filter(theme => !VALID_THEMES.includes(theme));
  if (invalidThemes.length > 0) {
    return {
      name: 'NEXT_PUBLIC_SUPPORTED_THEMES',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Invalid theme(s): ${invalidThemes.join(', ')}. Valid themes: ${VALID_THEMES.join(', ')}`,
      category: 'Brand & Features'
    };
  }

  return {
    name: 'NEXT_PUBLIC_SUPPORTED_THEMES',
    isSet: true,
    isValid: true,
    isRequired: true,
    message: `Valid themes: ${themes.join(', ')}`,
    category: 'Brand & Features'
  };
};

/**
 * Validates NEXT_PUBLIC_SERVER_ENV
 * Must be one of: prod, beta, alpha, local
 */
const validateServerEnv = (): ValidationResult => {
  const serverEnv = process.env.NEXT_PUBLIC_SERVER_ENV || '';

  if (!serverEnv) {
    return {
      name: 'NEXT_PUBLIC_SERVER_ENV',
      isSet: false,
      isValid: false,
      isRequired: true,
      message: `Missing - must be one of: ${SERVER_ENV_VALUES.join(', ')}`,
      category: 'General'
    };
  }

  if (!isValidServerEnv(serverEnv)) {
    return {
      name: 'NEXT_PUBLIC_SERVER_ENV',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Invalid value: "${serverEnv}" - must be one of: ${SERVER_ENV_VALUES.join(', ')}`,
      category: 'General'
    };
  }

  return {
    name: 'NEXT_PUBLIC_SERVER_ENV',
    isSet: true,
    isValid: true,
    isRequired: true,
    message: `Set to "${serverEnv}"`,
    category: 'General'
  };
};

/**
 * Validates NEXT_PUBLIC_DEFAULT_THEME
 * Must be a valid theme
 */
const validateThemeDefault = (): ValidationResult => {
  const value = process.env.NEXT_PUBLIC_DEFAULT_THEME || '';
  const isSet = value !== '';

  if (!isSet || value.trim() === '') {
    return {
      name: 'NEXT_PUBLIC_DEFAULT_THEME',
      isSet: false,
      isValid: false,
      isRequired: true,
      message: `Missing - must be one of: ${VALID_THEMES.join(', ')}`,
      category: 'Brand & Features'
    };
  }

  const trimmedValue = value.trim().toLowerCase();

  if (!VALID_THEMES.includes(trimmedValue)) {
    return {
      name: 'NEXT_PUBLIC_DEFAULT_THEME',
      isSet: true,
      isValid: false,
      isRequired: true,
      message: `Invalid theme: "${value}". Valid themes: ${VALID_THEMES.join(', ')}`,
      category: 'Brand & Features'
    };
  }

  return {
    name: 'NEXT_PUBLIC_DEFAULT_THEME',
    isSet: true,
    isValid: true,
    isRequired: true,
    message: `Valid theme: ${trimmedValue}`,
    category: 'Brand & Features'
  };
};


/**
 * Displays validation results in a formatted table
 */
const displayValidationResults = (summary: ValidationSummary): void => {
  console.log('\n=== Environment Variable Validation ===');
  
  // Group results by category
  const byCategory = summary.results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, ValidationResult[]>);

  // Display by category
  const categories = Object.keys(byCategory).sort();
  for (const category of categories) {
    console.log(`[${category}]`);
    for (const result of byCategory[category]) {
      const status = result.isValid ? '✓' : '✗';
      const requiredText = result.isRequired ? '' : ' (optional)';
      const logMessage = `  ${status} ${result.name}${requiredText} - ${result.message}`;
      // Log failures as errors, skipped optional vars as warn, passes as info
      if (!result.isValid) {
        console.error(logMessage);
      } else if (!result.isSet && !result.isRequired) {
        console.warn(logMessage);
      } else {
        console.log(logMessage);
      }
    }
  }

  // Display summary
  console.log('\n=== Validation Summary ===');
  console.log(`Total: ${summary.total}`);
  const passedText = summary.defaultsUsed > 0 
    ? `Passed: ${summary.passed} (${summary.defaultsUsed} using defaults)`
    : `Passed: ${summary.passed}`;
  console.log(passedText);
  if (summary.skipped > 0) {
    console.warn(`Skipped: ${summary.skipped}`);
  }
  console.log(`Failed: ${summary.failed}`);
  console.log(`Required Missing: ${summary.requiredMissing}`);
  
  if (summary.failed > 0) {
    console.error('\nThe following environment variables failed validation:');
    summary.results
      .filter(r => !r.isValid)
      .forEach(r => {
        const requiredText = r.isRequired ? ' (required)' : ' (optional)';
        console.error(`  - ${r.name}${requiredText}: ${r.message}`);
      });
  }
  
  if (summary.requiredMissing > 0) {
    console.error('\n❌ Build aborted: Required environment variables are missing or invalid.');
    console.error('Please set these variables in your .env file or environment.\n');
  }
};

/**
 * Main validation function
 */
const validateEnvVars = (): void => {
  console.log('Running startup validation...');

  const summary = validateAllEnvironmentVariables();
  displayValidationResults(summary);
  
  if (summary.requiredMissing > 0) {
    process.exit(1);
  }

  console.log('✅ All required environment variables are set and valid\n');
};

// Run validation
validateEnvVars();
