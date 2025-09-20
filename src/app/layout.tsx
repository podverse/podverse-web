import '../styles/index.scss';
import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import FavIcons from '../components/Head/FavIcons';
import FontPreloads from '../components/Head/FontPreloads';
import Manifest from '../components/Head/Manifest';
import { AppWrapper } from '../components/App/AppWrapper';
import { MediaPlayer } from '../components/MediaPlayer/MediaPlayer';
import NavBar from '../components/NavBar/NavBar';;
import PageWrapper from '../components/PageWrapper/PageWrapper';
import SideBar from '../components/SideBar/SideBar';
import WindowWrapper from '../components/Window/WindowWrapper';
import Providers from '../providers/Providers';
import { toUITheme } from '../utils/theme';
import { Modals } from '../components/Modals/Modals';
import { getSSRJwtFromCookies, getSSRLoggedInAccount } from '../utils/auth/ssrAuth';
import AuthSessionChecker from '../components/Auth/AuthSessionChecker';
import { apiRequestService } from '../factories/apiRequestService';
import { config } from '../config';
import { MediaPlayerController } from '../components/MediaPlayer/Controller/MediaPlayerController';

export const metadata = {
  title: `${config.private.brand.name || config.public.brand.name}`,
  description: 'Add meta description here',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = toUITheme(cookieTheme);

  const jwt = await getSSRJwtFromCookies();
  const ssrLoggedInAccount = await getSSRLoggedInAccount();
  const ssrShouldLogout = !!(jwt && !ssrLoggedInAccount);

  const categoriesResponse = await apiRequestService.reqCategoryGetAll();
  const categories = categoriesResponse.data;

  const messages = (await import(`../../i18n/originals/${locale}.json`)).default;

  return (
    <html lang={locale} data-theme={theme}>
      <head>
        <FontPreloads />
        <FavIcons />
        <Manifest />
      </head>
      <body>
        <AuthSessionChecker ssrShouldLogout={ssrShouldLogout} />
        <Providers
          locale={locale}
          ssrLoggedInAccount={ssrLoggedInAccount}
          theme={theme}
          messages={messages}
          categories={categories}>
          <WindowWrapper>
            <AppWrapper>
              <SideBar />
              <PageWrapper>
                <NavBar />
                {children}
              </PageWrapper>
            </AppWrapper>
            <MediaPlayer />
            <Modals />
          </WindowWrapper>
          <MediaPlayerController />
        </Providers>
      </body>
    </html>
  );
}
