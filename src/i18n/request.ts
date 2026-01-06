import { DTOAccount } from 'podverse-helpers';
import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

// All available locales for which we have translations
const allAvailableLocales = ['en', 'es', 'fr', 'el-GR'];

function getSupportedLocales(): string[] {
  const supportedLocalesEnv = process.env.NEXT_PUBLIC_FEATURES_SUPPORTED_LOCALES || 'all-available';
  if (supportedLocalesEnv === 'all-available') {
    return allAvailableLocales;
  }
  const requested = supportedLocalesEnv.split(',').map(l => l.trim()).filter(Boolean);
  return requested.filter(l => allAvailableLocales.includes(l));
}

function getDefaultLocale(): string {
  return process.env.NEXT_PUBLIC_FEATURES_DEFAULT_LOCALE || 'en';
}

async function detectLocale(ssrLoggedInAccount?: DTOAccount | null) {
  const supportedLocales = getSupportedLocales();
  const defaultLocale = getDefaultLocale();
  const cookieStore = await cookies();
  
  // 1. HIGHEST PRIORITY: Check account settings locale (if user is logged in)
  const accountLocale = ssrLoggedInAccount?.account_settings?.account_settings_locale?.locale;
  
  if (accountLocale) {
    // Try exact match first
    if (supportedLocales.includes(accountLocale)) {
      return accountLocale;
    }
    // Try base language match (e.g., 'en' from 'en-US')
    const baseAccountLocale = accountLocale.split('-')[0];
    if (supportedLocales.includes(baseAccountLocale)) {
      return baseAccountLocale;
    }
  }
  
  // 2. Check if cookie locale is supported (explicit user choice)
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. Use configured default locale if it's supported
  if (supportedLocales.includes(defaultLocale)) {
    return defaultLocale;
  }

  // 4. Check Accept-Language header as fallback
  const hdrs = await headers();
  const acceptLanguage = hdrs.get('accept-language');
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
    for (const lang of preferred) {
      if (supportedLocales.includes(lang)) {
        return lang;
      }
      const base = lang.split('-')[0];
      if (supportedLocales.includes(base)) {
        return base;
      }
    }
  }

  // 5. Last resort: first supported locale or 'en'
  return supportedLocales[0] || 'en';
}

// Store the account in a module-level variable that can be set before calling getRequestConfig
let cachedAccount: DTOAccount | null = null;

export function setSSRAccountForLocale(account: DTOAccount | null) {
  cachedAccount = account;
}

export default getRequestConfig(async () => {
  const locale = await detectLocale(cachedAccount);

  let originals;
  try {
    let localeOriginals;
    try {
      localeOriginals = (await import(`../../i18n/originals/${locale}.json`)).default;
    } catch (e) {
      const base = locale.split('-')[0];
      try {
        localeOriginals = (await import(`../../i18n/originals/${base}.json`)).default;
      } catch (e2) {
        localeOriginals = null;
      }
    }

    const enOriginals = (await import(`../../i18n/originals/en.json`)).default;
    originals = localeOriginals ? { ...enOriginals, ...localeOriginals } : enOriginals;
  } catch (e) {
    originals = (await import(`../../i18n/originals/en.json`)).default;
  }
  
  return {
    locale,
    messages: originals
  };
});
