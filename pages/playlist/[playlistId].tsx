import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, Playlist } from 'podverse-shared'
import { useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  EpisodeListItem,
  Footer,
  List,
  Meta,
  PageScrollableContent,
  PlaylistPageHeader
} from '~/components'
import { PV } from '~/resources'
import { Page } from '~/lib/utility/page'
import { isEpisode } from '~/lib/utility/typeHelpers'
import {
  addOrRemovePlaylistItemEpisode,
  addOrRemovePlaylistItemMediaRef,
  combineAndSortPlaylistItems,
  getPlaylist,
  updatePlaylist
} from '~/services/playlist'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { OmniAuralState } from '~/state/omniauralState'

interface ServerProps extends Page {
  serverPlaylist: Playlist
  serverPlaylistSortedItems: [Episode | MediaRef]
}

const keyPrefix = 'pages_playlist'

export default function Playlist({ serverPlaylist, serverPlaylistSortedItems }: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [playlist, setPlaylist] = useState<Playlist>(serverPlaylist)
  const [playlistSortedItems, setPlaylistSortedItems] = useState<[Episode | MediaRef]>(serverPlaylistSortedItems)
  const [editingPlaylistTitle, setEditingPlaylistTitle] = useState<string>(serverPlaylist.title)
  const [editingPlaylistIsPublic] = useState<boolean>(serverPlaylist.isPublic)
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]

  /* Function Helpers */

  const _handleRemoveEpisode = async (episodeId: string) => {
    const response = await addOrRemovePlaylistItemEpisode(playlist.id, episodeId)
    if (response.actionTaken === 'removed') {
      const newPlaylistSortedItems = playlistSortedItems.filter(
        (playlistItem: Episode | MediaRef) => playlistItem.id !== episodeId
      )
      setPlaylistSortedItems(newPlaylistSortedItems as any)
    }
  }

  const _handleRemoveMediaRef = async (mediaRefId: string) => {
    const response = await addOrRemovePlaylistItemMediaRef(playlist.id, mediaRefId)
    if (response.actionTaken === 'removed') {
      const newPlaylistSortedItems = playlistSortedItems.filter(
        (playlistItem: Episode | MediaRef) => playlistItem.id !== mediaRefId
      )
      setPlaylistSortedItems(newPlaylistSortedItems as any)
    }
  }

  /* Commenting out since all playlists are by default Only With Link right now */
  // const _handleChangeIsPublic = async (selectedItems: any[]) => {
  //   const selectedItem = selectedItems[0]
  //   const isPublic = selectedItem.key === PV.Playlists.privacyKeys.public
  //   const playlistData = {
  //     id: playlist.id,
  //     title: editingPlaylistTitle || '',
  //     isPublic
  //   }
  //   OmniAural.pageIsLoadingShow()
  //   const newPlaylist = await updatePlaylist(playlistData)
  //   setPlaylist(newPlaylist)
  //   OmniAural.pageIsLoadingHide()
  // }

  const _handleEditCancel = () => {
    setIsEditing(false)
    setEditingPlaylistTitle(playlist.title)
  }

  const _handleEditSave = async () => {
    const playlistData = {
      id: playlist.id,
      title: editingPlaylistTitle || '',
      isPublic: editingPlaylistIsPublic
    }
    OmniAural.pageIsLoadingShow()
    const newPlaylist = await updatePlaylist(playlistData)
    setPlaylist(newPlaylist)
    OmniAural.pageIsLoadingHide()
    setIsEditing(false)
  }

  const _handleEditStart = () => {
    setIsEditing(true)
  }

  /* Render Helpers */

  const generatePlaylistItemElements = (playlistItems: (Episode | MediaRef)[]) => {
    return playlistItems.map((playlistItem, index) => {
      if (isEpisode(playlistItem)) {
        const episode = playlistItem
        return (
          <EpisodeListItem
            episode={episode}
            handleRemove={() => _handleRemoveEpisode(episode.id)}
            key={`${keyPrefix}-episode-${index}-${episode.id}`}
            podcast={episode.podcast as any}
            showPodcastInfo
            showRemoveButton={isEditing}
          />
        )
      } else {
        const mediaRef = playlistItem
        return (
          <ClipListItem
            episode={mediaRef.episode}
            handleRemove={() => _handleRemoveMediaRef(mediaRef.id)}
            isLoggedInUserMediaRef={userInfo && userInfo.id === mediaRef?.owner?.id}
            key={`${keyPrefix}-clip-${index}`}
            mediaRef={mediaRef}
            podcast={mediaRef.episode.podcast}
            showImage
            showRemoveButton={isEditing}
          />
        )
      }
    })
  }

  /* Meta Tags */

  let meta = {} as any
  if (playlist) {
    meta = {
      currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.playlist}/${playlist.id}`,
      description: `${playlist.title ? playlist.title : t('untitledPlaylist')}${t('playlistOnPodverse')}${
        playlist.description ? `- ${playlist.description}` : ''
      }`,
      title: `${playlist.title ? playlist.title : t('untitledPlaylist')}`
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
        robotsNoIndex={!playlist.isPublic}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PlaylistPageHeader
        // handleChangeIsPublic={_handleChangeIsPublic}
        handleEditCancel={_handleEditCancel}
        handleEditSave={_handleEditSave}
        handleEditStart={_handleEditStart}
        handlePlaylistTitleOnChange={setEditingPlaylistTitle}
        isEditing={isEditing}
        playlist={playlist}
      />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <div className='page-header-spacer' />
              <List>{generatePlaylistItemElements(playlistSortedItems)}</List>
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
  const { locale, params } = ctx
  const { playlistId } = params

  const [defaultServerProps, playlist] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getPlaylist(playlistId as string)
  ])

  const sortedPlaylistItems = combineAndSortPlaylistItems(
    playlist.episodes,
    playlist.mediaRefs,
    playlist.itemsOrder
  ) as any

  const serverProps: ServerProps = {
    ...defaultServerProps,
    serverPlaylist: playlist,
    serverPlaylistSortedItems: sortedPlaylistItems
  }

  return {
    props: serverProps
  }
}
