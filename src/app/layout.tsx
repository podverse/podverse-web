import '../styles/index.scss';
import { cookies } from 'next/headers';
import { getLocale } from 'next-intl/server';
import FavIcons from '../components/Head/FavIcons';
import FontPreloads from '../components/Head/FontPreloads';
import Manifest from '../components/Head/Manifest';
import NavBar from '../components/NavBar/NavBar';;
import PageWrapper from '../components/PageWrapper/PageWrapper';
import SideBar from '../components/SideBar/SideBar';
import WindowWrapper from '../components/Window/WindowWrapper';
import Providers from '../providers/Providers';
import { toUITheme } from '../utils/theme';
import { Modals } from '../components/Modals/Modals';
import { getSSRApiRequestService } from '../factories/apiRequestService';
import { DTOAccount } from 'podverse-helpers';

export const metadata = {
  title: 'Podverse',
  description: 'Add meta description here',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const cookieTheme = cookieStore.get('theme')?.value;
  const theme = toUITheme(cookieTheme);

  let jwt;
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    jwt = cookieStore.get("jwt")?.value;
  }
  const ssrApiRequestService = getSSRApiRequestService(jwt);

  const hello = await ssrApiRequestService.reqAccountGetManyPublic();
  console.log(hello);

  let ssrLoggedInAccount: DTOAccount | null = null;
  try {
    ssrLoggedInAccount = await ssrApiRequestService.reqAuthMe();
  } catch (error) {
    // do nothing
  }

  return (
    <html lang={locale} data-theme={theme}>
      <head>
        <FontPreloads />
        <FavIcons />
        <Manifest />
      </head>
      <body>
        <Providers
          locale={locale}
          ssrLoggedInAccount={ssrLoggedInAccount}
          theme={theme}>
          <WindowWrapper>
            <SideBar />
            <PageWrapper>
              <NavBar />
              {children}
            </PageWrapper>
            <Modals />
          </WindowWrapper>
        </Providers>
      </body>
    </html>
  );
}
