import linkifyHtml from 'linkify-html'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, Podcast } from 'podverse-shared'
import { getLightningKeysendValueItem } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  EpisodeListItem,
  Footer,
  List,
  LiveScheduleItem,
  WebLNV4VForm,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PodcastPageHeader,
  SearchBarFilter,
  SideContent,
  SideContentSection
} from '~/components'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { calcListPageCount } from '~/lib/utility/misc'
import { PV } from '~/resources'
import { getPodcastById } from '~/services/podcast'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { Page } from '~/lib/utility/page'
import { sanitizeTextHtml } from '~/lib/utility/sanitize'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'
import { getEpisodesAndLiveItems } from '~/services/liveItem'

interface ServerProps extends Page {
  serverClips: MediaRef[]
  serverClipsPageCount: number
  serverCookies: any
  serverEpisodes: Episode[]
  serverEpisodesPageCount: number
  serverFilterPage: number
  serverFilterSort: string
  serverFilterType: string
  serverLiveItemScheduleData: Episode[]
  serverPodcast: Podcast
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
  serverCookies,
  serverFilterPage,
  serverFilterSort,
  serverFilterType,
  serverEpisodes,
  serverEpisodesPageCount,
  serverLiveItemScheduleData,
  serverPodcast
}: ServerProps) {
  /* Initialize */

  const { id, value } = serverPodcast
  const { t } = useTranslation()
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [filterSearchText, setFilterSearchText] = useState<string>('')
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [filterType, setFilterType] = useState<string>(serverFilterType)
  const [episodesListData, setEpisodesListData] = useState<Episode[]>(serverEpisodes)
  const [episodesPageCount, setEpisodesPageCount] = useState<number>(serverEpisodesPageCount)
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips)
  const [clipsPageCount, setClipsPageCount] = useState<number>(serverClipsPageCount)
  const initialRender = useRef(true)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const pageCount = filterType === PV.Filters.type._episodes ? episodesPageCount : clipsPageCount
  const valueTag = getLightningKeysendValueItem(value)

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
      try {
        if (initialRender.current) {
          initialRender.current = false
        } else {
          OmniAural.pageIsLoadingShow()
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
        }
      } catch (err) {
        console.log(err)
      }
      OmniAural.pageIsLoadingHide()
      scrollToTopOfPageScrollableContent()
    })()
  }, [filterPage, filterSearchText, filterSort, filterType])

  /* Client-Side Queries */

  const clientQueryEpisodes = async () => {
    const finalQuery = {
      podcastIds: id,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }

    const data = await getEpisodesAndLiveItems(finalQuery, serverPodcast, serverFilterPage)
    const [combinedEpisodesData, episodesDataCount] = data.combinedEpisodes
    return { data: [combinedEpisodesData, episodesDataCount] }
  }

  const clientQueryClips = async () => {
    const finalQuery = {
      podcastIds: id,
      includeEpisode: true,
      ...(filterPage ? { page: filterPage } : {}),
      ...(filterSearchText ? { searchTitle: filterSearchText } : {}),
      ...(filterSort ? { sort: filterSort } : {})
    }
    return getMediaRefsByQuery(finalQuery)
  }

  /* Function Helpers */

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    setFilterPage(1)
    setFilterSort(filterSort)
    setFilterType(selectedItem.key)
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    setFilterPage(1)
    setFilterSort(selectedItem.key)
    setFilterType(filterType)
  }

  const _handleSearchSubmit = async (val: string) => {
    setFilterPage(1)
    setFilterSearchText(val)
  }

  const _handleSearchClear = async () => {
    setFilterPage(1)
    setFilterSearchText('')
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
        episode={listItem.episode}
        isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
        mediaRef={listItem}
        podcast={serverPodcast}
        key={`${keyPrefix}-${index}-${listItem?.id}`}
      />
    ))
  }

  const generateLiveScheduleItemListElements = () => {
    return serverLiveItemScheduleData.map((listItem, index) => (
      <LiveScheduleItem episode={listItem} key={`${keyPrefix}-${index}-${listItem?.id}`} />
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
                primaryOnChange={(selectedItems: any[]) => _handlePrimaryOnChange(selectedItems)}
                primaryOptions={PV.Filters.dropdownOptions.podcast.from}
                primarySelected={filterType}
                sortOnChange={(selectedItems: any[]) => _handleSortOnChange(selectedItems)}
                sortOptions={PV.Filters.dropdownOptions.podcast.sort}
                sortSelected={filterSort}
                text={filterType === PV.Filters.type._episodes ? t('Episodes') : t('Clips')}
              />
              <SearchBarFilter
                handleClear={_handleSearchClear}
                handleSubmit={_handleSearchSubmit}
                placeholder={filterType === PV.Filters.type._episodes ? t('Search episodes') : t('Search clips')}
                smaller
              />
              {filterType === PV.Filters.type._episodes && <List>{generateEpisodeListElements()}</List>}
              {filterType === PV.Filters.type._clips && <List>{generateClipListElements()}</List>}
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
              {serverLiveItemScheduleData.length > 0 && (
                <SideContentSection headerText={t('Live Schedule')}>
                  {generateLiveScheduleItemListElements()}
                </SideContentSection>
              )}
              {
                valueTag && (
                  <SideContentSection headerText={t('Value-4-Value')}>
                    <WebLNV4VForm podcast={serverPodcast} serverCookies={serverCookies} valueTag={valueTag} />
                  </SideContentSection>
                )
              }
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
  let serverLiveItemScheduleData = []
  if (serverFilterType === PV.Filters.type._episodes) {
    const data = await getEpisodesAndLiveItems(
      {
        podcastIds: podcastId,
        sort: serverFilterSort
      },
      podcast,
      serverFilterPage
    )
    const [combinedEpisodesData, episodesDataCount] = data.combinedEpisodes
    serverLiveItemScheduleData = data.scheduledLiveItems
    serverEpisodes = combinedEpisodesData
    serverEpisodesPageCount = calcListPageCount(episodesDataCount)
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
    serverLiveItemScheduleData,
    serverPodcast: podcast
  }

  return {
    props: serverProps
  }
}
