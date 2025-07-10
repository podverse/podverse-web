import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';

const supportedLocales = ['en', 'es'];

async function detectLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
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
    const localeOriginals = (await import(`../../i18n/originals/${locale}.json`)).default;
    const enOriginals = (await import(`../../i18n/originals/en.json`)).default;
    originals = { ...enOriginals, ...localeOriginals };
  } catch (e) {
    originals = (await import(`../../i18n/originals/en.json`)).default;
  }

  return {
    locale,
    originals
  };
});
