import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { useState } from 'react'
import { convertNowPlayingItemToEpisode, convertNowPlayingItemToMediaRef, NowPlayingItem } from 'podverse-shared'
import {
  ClipListItem,
  ColumnsWrapper,
  EpisodeListItem,
  Footer,
  List,
  MessageWithAction,
  Meta,
  PageHeader,
  PageScrollableContent
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { isNowPlayingItemMediaRef } from '~/lib/utility/typeHelpers'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

const keyPrefix = 'pages_queue'

export default function Queue(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo')
  const [userQueueItems] = useOmniAural('userQueueItems')
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const hasEditButton = !!userInfo

  /* Function helpers */

  const _removeQueueItemsAll = async () => {
    const answer = window.confirm(t('Are you sure you want to remove all of your queue items?'))
    if (answer) {
      OmniAural.pageIsLoadingShow()
      await OmniAural.removeQueueItemsAll()
      OmniAural.pageIsLoadingHide()
    }
  }

  /* Render Helpers */

  const generateQueueListElements = (queueItems: NowPlayingItem[]) => {
    return queueItems.map((queueItem, index) => {
      if (isNowPlayingItemMediaRef(queueItem)) {
        /* *TODO* remove the "as any" */
        const mediaRef = convertNowPlayingItemToMediaRef(queueItem) as any
        return (
          <ClipListItem
            episode={mediaRef.episode}
            handleRemove={() => OmniAural.removeQueueItemMediaRef(mediaRef.id)}
            isLoggedInUserMediaRef={userInfo && userInfo.id === mediaRef.owner.id}
            key={`${keyPrefix}-clip-${index}-${mediaRef.id}`}
            mediaRef={mediaRef}
            podcast={mediaRef.episode.podcast}
            showImage
            showRemoveButton={isEditing}
          />
        )
      } else {
        /* *TODO* remove the "as any" */
        const episode = convertNowPlayingItemToEpisode(queueItem) as any
        return (
          <EpisodeListItem
            episode={episode}
            handleRemove={() => OmniAural.removeQueueItemEpisode(episode.id)}
            key={`${keyPrefix}-episode-${index}-${episode.id}`}
            podcast={episode.podcast}
            showImage
            showRemoveButton={isEditing}
          />
        )
      }
    })
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.queue}`,
    description: t('pages-queue_Description'),
    title: t('pages-queue_Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader
        isEditing={isEditing}
        handleClearAllButton={_removeQueueItemsAll}
        handleEditButton={() => setIsEditing(!isEditing)}
        hasEditButton={hasEditButton}
        text={t('Queue')}
      />
      <PageScrollableContent>
        {!userInfo && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToViewYourQueue')}
          />
        )}
        {userInfo && <ColumnsWrapper mainColumnChildren={<List>{generateQueueListElements(userQueueItems)}</List>} />}
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
