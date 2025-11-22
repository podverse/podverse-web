"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount, DTOCategory, QueueResourcesAbridgedIndex } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { LocalSettingsProvider } from '../contexts/LocalSettings';
import { ModalsProvider } from '../contexts/Modals';
import { UITheme } from '../utils/uiTheme';
import { CategoriesProvider } from '../contexts/Categories';
import { MediaPlayerProvider } from '../contexts/MediaPlayer';
import { MediaPlayerCurrentTimeProvider } from '../contexts/MediaPlayerCurrentTime';
import { PlaylistsFavoritesProvider } from '../contexts/PlaylistsFavorites';
import { QueuesProvider } from '../contexts/Queue';
import { QueueResourcesAbridgedIndexProvider } from '../contexts/QueueResourcesAbridgedIndex';
import { AutoQueueProvider } from '../contexts/AutoQueue';
import { MediaPlayerVideoProvider } from '../contexts/MediaPlayerVideo';

export default function Providers({
  children,
  ssrUITheme,
  locale,
  ssrLoggedInAccount,
  ssrQueueResourcesAbridgedIndex,
  messages,
  categories
}: {
  children: React.ReactNode;
  ssrUITheme: UITheme;
  locale: string;
  ssrLoggedInAccount: DTOAccount | null;
  ssrQueueResourcesAbridgedIndex: QueueResourcesAbridgedIndex | null;
  messages: Record<string, any>;
  categories: DTOCategory[];
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="America/Chicago">
      <LocalSettingsProvider ssrUITheme={ssrUITheme}>
        <AccountProvider ssrLoggedInAccount={ssrLoggedInAccount}>
          <QueuesProvider>
            <QueueResourcesAbridgedIndexProvider ssrQueueResourcesAbridgedIndex={ssrQueueResourcesAbridgedIndex}>
              <PlaylistsFavoritesProvider>
                <MediaPlayerCurrentTimeProvider>
                  <MediaPlayerProvider>
                    <MediaPlayerVideoProvider>
                      <AutoQueueProvider>
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
        </AccountProvider>
      </LocalSettingsProvider>
    </NextIntlClientProvider>
  );
}
