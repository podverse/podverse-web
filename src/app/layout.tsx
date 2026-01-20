import '../styles/index.scss';
import { cookies } from 'next/headers';
import { generateQueueResourceAbridgedIndex, QueueResourcesAbridgedIndex } from 'podverse-helpers';
import FavIcons from '../components/Head/FavIcons';
import FontPreloads from '../components/Head/FontPreloads';
import Manifest from '../components/Head/Manifest';
import { AppWrapper } from '../components/App/AppWrapper';
import { MediaPlayer } from '../components/MediaPlayer/MediaPlayer';
import NavBar from '../components/NavBar/NavBar';;
import PageWrapper from '../components/PageWrapper/PageWrapper';
import { SideBar } from '../components/SideBar/SideBar';
import WindowWrapper from '../components/Window/WindowWrapper';
import Providers from '../providers/Providers';
import { toUITheme } from '../utils/localSettings/uiTheme';
import { Modals } from '../components/Modals/Modals';
import { getSSRJwtFromCookies, getSSRLoggedInAccount } from '../utils/auth/ssrAuth';
import AuthSessionChecker from '../components/Auth/AuthSessionChecker';
import { getSSRApiRequestService } from '../factories/apiRequestService';
import { config } from '../config';
import { MediaPlayerController } from '../components/MediaPlayer/Controller/MediaPlayerController';
import { Toast } from '../components/Toast/Toast';
import { MembershipExpirationToast } from '../components/Toast/MembershipExpirationToast';
import { QueueController } from '../components/Queue/QueueController';
import { QueueResourcesAbridgedController } from '../components/Queue/QueueResourcesAbridgedController';
import { getParsedLocalSettings } from '../utils/localSettings/localSettings';
import { useLocaleDetect } from '../hooks/useLocaleDetect';
import { setSSRAccountForLocale } from '../i18n/request';
import { ErrorBoundaryWrapper } from '../components/ErrorBoundary/ErrorBoundaryWrapper';

export const metadata = {
  title: config.public.brand.name,
  description: 'Add meta description here',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const ssrLocalSettings = getParsedLocalSettings(cookieStore);
  const ssrUITheme = toUITheme(ssrLocalSettings.uit);

  const jwt = await getSSRJwtFromCookies();
  const ssrLoggedInAccount = await getSSRLoggedInAccount();
  const ssrShouldLogout = !!(jwt && !ssrLoggedInAccount);

  setSSRAccountForLocale(ssrLoggedInAccount);

  // Detect locale based on account settings, cookie, or browser preference
  const locale = await useLocaleDetect(ssrLoggedInAccount);

  let ssrQueueResourcesAbridgedIndex: QueueResourcesAbridgedIndex | null = null;

  const ssrApiRequestService = getSSRApiRequestService(jwt);

  if (jwt) {
    try {
      const ssrQueueResourcesAbridgedIndexResponseData = await ssrApiRequestService
        .reqQueueResourcesGetAllByAccountAbridged();
      ssrQueueResourcesAbridgedIndex = generateQueueResourceAbridgedIndex(
        ssrQueueResourcesAbridgedIndexResponseData
      );
    } catch (err) {
      // do nothing
    }
  }

  const categoriesResponse = await ssrApiRequestService.reqCategoryGetAll();
  const categories = categoriesResponse.data;

  const messages = (await import(`../../i18n/originals/${locale}.json`)).default;

  return (
    <html lang={locale} data-ui-theme={ssrUITheme}>
      <head>
        <FontPreloads />
        <FavIcons />
        <Manifest />
      </head>
      <body>
        {
          ssrShouldLogout && (
            <AuthSessionChecker ssrShouldLogout={ssrShouldLogout} />
          )
        }
        {
          !ssrShouldLogout && (
            <Providers
              locale={locale}
              ssrLoggedInAccount={ssrLoggedInAccount}
              ssrLocalSettings={ssrLocalSettings}
              ssrQueueResourcesAbridgedIndex={ssrQueueResourcesAbridgedIndex}
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
                <ErrorBoundaryWrapper>
                  <MediaPlayer />
                </ErrorBoundaryWrapper>
                <ErrorBoundaryWrapper>
                  <Modals />
                </ErrorBoundaryWrapper>
              </WindowWrapper>
              <MediaPlayerController />
              <QueueController />
              <QueueResourcesAbridgedController />
              <Toast />
              <MembershipExpirationToast />
            </Providers>
          )
        }
      </body>
    </html>
  );
}
