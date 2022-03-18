import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, PVComment, SocialInteraction } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  Comments,
  EpisodeInfo,
  EpisodePageHeader,
  Footer,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  SideContent
} from '~/components'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { calcListPageCount } from '~/lib/utility/misc'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getEpisodeById } from '~/services/episode'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { checkIfVideoFileType } from '~/services/player/playerVideo'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { getEpisodeProxyActivityPub, getEpisodeProxyTwitter } from '~/services/socialInteraction/threadcap'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverClips: MediaRef[]
  serverClipsFilterPage: number
  serverClipsFilterSort: string
  serverClipsPageCount: number
  serverEpisode: Episode
}

type FilterState = {
  clipsFilterPage?: number
  clipsFilterSort?: string
}

const keyPrefix = 'pages_episode'

/* *TODO*
    Rewrite this file to follow the patterns in pages/podcasts and pages/search.
    Move all functions inside the render function,
    get rid of the filterState,
    stop passing in filterState as a parameter,
    and instead get and set the filterState fields individually.
    Keep the sections in the same order
    (Initialization, useEffects, Client-Side Queries, Render Helpers).
*/

export default function Episode({
  serverClips,
  serverClipsPageCount,
  serverEpisode,
  serverClipsFilterPage,
  serverClipsFilterSort
}: ServerProps) {
  /* Initialize */

  const { id } = serverEpisode
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState({
    clipsFilterPage: serverClipsFilterPage,
    clipsFilterSort: serverClipsFilterSort
  } as FilterState)
  const [comment, setComment] = useState<PVComment>(null)
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const { clipsFilterPage, clipsFilterSort } = filterState
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips)
  const [clipsPageCount, setClipsPageCount] = useState<number>(serverClipsPageCount)
  const initialRender = useRef(true)

  const hasValidCommentTag = serverEpisode.socialInteraction && serverEpisode.socialInteraction.some((si) =>
    si.platform === 'activitypub'
    || si.protocol === 'activitypub'
    || si.platform === 'mastodon'
    || si.platform === 'twitter'
    || si.protocol === 'twitter'
  )

  /* useEffects */

  useEffect(() => {
    if (serverEpisode) {
      setTimeout(() => {
        OmniAural.v4vElementInfoSet({
          podcastIndexPodcastId: serverEpisode.podcast.podcastIndexId,
          episodeMediaUrl: serverEpisode.mediaUrl
        })
      }, 0)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (serverEpisode?.socialInteraction?.length) {
        const activityPub = serverEpisode.socialInteraction.find(
          (item: SocialInteraction) =>
            item.protocol === PV.SocialInteraction.protocolKeys.activitypub ||
            item.platform === PV.SocialInteraction.platformKeys.activitypub ||
            item.platform === PV.SocialInteraction.platformKeys.castopod ||
            item.platform === PV.SocialInteraction.platformKeys.mastodon ||
            item.platform === PV.SocialInteraction.platformKeys.peertube
        )

        const twitter = serverEpisode.socialInteraction.find(
          (item: SocialInteraction) =>
            item.protocol === PV.SocialInteraction.protocolKeys.twitter ||
            item.platform === PV.SocialInteraction.platformKeys.twitter
        )

        if (activityPub?.url) {
          setCommentsLoading(true)
          const comment = await getEpisodeProxyActivityPub(serverEpisode.id)
          setComment(comment)
          setCommentsLoading(false)
        } else if (twitter?.url) {
          setCommentsLoading(true)
          const comment = await getEpisodeProxyTwitter(serverEpisode.id)
          setComment(comment)
          setCommentsLoading(false)
        }
      }

      if (initialRender.current) {
        initialRender.current = false
      } else {
        const { data } = await clientQueryClips()
        const [newClipsListData, newClipsListCount] = data
        setClipsListData(newClipsListData)
        setClipsPageCount(calcListPageCount(newClipsListCount))
        scrollToTopOfPageScrollableContent()
      }
    })()
  }, [clipsFilterPage, clipsFilterSort])

  /* Client-Side Queries */

  const clientQueryClips = async () => {
    const finalQuery = {
      episodeId: id,
      ...(clipsFilterPage ? { page: clipsFilterPage } : {}),
      ...(clipsFilterSort ? { sort: clipsFilterSort } : {})
    }
    return getMediaRefsByQuery(finalQuery)
  }

  /* Render Helpers */

  const generateClipListElements = () => {
    return clipsListData.map((listItem, index) => {
      listItem.episode = serverEpisode
      return (
        <ClipListItem
          episode={serverEpisode}
          isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
          mediaRef={listItem}
          podcast={serverEpisode.podcast}
          key={`${keyPrefix}-${index}-${listItem?.id}`}
        />
      )
    })
  }

  /* Meta Tags */

  let meta = {} as any
  let twitterPlayerUrl = ''
  let isVideo = false

  if (serverEpisode) {
    const { podcast } = serverEpisode
    const podcastTitle = (podcast && podcast.title) || t('untitledPodcast')
    meta = {
      currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${serverEpisode.id}`,
      description: serverEpisode.description,
      imageAlt: podcastTitle,
      imageUrl: serverEpisode.imageUrl || (podcast && podcast.shrunkImageUrl) || (podcast && podcast.imageUrl),
      title: `${serverEpisode.title} - ${podcastTitle}`
    }
    isVideo = checkIfVideoFileType({ episodeMediaType: serverEpisode.mediaType })
    twitterPlayerUrl = isVideo
      ? `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.videoplayer.episode}/${serverEpisode.id}`
      : `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.miniplayer.episode}/${serverEpisode.id}`
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
      <EpisodePageHeader episode={serverEpisode} />
      <PageScrollableContent noPaddingTop>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <EpisodeInfo episode={serverEpisode} includeMediaItemControls />
              {hasValidCommentTag ? (
                <Comments comment={comment} isLoading={commentsLoading} />
              ) : null}
              <PageHeader
                isSubHeader
                noMarginBottom
                sortOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0]
                  setFilterState({
                    clipsFilterPage: 1,
                    clipsFilterSort: selectedItem.key
                  })
                }}
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
                    setFilterState({
                      clipsFilterPage: newPage,
                      clipsFilterSort
                    })
                  }
                }}
                handlePagePrevious={() => {
                  const newPage = clipsFilterPage - 1
                  if (newPage > 0) {
                    setFilterState({
                      clipsFilterPage: newPage,
                      clipsFilterSort
                    })
                  }
                }}
                pageCount={clipsPageCount}
                show={clipsPageCount > 1}
              />
            </>
          }
          sideColumnChildren={<SideContent />}
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { episodeId } = params

  const [defaultServerProps, episodeResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getEpisodeById(episodeId as string)
  ])

  const serverEpisode = episodeResponse.data

  const serverClipsFilterSort = PV.Filters.sort._topPastYear
  const serverClipsFilterPage = 1

  const clipsResponse = await getMediaRefsByQuery({
    episodeId,
    sort: serverClipsFilterSort
  })
  const [clipsListData, clipsListDataCount] = clipsResponse.data
  const serverClips = clipsListData
  const serverClipsPageCount = calcListPageCount(clipsListDataCount)

  const props: ServerProps = {
    ...defaultServerProps,
    serverClips,
    serverClipsFilterPage,
    serverClipsFilterSort,
    serverClipsPageCount,
    serverEpisode
  }

  return { props }
}
