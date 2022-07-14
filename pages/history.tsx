import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { useEffect, useRef, useState } from 'react'
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
  PageScrollableContent,
  Pagination,
  scrollToTopOfPageScrollableContent
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  getHistoryItemsFromServer,
  getServerSideHistoryItems,
  removeHistoryItemEpisodeOnServer,
  removeHistoryItemMediaRefOnServer,
  removeHistoryItemsAllOnServer
} from '~/services/userHistoryItem'
import { isNowPlayingItemMediaRef } from '~/lib/utility/typeHelpers'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverFilterPage: number
  serverUserHistoryItems: NowPlayingItem[]
  serverUserHistoryItemsCount: number
}

const keyPrefix = 'pages_history'

export default function History({
  serverFilterPage,
  serverUserHistoryItems,
  serverUserHistoryItemsCount
}: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [userHistoryItems, setUserHistoryItems] = useState<NowPlayingItem[]>(serverUserHistoryItems)
  const [userHistoryItemsCount, setUserHistoryItemsCount] = useState<number>(serverUserHistoryItemsCount)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const hasEditButton = !!userInfo
  const initialRender = useRef(true)
  const pageCount = Math.ceil(userHistoryItemsCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        const { userHistoryItems: newUserHistoryItems, userHistoryItemsCount: newUserHistoryItemsCount } =
          await clientQueryUserHistoryItems()
        setUserHistoryItems(newUserHistoryItems)
        setUserHistoryItemsCount(newUserHistoryItemsCount)
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterPage])

  /* Client-Side Queries */

  const clientQueryUserHistoryItems = async () => {
    return getHistoryItemsFromServer(filterPage)
  }

  /* Function helpers */

  const _removeHistoryItemsAll = async () => {
    const answer = window.confirm(t('Are you sure you want to remove all of your history items'))
    if (answer) {
      OmniAural.pageIsLoadingShow()
      await removeHistoryItemsAllOnServer()
      OmniAural.pageIsLoadingHide()
      setUserHistoryItems([])
      setUserHistoryItemsCount(0)
    }
  }

  const _removeHistoryItemEpisode = async (episodeId: string) => {
    const newUserHistoryItems = await removeHistoryItemEpisodeOnServer(episodeId, userHistoryItems)
    setUserHistoryItems(newUserHistoryItems)
  }

  const _removeHistoryItemMediaRef = async (mediaRefId: string) => {
    const newUserHistoryItems = await removeHistoryItemMediaRefOnServer(mediaRefId, userHistoryItems)
    setUserHistoryItems(newUserHistoryItems)
  }

  /* Render Helpers */

  const generateHistoryListElements = (historyItems: NowPlayingItem[]) => {
    return historyItems.map((historyItem, index) => {
      if (isNowPlayingItemMediaRef(historyItem)) {
        /* *TODO* remove the "as any" */
        const mediaRef = convertNowPlayingItemToMediaRef(historyItem) as any
        return (
          <ClipListItem
            /* *TODO* Remove the "as any" below without throwing a Typescript error */
            episode={mediaRef.episode as any}
            handleRemove={() => _removeHistoryItemMediaRef(mediaRef.id)}
            isLoggedInUserMediaRef={userInfo && userInfo.id === mediaRef.owner.id}
            key={`${keyPrefix}-clip-${index}-${mediaRef.id}`}
            mediaRef={mediaRef as any}
            podcast={mediaRef.episode.podcast as any}
            showImage
            showRemoveButton={isEditing}
          />
        )
      } else {
        const episode = convertNowPlayingItemToEpisode(historyItem)
        return (
          <EpisodeListItem
            /* *TODO* Remove the "as any" below without throwing a Typescript error */
            episode={episode as any}
            handleRemove={() => _removeHistoryItemEpisode(episode.id)}
            key={`${keyPrefix}-episode-${index}-${episode.id}`}
            podcast={episode.podcast as any}
            showPodcastInfo
            showRemoveButton={isEditing}
          />
        )
      }
    })
  }

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.history}`,
    description: t('pages-about_Description'),
    title: t('pages-history_Title')
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
        handleClearAllButton={_removeHistoryItemsAll}
        handleEditButton={() => setIsEditing(!isEditing)}
        hasEditButton={hasEditButton}
        text={t('History')}
      />
      <PageScrollableContent noPaddingTop>
        {!userInfo && (
          <MessageWithAction
            actionLabel={t('Login')}
            actionOnClick={() => OmniAural.modalsLoginShow()}
            message={t('LoginToViewYourHistory')}
          />
        )}
        {userInfo && (
          <>
            <ColumnsWrapper mainColumnChildren={<List>{generateHistoryListElements(userHistoryItems)}</List>} />
            <Pagination
              currentPageIndex={filterPage}
              handlePageNavigate={(newPage) => setFilterPage(newPage)}
              handlePageNext={() => {
                if (filterPage + 1 <= pageCount) setFilterPage(filterPage + 1)
              }}
              handlePagePrevious={() => {
                if (filterPage - 1 > 0) setFilterPage(filterPage - 1)
              }}
              pageCount={pageCount}
              show={pageCount > 1}
            />
          </>
        )}
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)

  const serverFilterPage = 1

  let historyItemsData: any = {}
  try {
    const responseData = await getServerSideHistoryItems(serverFilterPage, cookies)
    const { userHistoryItems, userHistoryItemsCount } = responseData
    historyItemsData = { userHistoryItems, userHistoryItemsCount }
  } catch (err) {
    /* In case user's membership has expired, catch the error silently here. */
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverFilterPage,
    serverUserHistoryItems: historyItemsData.userHistoryItems,
    serverUserHistoryItemsCount: historyItemsData.userHistoryItemsCount
  }

  return { props: serverProps }
}
