"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount, DTOCategory, QueueResourcesAbridgedIndex } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { LocalSettingsProvider } from '../contexts/LocalSettings';
import { ModalsProvider } from '../contexts/Modals';
import { CategoriesProvider } from '../contexts/Categories';
import { MediaPlayerProvider } from '../contexts/MediaPlayer';
import { MediaPlayerCurrentTimeProvider } from '../contexts/MediaPlayerCurrentTime';
import { PlaylistsFavoritesProvider } from '../contexts/PlaylistsFavorites';
import { QueuesProvider } from '../contexts/Queue';
import { QueueResourcesAbridgedIndexProvider } from '../contexts/QueueResourcesAbridgedIndex';
import { AutoQueueProvider } from '../contexts/AutoQueue';
import { MediaPlayerVideoProvider } from '../contexts/MediaPlayerVideo';
import { LocalSettingsState } from '../utils/localSettings/localSettings';
import { NotificationsProvider } from '../contexts/Notifications';
import { NavigationProvider } from '../contexts/Navigation';

export default function Providers({
  children,
  locale,
  ssrLocalSettings,
  ssrLoggedInAccount,
  ssrQueueResourcesAbridgedIndex,
  messages,
  categories
}: {
  children: React.ReactNode;
  locale: string;
  ssrLocalSettings: LocalSettingsState;
  ssrLoggedInAccount: DTOAccount | null;
  ssrQueueResourcesAbridgedIndex: QueueResourcesAbridgedIndex | null;
  messages: Record<string, any>;
  categories: DTOCategory[];
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="America/Chicago">
      <NavigationProvider>
        <LocalSettingsProvider ssrLocalSettings={ssrLocalSettings}>
          <AccountProvider ssrLoggedInAccount={ssrLoggedInAccount}>
            <NotificationsProvider>
              <QueuesProvider>
                <QueueResourcesAbridgedIndexProvider ssrQueueResourcesAbridgedIndex={ssrQueueResourcesAbridgedIndex}>
                  <PlaylistsFavoritesProvider>
                    <MediaPlayerCurrentTimeProvider>
                      <MediaPlayerProvider>
                        <MediaPlayerVideoProvider>
                          <AutoQueueProvider ssrLocalSettings={ssrLocalSettings}>
                            <ModalsProvider>
                              <CategoriesProvider ssrCategories={categories}>
                                {children}
                              </CategoriesProvider>
                            </ModalsProvider>
                          </AutoQueueProvider>
                        </MediaPlayerVideoProvider>
                      </MediaPlayerProvider>
                    </MediaPlayerCurrentTimeProvider>
                  </PlaylistsFavoritesProvider>
                </QueueResourcesAbridgedIndexProvider>
              </QueuesProvider>
            </NotificationsProvider>
          </AccountProvider>
        </LocalSettingsProvider>
      </NavigationProvider>
    </NextIntlClientProvider>
  );
}
