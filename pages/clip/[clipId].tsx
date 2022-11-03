import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import { addLightningBoltToString, checkIfHasSupportedCommentTag, checkIfVideoFileOrVideoLiveType, Episode, MediaRef } from 'podverse-shared'
import { getLightningKeysendValueItem } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  Chapters,
  ClipInfo,
  ClipListItem,
  ColumnsWrapper,
  EpisodeInfo,
  EpisodePageHeader,
  Footer,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  SideContent,
  SideContentSection,
  Transcripts,
  WebLNV4VForm
} from '~/components'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { calcListPageCount, prefixClipLabel } from '~/lib/utility/misc'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getMediaRefById, getMediaRefsByQuery, retrieveLatestChaptersForEpisodeId } from '~/services/mediaRef'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverChapters: MediaRef[]
  serverClip: MediaRef
  serverClips: MediaRef[]
  serverClipsFilterPage: number
  serverClipsFilterSort: string
  serverClipsPageCount: number
  serverCookies: any
}

type FilterState = {
  clipsFilterPage?: number
  clipsFilterSort?: string
}

const keyPrefix = 'pages_clip'

/* *TODO*
    Rewrite this file to follow the patterns in pages/podcasts and pages/search.
    Move all functions inside the render function,
    get rid of the filterState,
    stop passing in filterState as a parameter,
    and instead get and set the filterState fields individually.
    Keep the sections in the same order
    (Initialization, useEffects, Client-Side Queries, Render Helpers).
*/
/* Client-Side Queries */

const clientQueryClips = async (episode: Episode, clipsFilterPage?: number, clipsFilterSort?: string) => {
  const finalQuery = {
    episodeId: episode.id,
    ...(clipsFilterPage ? { page: clipsFilterPage } : {}),
    ...(clipsFilterSort ? { sort: clipsFilterSort } : {})
  }
  return getMediaRefsByQuery(finalQuery)
}

export default function Clip({
  serverChapters,
  serverClip,
  serverClips,
  serverClipsPageCount,
  serverClipsFilterPage,
  serverClipsFilterSort,
  serverCookies
}: ServerProps) {
  /* Initialize */

  const { episode } = serverClip
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState({
    clipsFilterPage: serverClipsFilterPage,
    clipsFilterSort: serverClipsFilterSort
  } as FilterState)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const { clipsFilterPage, clipsFilterSort } = filterState
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips)
  const [clipsPageCount, setClipsPageCount] = useState<number>(serverClipsPageCount)
  const initialRender = useRef(true)

  const hasTranscripts = !!(episode?.transcript && episode?.transcript[0])
  const hasChapters = serverChapters.length >= 1

  const valueEpisode = episode.value?.length > 0 ? episode.value : null
  const valuePodcast = episode.podcast.value?.length > 0 ? episode.podcast.value : null
  const value = valueEpisode || valuePodcast
  const valueTag = getLightningKeysendValueItem(value)

  /* useEffects */

  useEffect(() => {
    if (serverClip) {
      setTimeout(() => {
        OmniAural.v4vElementInfoSet({
          podcastIndexPodcastId: serverClip.episode.podcast.podcastIndexId,
          episodeMediaUrl: serverClip.episode.mediaUrl
        })
      }, 0)
    }
  }, [serverClip])

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        const { data } = await clientQueryClips(episode, clipsFilterPage, clipsFilterSort)
        const [newClipsListData, newClipsListCount] = data
        setClipsListData(newClipsListData)
        setClipsPageCount(calcListPageCount(newClipsListCount))
        scrollToTopOfPageScrollableContent()
      }
    })()
  }, [clipsFilterPage, clipsFilterSort, episode])

  /* Function Helpers */

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    setFilterState({ clipsFilterPage: 1, clipsFilterSort: selectedItem.key })
  }

  /* Render Helpers */

  const generateClipListElements = () => {
    return clipsListData.map((listItem, index) => {
      listItem.episode = episode
      return (
        <ClipListItem
          isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
          mediaRef={listItem}
          key={`${keyPrefix}-${index}-${listItem?.id}`}
        />
      )
    })
  }

  /* Meta Tags */

  let meta = {} as any
  let twitterPlayerUrl = ''
  let isVideo = false

  if (serverClip) {
    const { episode } = serverClip
    const podcastTitle =
      (episode && episode.podcast && episode.podcast.title) || prefixClipLabel(t, episode && episode.title)
    meta = {
      currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.clip}/${serverClip.id}`,
      description: `${serverClip.episode.title} - ${podcastTitle}`,
      imageAlt: podcastTitle,
      imageUrl:
        (episode && episode.imageUrl) ||
        (episode.podcast && episode.podcast.shrunkImageUrl) ||
        (episode.podcast && episode.podcast.imageUrl),
      title: serverClip.title || prefixClipLabel(t, episode && episode.title)
    }
    isVideo = checkIfVideoFileOrVideoLiveType(episode?.mediaType)
    twitterPlayerUrl = isVideo
      ? `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.clip}/${serverClip.id}`
      : `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.clip}/${serverClip.id}`
  }

  return (
    <>
      <Meta
        description={meta.description}
        isVideo={isVideo}
        ogDescription={meta.description}
        ogImage={meta.imageUrl}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterImage={meta.imageUrl}
        twitterImageAlt={meta.imageAlt}
        twitterPlayerUrl={twitterPlayerUrl}
        twitterTitle={meta.title}
      />
      <EpisodePageHeader episode={episode} />
      <PageScrollableContent noPaddingTop>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <ClipInfo episode={episode} mediaRef={serverClip} />
              <EpisodeInfo episode={episode} />
              {hasTranscripts ? <Transcripts episode={episode} /> : null}
              {hasChapters ? <Chapters chapters={serverChapters} episode={episode} /> : null}
              <PageHeader
                isSubHeader
                noMarginBottom
                sortOnChange={_handleSortOnChange}
                sortOptions={PV.Filters.dropdownOptions.clip.sort}
                sortSelected={clipsFilterSort}
                text={t('Clips')}
              />
              <List>{generateClipListElements()}</List>
              <Pagination
                currentPageIndex={clipsFilterPage}
                handlePageNavigate={(newPage) => {
                  setFilterState({ clipsFilterPage: newPage, clipsFilterSort })
                }}
                handlePageNext={() => {
                  const newPage = clipsFilterPage + 1
                  if (newPage <= clipsPageCount) {
                    setFilterState({ clipsFilterPage: newPage, clipsFilterSort })
                  }
                }}
                handlePagePrevious={() => {
                  const newPage = clipsFilterPage - 1
                  if (newPage > 0) {
                    setFilterState({ clipsFilterPage: newPage, clipsFilterSort })
                  }
                }}
                pageCount={clipsPageCount}
                show={clipsPageCount > 1}
              />
            </>
          }
          sideColumnChildren={
            <SideContent>
              {valueTag && (
                <SideContentSection headerText={addLightningBoltToString(t('Value-4-Value'))}>
                  <WebLNV4VForm
                    episode={episode}
                    podcast={episode.podcast}
                    serverCookies={serverCookies}
                    valueTag={valueTag}
                  />
                </SideContentSection>
              )}
            </SideContent>
          }
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { clipId } = params

  const [defaultServerProps, clipResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getMediaRefById(clipId as string)
  ])

  const serverClip = clipResponse.data
  const { episode } = serverClip

  const serverClipsFilterSort = PV.Filters.sort._topPastYear
  const serverClipsFilterPage = 1

  const clipsResponse = await getMediaRefsByQuery({
    episodeId: episode.id,
    sort: serverClipsFilterSort
  })
  const [clipsListData, clipsListDataCount] = clipsResponse.data
  const serverClips = clipsListData
  const serverClipsPageCount = calcListPageCount(clipsListDataCount)

  let serverChapters = []
  if (serverClip.episode.chaptersUrl) {
    const data = await retrieveLatestChaptersForEpisodeId(episode.id)
    const [chapters] = data
    serverChapters = chapters
  }

  const props: ServerProps = {
    ...defaultServerProps,
    serverChapters,
    serverClip,
    serverClips,
    serverClipsFilterPage,
    serverClipsFilterSort,
    serverClipsPageCount
  }

  return { props }
}
