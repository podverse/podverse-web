"use client";

import { NextIntlClientProvider } from 'next-intl';
import { DTOAccount, DTOCategory, QueueResourcesAbridgedIndex } from 'podverse-helpers';
import { AccountProvider } from '../contexts/Account';
import { ThemeProvider } from '../contexts/Theme';
import { ModalsProvider } from '../contexts/Modals';
import { UITheme } from '../utils/theme';
import { CategoriesProvider } from '../contexts/Categories';
import { MediaPlayerProvider } from '../contexts/MediaPlayer';
import { MediaPlayerCurrentTimeProvider } from '../contexts/MediaPlayerCurrentTime';
import { PlaylistsFavoritesProvider } from '../contexts/PlaylistsFavorites';
import { QueuesProvider } from '../contexts/Queue';
import { QueueResourcesAbridgedIndexProvider } from '../contexts/QueueResourcesAbridgedIndex';
import { AutoQueueProvider } from '../contexts/AutoQueue';

export default function Providers({
  children,
  theme,
  locale,
  ssrLoggedInAccount,
  ssrQueueResourcesAbridgedIndex,
  messages,
  categories
}: {
  children: React.ReactNode;
  theme: UITheme;
  locale: string;
  ssrLoggedInAccount: DTOAccount | null;
  ssrQueueResourcesAbridgedIndex: QueueResourcesAbridgedIndex | null;
  messages: Record<string, any>;
  categories: DTOCategory[];
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="America/Chicago">
      <ThemeProvider initialTheme={theme}>
        <AccountProvider ssrLoggedInAccount={ssrLoggedInAccount}>
          <QueuesProvider>
            <QueueResourcesAbridgedIndexProvider ssrQueueResourcesAbridgedIndex={ssrQueueResourcesAbridgedIndex}>
              <PlaylistsFavoritesProvider>
                <MediaPlayerCurrentTimeProvider>
                  <MediaPlayerProvider>
                    <AutoQueueProvider>
                      <ModalsProvider>
                        <CategoriesProvider ssrCategories={categories}>
                          {children}
                        </CategoriesProvider>
                      </ModalsProvider>
                    </AutoQueueProvider>
                  </MediaPlayerProvider>
                </MediaPlayerCurrentTimeProvider>
              </PlaylistsFavoritesProvider>
            </QueueResourcesAbridgedIndexProvider>
          </QueuesProvider>
        </AccountProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
