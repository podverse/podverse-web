import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { DTOAccount } from 'podverse-helpers';

/**
 * Detects and returns the appropriate locale for the current request.
 * Priority order:
 * 1. Account locale (if user is logged in and has a preference)
 * 2. Cookie locale (if explicitly set by user)
 * 3. Detected locale (from Accept-Language header or default)
 * 
 * Also syncs the cookie with account locale if they differ.
 */
export async function useLocaleDetect(ssrLoggedInAccount: DTOAccount | null): Promise<string> {
  const cookieStore = await cookies();
  const detectedLocale = await getLocale();
  let locale = detectedLocale;
  
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value;
  const accountLocale = ssrLoggedInAccount?.account_settings?.account_settings_locale?.locale;

  // If user is logged in and has a locale preference, use it
  if (accountLocale) {
    try {
      // Try exact match first
      await import(`../../i18n/originals/${accountLocale}.json`);
      locale = accountLocale;
      
      // Sync cookie with account locale if they differ
      if (cookieLocale !== accountLocale) {
        (await cookies()).set('NEXT_LOCALE', accountLocale, {
          maxAge: 60 * 60 * 24 * 365, // 1 year
          path: '/',
          sameSite: 'lax'
        });
      }
    } catch (err) {
      // Try base language match (e.g., 'en' from 'en-US')
      try {
        const baseAccountLocale = accountLocale.split('-')[0];
        await import(`../../i18n/originals/${baseAccountLocale}.json`);
        locale = baseAccountLocale;
        
        // Sync cookie with base locale if they differ
        if (cookieLocale !== baseAccountLocale) {
          (await cookies()).set('NEXT_LOCALE', baseAccountLocale, {
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
            sameSite: 'lax'
          });
        }
      } catch (err2) {
        // Invalid account locale or missing messages; fall through
      }
    }
  } else if (cookieLocale) {
    // No account locale, use cookie if valid
    try {
      await import(`../../../i18n/originals/${cookieLocale}.json`);
      locale = cookieLocale;
    } catch (err) {
      // Invalid cookie locale or missing messages; use detected
    }
  }

  return locale;
}
