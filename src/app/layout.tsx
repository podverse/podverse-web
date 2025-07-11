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

export const metadata = {
  title: 'Podverse',
  description: 'Add meta description here',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = toUITheme(cookieTheme);

  return (
    <html lang={locale} data-theme={theme}>
      <head>
        <FontPreloads />
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
