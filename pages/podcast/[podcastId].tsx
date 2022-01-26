import linkifyHtml from 'linkify-html'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, Podcast } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  EpisodeListItem,
  Footer,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastPageHeader,
  SideContent,
  SideContentSection
} from '~/components'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { calcListPageCount } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { getPodcastById } from '~/services/podcast'
import { getEpisodesByQuery } from '~/services/episode'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { Page } from '~/lib/utility/page'
import { sanitizeTextHtml } from '~/lib/utility/sanitize'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

interface ServerProps extends Page {
  serverClips: MediaRef[]
  serverClipsPageCount: number
  serverEpisodes: Episode[]
  serverEpisodesPageCount: number
  serverFilterPage: number
  serverFilterSort: string
  serverFilterType: string
  serverPodcast: Podcast
}

type FilterState = {
  filterPage?: number
  filterSort?: string
  filterType?: string
}

const keyPrefix = 'pages_podcast'

/* *TODO* 
    Rewrite this file to follow the patterns in pages/podcasts and pages/search.
    Move all functions inside the render function,
    get rid of the filterState,
    stop passing in filterState as a parameter,
    and instead get and set the filterState fields individually.
    Keep the sections in the same order
    (Initialization, useEffects, Client-Side Queries, Render Helpers).
*/

export default function Podcast({
  serverClips,
  serverClipsPageCount,
  serverFilterPage,
  serverFilterSort,
  serverFilterType,
  serverEpisodes,
  serverEpisodesPageCount,
  serverPodcast
}: ServerProps) {
  /* Initialize */

  const { id } = serverPodcast
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState({
    filterPage: serverFilterPage,
    filterSort: serverFilterSort,
    filterType: serverFilterType
  } as FilterState)
  const { filterPage, filterSort, filterType } = filterState
  const [episodesListData, setEpisodesListData] = useState<Episode[]>(serverEpisodes)
  const [episodesPageCount, setEpisodesPageCount] = useState<number>(serverEpisodesPageCount)
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips)
  const [clipsPageCount, setClipsPageCount] = useState<number>(serverClipsPageCount)
  const initialRender = useRef(true)
  const [userInfo] = useOmniAural('session.userInfo')
  const pageCount = filterType === PV.Filters.type._episodes ? episodesPageCount : clipsPageCount

  /* useEffects */

  useEffect(() => {
    if (serverPodcast) {
      setTimeout(() => {
        OmniAural.v4vElementInfoSet({
          podcastIndexPodcastId: serverPodcast.podcastIndexId,
          episodeMediaUrl: null
        })
      }, 0)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        if (filterType === PV.Filters.type._episodes) {
          const { data } = await clientQueryEpisodes()
          const [newEpisodesListData, newEpisodesListCount] = data
          setEpisodesListData(newEpisodesListData)
          setEpisodesPageCount(calcListPageCount(newEpisodesListCount))
        } else if (filterType === PV.Filters.type._clips) {
          const { data } = await clientQueryClips()
          const [newClipsListData, newClipsListCount] = data
          setClipsListData(newClipsListData)
          setClipsPageCount(calcListPageCount(newClipsListCount))
        }
        scrollToTopOfPageScrollableContent()
      }
    })()
  }, [filterPage, filterSort, filterType])

  /* Client-Side Queries */

  const clientQueryEpisodes = async () => {
    const finalQuery = {
      podcastIds: id,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }
    return getEpisodesByQuery(finalQuery)
  }

  const clientQueryClips = async () => {
    const finalQuery = {
      podcastIds: id,
      includeEpisode: true,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }
    return getMediaRefsByQuery(finalQuery)
  }

  /* Render Helpers */

  const generateEpisodeListElements = () => {
    return episodesListData.map((listItem, index) => (
      <EpisodeListItem episode={listItem} key={`${keyPrefix}-${index}-${listItem?.id}`} podcast={serverPodcast} />
    ))
  }

  const generateClipListElements = () => {
    return clipsListData.map((listItem, index) => (
      <ClipListItem
        isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
        mediaRef={listItem}
        podcast={serverPodcast}
        key={`${keyPrefix}-${index}-${listItem?.id}`}
      />
    ))
  }

  /* Meta Tags */

  const podcastTitle = serverPodcast.title || t('untitledPodcast')
  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.podcast}/${serverPodcast.id}`,
    description: serverPodcast.description,
    imageAlt: podcastTitle,
    imageUrl: serverPodcast.shrunkImageUrl,
    title: podcastTitle
  }

  return (
    <>
      <Meta
        description={meta.description}
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
        twitterTitle={meta.title}
      />
      <PodcastPageHeader hideBelowMobileWidth podcast={serverPodcast} />
      <PageScrollableContent noPaddingTop>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <PageHeader
                isSubHeader
                primaryOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0]
                  setFilterState({
                    filterPage: 1,
                    filterSort,
                    filterType: selectedItem.key
                  })
                }}
                primaryOptions={PV.Filters.dropdownOptions.podcast.from}
                primarySelected={filterType}
                sortOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0]
                  setFilterState({
                    filterPage: 1,
                    filterSort: selectedItem.key,
                    filterType
                  })
                }}
                sortOptions={PV.Filters.dropdownOptions.podcast.sort}
                sortSelected={filterSort}
                text={filterType === PV.Filters.type._episodes ? t('Episodes') : t('Clips')}
              />
              <List>
                {filterType === PV.Filters.type._episodes && generateEpisodeListElements()}
                {filterType === PV.Filters.type._clips && generateClipListElements()}
              </List>
              <Pagination
                currentPageIndex={filterPage}
                handlePageNavigate={(newPage) => {
                  setFilterState({
                    filterPage: newPage,
                    filterSort,
                    filterType
                  })
                }}
                handlePageNext={() => {
                  const newPage = filterPage + 1
                  if (newPage <= pageCount) {
                    setFilterState({
                      filterPage: newPage,
                      filterSort,
                      filterType
                    })
                  }
                }}
                handlePagePrevious={() => {
                  const newPage = filterPage - 1
                  if (newPage > 0) {
                    setFilterState({
                      filterPage: newPage,
                      filterSort,
                      filterType
                    })
                  }
                }}
                pageCount={pageCount}
                show={pageCount > 1}
              />
            </>
          }
          sideColumnChildren={
            <SideContent>
              <PodcastPageHeader hideAboveMobileWidth podcast={serverPodcast} />
              <SideContentSection headerText={t('About')}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeTextHtml(linkifyHtml(serverPodcast.description))
                  }}
                />
              </SideContentSection>
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
  const { podcastId } = params

  const [defaultServerProps, podcastResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getPodcastById(podcastId as string)
  ])

  const podcast = podcastResponse.data

  const serverFilterType = PV.Filters.type._episodes
  const serverFilterSort = PV.Filters.sort._mostRecent
  const serverFilterPage = 1

  let serverEpisodes = []
  let serverEpisodesPageCount = 0
  const serverClips = []
  const serverClipsPageCount = 0
  if (serverFilterType === PV.Filters.type._episodes) {
    const response = await getEpisodesByQuery({
      podcastIds: podcastId,
      sort: serverFilterSort
    })
    const [episodesListData, episodesListDataCount] = response.data
    serverEpisodes = episodesListData
    serverEpisodesPageCount = calcListPageCount(episodesListDataCount)
  } else {
    // handle mediaRefs query
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverClips,
    serverClipsPageCount,
    serverEpisodes,
    serverEpisodesPageCount,
    serverFilterPage,
    serverFilterSort,
    serverFilterType,
    serverPodcast: podcast
  }

  return {
    props: serverProps
  }
}
