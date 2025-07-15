"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';
import { UITheme } from '../utils/theme';
import { ModalsProvider } from '../contexts/Modals';

export default function Providers({
  children,
  theme,
  locale,
  ssrLoggedInAccount
}: {
  children: React.ReactNode;
  theme: UITheme;
  locale: string;
  ssrLoggedInAccount: DTOAccount | null;
}) {
  return (
    <NextIntlClientProvider locale={locale}>
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