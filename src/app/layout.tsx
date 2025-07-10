import { cookies } from 'next/headers';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import '../styles/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

export const metadata = {
  title: 'Podverse Web',
  description: 'A Next.js + TypeScript site',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  
  const theme = cookieTheme === 'dark' ? 'dark' : 'light';
  
  return (
    <html lang={locale} className={theme === 'dark' ? 'dark' : ''}>
      <body>
        <ThemeToggle initialTheme={theme} />
        <NextIntlClientProvider>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
