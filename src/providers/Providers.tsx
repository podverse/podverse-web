"use client";

import { NextIntlClientProvider } from 'next-intl';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';
import { UITheme } from '../utils/theme';
import { ModalsProvider } from '../contexts/Modals';

export default function Providers({
  children,
  theme,
  locale
}: {
  children: React.ReactNode;
  theme: UITheme;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider initialTheme={theme}>
        <AccountProvider>
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </AccountProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}