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

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
