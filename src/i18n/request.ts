import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

const supportedLocales = ['en', 'es', 'fr', 'el-GR'];

async function detectLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const hdrs = await headers();
  const acceptLanguage = hdrs.get('accept-language');
  if (!acceptLanguage) return 'en';

  const preferred = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
  const matched = preferred.find(lang => supportedLocales.includes(lang.split('-')[0]));
  return matched ? matched.split('-')[0] : 'en';
}

export default getRequestConfig(async () => {
  const locale = await detectLocale();

  let originals;
  try {
    // Try full locale first (e.g. en-US.json)
    let localeOriginals;
    try {
      localeOriginals = (await import(`../../i18n/originals/${locale}.json`)).default;
    } catch (e) {
      // If full locale not found and locale contains region (e.g. en-US), try base language (e.g. en.json)
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
