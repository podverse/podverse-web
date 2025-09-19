"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount, DTOCategory } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';
import { ModalsProvider } from '../contexts/Modals';
import { UITheme } from '../utils/theme';
import { CategoriesProvider } from '../contexts/Categories';
import { MediaPlayerProvider } from '../contexts/MediaPlayer';

export default function Providers({
  children,
  theme,
  locale,
  ssrLoggedInAccount,
  messages,
  categories
}: {
  children: React.ReactNode;
  theme: UITheme;
  locale: string;
  ssrLoggedInAccount: DTOAccount | null;
  messages: Record<string, any>;
  categories: DTOCategory[];
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="America/Chicago">
      <ThemeProvider initialTheme={theme}>
        <AccountProvider ssrLoggedInAccount={ssrLoggedInAccount}>
          <MediaPlayerProvider>
            <ModalsProvider>
              <CategoriesProvider ssrCategories={categories}>
                {children}
              </CategoriesProvider>
            </ModalsProvider>
          </MediaPlayerProvider>
        </AccountProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
