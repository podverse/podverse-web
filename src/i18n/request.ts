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

  let messages;
  try {
    const localeMessages = (await import(`../../i18n/messages/${locale}.json`)).default;
    const enMessages = (await import(`../../i18n/messages/en.json`)).default;
    messages = { ...enMessages, ...localeMessages };
  } catch (e) {
    messages = (await import(`../../i18n/messages/en.json`)).default;
  }

  return {
    locale,
    messages
  };
});
