"use client";

import { NextIntlClientProvider } from 'next-intl';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';

export default function Providers({
  children,
  theme,
  locale
}: {
  children: React.ReactNode;
  theme: string;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider initialTheme={theme}>
        <AccountProvider>
          {children}
        </AccountProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}