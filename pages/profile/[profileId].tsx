import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { MediaRef, Playlist, Podcast, User } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  Footer,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  PlaylistListItem,
  PodcastListItem,
  ProfilePageHeader,
  scrollToTopOfPageScrollableContent
} from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getPublicUser, updateLoggedInUser } from '~/services/user'
import { getPodcastsByQuery } from '~/services/podcast'
import { isNotClipsSortOption, isNotPodcastsSubscribedSortOption } from '~/resources/Filters'
import { getLoggedInUserMediaRefs, getUserMediaRefs } from '~/services/mediaRef'
import { getLoggedInUserPlaylists, getUserPlaylists } from '~/services/playlist'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'
import { useRouter } from 'next/router'

interface ServerProps extends Page {
  serverCookies: any
  serverFilterType: string
  serverFilterPage: number
  serverFilterSort: string
  serverUser: User
  serverUserListData: (Podcast | MediaRef | Playlist)[]
  serverUserListDataCount: number
}

const keyPrefix = 'pages_profile'

export default function Profile({
  serverCookies,
  serverFilterType,
  serverFilterPage,
  serverFilterSort,
  serverUser,
  serverUserListData,
  serverUserListDataCount
}: ServerProps) {
  /* Initialize */

  const router = useRouter()
  const { t } = useTranslation()
  const [filterType, setFilterType] = useState<string>(serverFilterType)
  const [filterSort, setFilterSort] = useState<string>(serverFilterSort)
  const [filterPage, setFilterPage] = useState<number>(serverFilterPage)
  const [user, setUser] = useState<User>(serverUser)
  const [listData, setListData] = useState<(Podcast | MediaRef | Playlist)[]>(serverUserListData)
  const [listDataCount, setListDataCount] = useState<number>(serverUserListDataCount)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editingUserName, setEditingUserName] = useState<string>(serverUser.name)
  const [editingUserIsPublic] = useState<boolean>(serverUser.isPublic)
  const initialRender = useRef(true)
  const pageSubTitle =
    filterType === PV.Filters.type._clips
      ? t('Clips')
      : filterType === PV.Filters.type._podcasts
      ? t('Podcasts')
      : t('Playlists')
  const pageCount = Math.ceil(listDataCount / PV.Config.QUERY_RESULTS_LIMIT_DEFAULT)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]
  const isLoggedInUserProfile = userInfo?.id && userInfo.id === user?.id

  /* useEffects */

  useEffect(() => {
    handleMyProfilePageRefresh()
  }, [router.asPath])

  useEffect(() => {
    ;(async () => {
      if (initialRender.current) {
        initialRender.current = false
      } else {
        OmniAural.pageIsLoadingShow()
        if (filterType === PV.Filters.type._podcasts) {
          const { data } = await clientQueryUserPodcasts()
          const [newUserPodcasts, newUserPodcastsCount] = data
          setListData(newUserPodcasts)
          setListDataCount(newUserPodcastsCount)
        } else if (filterType === PV.Filters.type._clips) {
          const [newListData, newListDataCount] = await clientQueryUserClips()
          setListData(newListData)
          setListDataCount(newListDataCount)
        } else {
          const [newListData, newListDataCount] = await clientQueryUserPlaylists()
          setListData(newListData)
          setListDataCount(newListDataCount)
        }
        scrollToTopOfPageScrollableContent()
        OmniAural.pageIsLoadingHide()
      }
    })()
  }, [filterType, filterSort, filterPage])

  const handleMyProfilePageRefresh = () => {
    setFilterPage(serverFilterPage)
    setFilterSort(serverFilterSort)
    setFilterType(serverFilterType)
    setUser(serverUser)
    setListData(serverUserListData)
    setListDataCount(serverUserListDataCount)
    setIsEditing(false)
    setEditingUserName(serverUser.name)
  }

  /* Client-Side Queries */

  const clientQueryUserPodcasts = async () => {
    const subscribedPodcastIds = user?.subscribedPodcastIds || []
    if (subscribedPodcastIds.length === 0) {
      return null
    } else {
      const finalQuery = {
        podcastIds: subscribedPodcastIds,
        ...(filterPage ? { page: filterPage } : {}),
        ...(filterSort ? { sort: filterSort } : {})
      }
      return getPodcastsByQuery(finalQuery)
    }
  }

  const clientQueryUserClips = async () => {
    if (isLoggedInUserProfile) {
      return getLoggedInUserMediaRefs()
    } else {
      const finalQuery = {
        ...(filterPage ? { page: filterPage } : {}),
        ...(filterSort ? { sort: filterSort } : {})
      }

      return getUserMediaRefs(user.id, finalQuery)
    }
  }

  const clientQueryUserPlaylists = async () => {
    if (isLoggedInUserProfile) {
      return getLoggedInUserPlaylists()
    } else {
      return getUserPlaylists(user.id, filterPage)
    }
  }

  /* Function Helpers */

  const _handleEditCancel = () => {
    setIsEditing(false)
    setEditingUserName(user.name)
  }

  const _handleEditSave = async () => {
    const userData = {
      id: user.id,
      name: editingUserName || '',
      isPublic: editingUserIsPublic
    }
    OmniAural.pageIsLoadingShow()
    const newUser = await updateLoggedInUser(userData)
    setUser(newUser)
    OmniAural.pageIsLoadingHide()
    setIsEditing(false)
  }

  const _handleEditStart = () => {
    setIsEditing(true)
  }

  const _handleChangeIsPublic = async (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    const isPublic = selectedItem.key === PV.Users.privacyKeys.public
    const userData = {
      id: user.id,
      name: editingUserName || '',
      isPublic
    }
    OmniAural.pageIsLoadingShow()
    const newUser = await updateLoggedInUser(userData)
    setUser(newUser)
    OmniAural.pageIsLoadingHide()
  }

  const _handlePrimaryOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterType) setFilterPage(1)

    if (selectedItem.key === PV.Filters.type._clips && isNotClipsSortOption(filterSort)) {
      setFilterSort(PV.Filters.sort._mostRecent)
    } else if (selectedItem.key === PV.Filters.type._podcasts && isNotPodcastsSubscribedSortOption(filterSort)) {
      setFilterSort(PV.Filters.sort._alphabetical)
    }

    setFilterType(selectedItem.key)
  }

  const _handleSortOnChange = (selectedItems: any[]) => {
    const selectedItem = selectedItems[0]
    if (selectedItem.key !== filterSort) setFilterPage(1)
    setFilterSort(selectedItem.key)
  }

  /* Render Helpers */

  const generateListElements = () => {
    /* *TODO* update the listItem type to Podcast | MediaRef | Playlist
        and make sure it still builds. */
    return listData.map((listItem: any, index: number) => {
      if (listItem.podcastIndexId) {
        return <PodcastListItem key={`${keyPrefix}-${index}`} podcast={listItem} serverCookies={serverCookies} />
      } else if (listItem.startTime) {
        return (
          <ClipListItem
            episode={listItem.episode}
            isLoggedInUserMediaRef={isLoggedInUserProfile}
            key={`${keyPrefix}-${index}-${listItem?.id}`}
            mediaRef={listItem}
            podcast={listItem.episode.podcast}
            serverCookies={serverCookies}
            showImage
          />
        )
      } else {
        return <PlaylistListItem key={`${keyPrefix}-${index}-${listItem?.id}`} playlist={listItem} />
      }
    })
  }

  /* Meta Tags */

  let meta = {} as any
  if (serverUser) {
    meta = {
      currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.profile}/${serverUser.id}`,
      description: `${serverUser.name ? serverUser.name : t('Anonymous')}`,
      title: `${serverUser.name ? serverUser.name : t('Anonymous')}`
    }
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={!serverUser.isPublic}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <ProfilePageHeader
        handleChangeIsPublic={_handleChangeIsPublic}
        handleEditCancel={_handleEditCancel}
        handleEditSave={_handleEditSave}
        handleEditStart={_handleEditStart}
        handleUserNameOnChange={setEditingUserName}
        isEditing={isEditing}
        user={user}
      />
      <PageScrollableContent noPaddingTop>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <PageHeader
                isSubHeader
                noMarginBottom
                primaryOnChange={_handlePrimaryOnChange}
                primaryOptions={PV.Filters.dropdownOptions.profile.types}
                primarySelected={filterType}
                sortOnChange={_handleSortOnChange}
                sortOptions={
                  filterType === PV.Filters.type._clips
                    ? PV.Filters.dropdownOptions.clips.sort.subscribed
                    : filterType === PV.Filters.type._podcasts
                    ? PV.Filters.dropdownOptions.podcasts.sort.subscribed
                    : null
                }
                sortSelected={filterSort}
                text={pageSubTitle}
              />
              <List>{generateListElements()}</List>
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
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params, query } = ctx
  const { profileId }: any = params
  const { type } = query
  const serverCookies = ctx.req.cookies || {}

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps
  const isLoggedInUserProfile = serverUserInfo?.id && serverUserInfo.id === profileId

  const serverFilterType =
    type === 'clips'
      ? PV.Filters.type._clips
      : type === 'playlists'
      ? PV.Filters.type._playlists
      : PV.Filters.type._podcasts

  const serverFilterSort = type === 'clips' ? PV.Filters.sort._mostRecent : PV.Filters.sort._alphabetical
  const serverFilterPage = 1

  let serverUser = serverUserInfo
  let serverUserListData = []
  let serverUserListDataCount = 0
  if (!serverUserInfo || serverUserInfo.id !== profileId) {
    serverUser = await getPublicUser(profileId as string)
  }

  if (type === 'clips') {
    if (isLoggedInUserProfile) {
      const data = await getLoggedInUserMediaRefs(serverCookies.Authorization)
      const [mediaRefs, mediaRefsCount] = data
      serverUserListData = mediaRefs
      serverUserListDataCount = mediaRefsCount
    } else {
      const finalQuery = {
        page: 1,
        sort: serverFilterSort
      }
      const data = await getUserMediaRefs(profileId, finalQuery)
      const [mediaRefs, mediaRefsCount] = data
      serverUserListData = mediaRefs
      serverUserListDataCount = mediaRefsCount
    }
  } else if (type === 'playlists') {
    if (isLoggedInUserProfile) {
      const data = await getLoggedInUserPlaylists(serverCookies.Authorization)
      const [playlists, playlistsCount] = data
      serverUserListData = playlists
      serverUserListDataCount = playlistsCount
    } else {
      const data = await getUserPlaylists(profileId, serverFilterPage)
      const [playlists, playlistsCount] = data
      serverUserListData = playlists
      serverUserListDataCount = playlistsCount
    }
  } else {
    const subscribedPodcastIds = serverUser?.subscribedPodcastIds || []
    if (subscribedPodcastIds.length > 0) {
      const response = await getPodcastsByQuery({
        podcastIds: subscribedPodcastIds,
        sort: serverFilterSort
      })
      const [podcasts, podcastsCount] = response.data
      serverUserListData = podcasts
      serverUserListDataCount = podcastsCount
    }
  }

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverFilterType,
    serverFilterPage,
    serverFilterSort,
    serverUser,
    serverUserListData,
    serverUserListDataCount
  }

  return {
    props: serverProps
  }
}
