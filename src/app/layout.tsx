import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import FontPreloads from '../components/Head/FontPreloads';
import MainWrapper from '../components/Main/MainWrapper';
import NavBarDesktop from '../components/NavBar/NavBarDesktop';;
import SideBar from '../components/SideBar/SideBar';
import WindowWrapper from '../components/Window/WindowWrapper';
import Providers from '../providers/Providers';
import '../styles/index.scss';
import { toUITheme } from '../utils/theme';
import { reqAccountGetManyPublic } from "podverse-helpers";

export const metadata = {
  title: 'Podverse',
  description: 'Add meta description here',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = toUITheme(cookieTheme);
  
  const hello = await reqAccountGetManyPublic();
  console.log(hello);

  return (
    <html lang={locale} data-theme={theme}>
      <head>
        <FontPreloads />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body>
        <Providers locale={locale} theme={theme}>
          <WindowWrapper>
            <SideBar />
            <MainWrapper>
              <NavBarDesktop />
              {children}
            </MainWrapper>
          </WindowWrapper>
        </Providers>
      </body>
    </html>
  );
}
