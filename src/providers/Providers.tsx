"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';
import { ModalsProvider } from '../contexts/Modals';
import { UITheme } from '../utils/theme';

export default function Providers({
  children,
  theme,
  locale,
  ssrLoggedInAccount,
  messages
}: {
  children: React.ReactNode;
  theme: UITheme;
  locale: string;
  ssrLoggedInAccount: DTOAccount | null;
  messages: Record<string, any>;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="America/Chicago">
      <ThemeProvider initialTheme={theme}>
        <AccountProvider ssrLoggedInAccount={ssrLoggedInAccount}>
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </AccountProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}