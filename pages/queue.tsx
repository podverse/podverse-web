import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { NowPlayingItem } from 'podverse-shared'
import { useRef, useState } from 'react'
import DraggableList from 'react-draggable-list'
import {
  ColumnsWrapper,
  Footer,
  List,
  MessageWithAction,
  Meta,
  PageHeader,
  PageScrollableContent
} from '~/components'
import { QueueListItem, CommonProps as QueueListItemCommonProps } from '~/components/QueueListItem/QueueListItem'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { addQueueItemToServer } from '~/services/userQueueItem'
import { OmniAuralState } from '~/state/omniauralState'

type ServerProps = Page

const keyPrefix = 'pages_queue'

export default function Queue(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const [userQueueItems] = useOmniAural('userQueueItems') as [OmniAuralState['userQueueItems']]
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const listRef = useRef(null);
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

  const _onMoveEnd = async (newList: NowPlayingItem[], item: NowPlayingItem, from: number, to: number) => {
    try {
      // First update local state
      // Then, update queue on server

      await OmniAural.setUserQueueItems(newList)

      // offset calculations copied from podverse-rn: `QueueScreen._onDragEnd()`
      const offset = to < from ? -1 : 0
      to = (to + 1) * 1000 + offset

      if (to > -1) {
        addQueueItemToServer(item, to)
      }

    } catch (error) {
      console.log('_onMoveEnd error:', error);
    }
  }

  const generateItemKey = (queueItem: NowPlayingItem) => {
    if (queueItem.clipId) {
      return `${keyPrefix}-clip-${queueItem.clipId}`
    } else {
      return `${keyPrefix}-episode-${queueItem.episodeId}`
    }
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.queue}`,
    description: t('pages-about_Description'),
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
      <PageScrollableContent noPaddingTop>
        {!userInfo && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToViewYourQueue')}
          />
        )}
        {userInfo && (
          <ColumnsWrapper
            mainColumnChildren={
              <List
                isDraggable
                tutorialsLink='/tutorials#queue-add'
                tutorialsLinkText={t('tutorials link - queue')}
                listRef={listRef}
              >
                <DraggableList<NowPlayingItem, QueueListItemCommonProps, QueueListItem>
                  itemKey={generateItemKey}
                  template={QueueListItem}
                  list={userQueueItems}
                  onMoveEnd={_onMoveEnd}
                  container={() => listRef.current}
                  commonProps={{ userInfo, isEditing }}
                  // Padding 20 is equal to the margin of `.clip-list-item` & `.episode-list-item` css classes.
                  // This prevents a glitch after dragging is ended, as the margin of the items is removed during dragging.
                  padding={20}
                />
              </List>
            }
          />
        )}
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
