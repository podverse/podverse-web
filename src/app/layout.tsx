import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { reqAccountGetManyPublic } from "podverse-helpers";
import FavIcons from '../components/Head/FavIcons';
import FontPreloads from '../components/Head/FontPreloads';
import Manifest from '../components/Head/Manifest';
import NavBar from '../components/NavBar/NavBar';;
import PageWrapper from '../components/PageWrapper/PageWrapper';
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
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = toUITheme(cookieTheme);
  
  const hello = await reqAccountGetManyPublic();
  console.log(hello);

  return (
    <html lang={locale} data-theme={theme}>
      <head>
        <FontPreloads />
        <FavIcons />
        <Manifest />
      </head>
      <body>
        <Providers locale={locale} theme={theme}>
          <WindowWrapper>
            <SideBar />
            <PageWrapper>
              <NavBar />
              {children}
            </PageWrapper>
          </WindowWrapper>
        </Providers>
      </body>
    </html>
  );
}
