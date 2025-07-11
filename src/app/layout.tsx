import { cookies } from 'next/headers';
// import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import '../styles/index.scss';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import WindowWrapper from '../components/Window/WindowWrapper';
import SideBar from '../components/SideBar/SideBar';
import MainWrapper from '../components/Main/MainWrapper';
import { ThemeProvider } from '../contexts/Theme';

export const metadata = {
  title: 'Podverse Web',
  description: 'A Next.js + TypeScript site',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = cookieTheme ? cookieTheme : 'dark';

  return (
    <html lang={locale} data-theme={theme}>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider initialTheme={theme}>
            <WindowWrapper>
              <SideBar />
              <MainWrapper>
                {children}
              </MainWrapper>
            </WindowWrapper>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
